(function () {
    var STORAGE_KEY = "swap_demo_bookings_v1";
    var DEMO_LATENCY_MS = 520;

    var DAYS_ES = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
    var MONTHS_ES = [
        "ene", "feb", "mar", "abr", "may", "jun",
        "jul", "ago", "sep", "oct", "nov", "dic"
    ];

    var RULES = {
        1: ["09:00", "09:45", "11:00", "12:15", "16:00", "17:15"],
        2: ["09:00", "10:15", "11:30", "16:30", "17:30"],
        3: ["10:00", "11:00", "12:00", "16:00"],
        4: ["09:00", "10:30", "12:00", "15:30", "17:00"],
        5: ["10:00", "11:30", "13:00", "15:00"],
        6: [],
        0: []
    };

    var state = {
        weekOffset: 0,
        dates: [],
        availability: {},
        selectedDate: null,
        selectedSlot: null,
        busy: false
    };

    function pad(value) {
        return value < 10 ? "0" + value : String(value);
    }

    function toDateKey(date) {
        return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate());
    }

    function fromDateKey(key) {
        var parts = key.split("-").map(Number);
        return new Date(parts[0], parts[1] - 1, parts[2]);
    }

    function labelDate(date) {
        return DAYS_ES[date.getDay()] + " " + date.getDate() + " " + MONTHS_ES[date.getMonth()];
    }

    function startOfDay(date) {
        var d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d;
    }

    function getStorage() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        } catch (error) {
            return [];
        }
    }

    function setStorage(items) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }

    function seedReservationsIfNeeded() {
        var items = getStorage();
        if (items.length > 0) return;
        var today = startOfDay(new Date());

        var first = new Date(today);
        first.setDate(today.getDate() + 1);

        var second = new Date(today);
        second.setDate(today.getDate() + 3);

        setStorage([
            {
                id: "seed-1",
                dateKey: toDateKey(first),
                time: "10:15",
                name: "Paciente Demo",
                service: "Consulta de seguimiento",
                createdAt: new Date().toISOString()
            },
            {
                id: "seed-2",
                dateKey: toDateKey(second),
                time: "16:00",
                name: "Paciente Demo 2",
                service: "Control prenatal",
                createdAt: new Date().toISOString()
            }
        ]);
    }

    function withLatency(data) {
        return new Promise(function (resolve) {
            setTimeout(function () {
                resolve(data);
            }, DEMO_LATENCY_MS);
        });
    }

    // Simulates backend endpoint: GET /availability?from=...&to=...
    function apiFetchAvailability(fromDate, toDate) {
        var reservations = getStorage();
        var map = {};
        var cursor = startOfDay(fromDate);
        var end = startOfDay(toDate);

        while (cursor <= end) {
            var key = toDateKey(cursor);
            var baseSlots = (RULES[cursor.getDay()] || []).slice();
            var reserved = reservations
                .filter(function (item) { return item.dateKey === key; })
                .map(function (item) { return item.time; });
            map[key] = baseSlots.filter(function (slot) { return reserved.indexOf(slot) === -1; });
            cursor.setDate(cursor.getDate() + 1);
        }

        return withLatency(map);
    }

    // Simulates backend endpoint: POST /bookings
    function apiCreateBooking(payload) {
        var reservations = getStorage();
        var exists = reservations.some(function (item) {
            return item.dateKey === payload.dateKey && item.time === payload.time;
        });

        if (exists) {
            return new Promise(function (_, reject) {
                setTimeout(function () {
                    reject(new Error("El horario ya fue reservado. Actualiza la agenda y elige otro."));
                }, DEMO_LATENCY_MS);
            });
        }

        var booking = {
            id: "res-" + Date.now(),
            dateKey: payload.dateKey,
            time: payload.time,
            name: payload.name,
            phone: payload.phone,
            service: payload.service,
            createdAt: new Date().toISOString()
        };

        reservations.push(booking);
        setStorage(reservations);
        return withLatency(booking);
    }

    function getWeekDates() {
        var today = startOfDay(new Date());
        var weekStart = new Date(today);
        weekStart.setDate(today.getDate() + state.weekOffset * 7);

        var dates = [];
        for (var i = 0; i < 7; i++) {
            var d = new Date(weekStart);
            d.setDate(weekStart.getDate() + i);
            dates.push(d);
        }
        return dates;
    }

    function setBusy(isBusy) {
        state.busy = isBusy;
        var shell = document.getElementById("demo-booking-shell");
        if (!shell) return;
        shell.classList.toggle("is-loaded", !isBusy);
        shell.setAttribute("aria-busy", isBusy ? "true" : "false");
    }

    function showFeedback(type, message) {
        var el = document.getElementById("demo-feedback");
        if (!el) return;

        el.classList.remove("hidden", "bg-error-container", "text-on-error-container", "bg-primary-fixed", "text-on-primary-fixed");
        if (type === "error") {
            el.classList.add("bg-error-container", "text-on-error-container");
        } else {
            el.classList.add("bg-primary-fixed", "text-on-primary-fixed");
        }
        el.textContent = message;
    }

    function updateSummary() {
        var el = document.getElementById("demo-selected-summary");
        if (!el) return;

        if (!state.selectedDate || !state.selectedSlot) {
            el.textContent = "Aun no seleccionas fecha y hora.";
            return;
        }

        var date = fromDateKey(state.selectedDate);
        el.textContent = "Seleccionaste: " + labelDate(date) + " a las " + state.selectedSlot + " hrs.";
    }

    function renderDays() {
        var container = document.getElementById("demo-days");
        var label = document.getElementById("demo-week-label");
        if (!container || !label) return;

        var first = state.dates[0];
        var last = state.dates[state.dates.length - 1];
        label.textContent = first.getDate() + " " + MONTHS_ES[first.getMonth()] + " - " + last.getDate() + " " + MONTHS_ES[last.getMonth()];

        container.innerHTML = "";
        state.dates.forEach(function (date) {
            var key = toDateKey(date);
            var slots = state.availability[key] || [];
            var isActive = state.selectedDate === key;
            var disabled = slots.length === 0;

            var button = document.createElement("button");
            button.type = "button";
            button.className = "booking-day rounded-xl px-3 py-3 text-left " +
                (isActive ? "is-active" : "") + " " +
                (disabled ? "is-disabled" : "");
            button.disabled = disabled;
            button.innerHTML =
                '<p class="font-label-caps text-label-caps">' + DAYS_ES[date.getDay()] + '</p>' +
                '<p class="font-headline-sm text-headline-sm leading-none mt-1">' + date.getDate() + '</p>' +
                '<p class="font-body-sm text-body-sm mt-1">' + slots.length + ' horarios</p>';

            if (!disabled) {
                button.addEventListener("click", function () {
                    state.selectedDate = key;
                    state.selectedSlot = null;
                    renderDays();
                    renderSlots();
                    updateSummary();
                });
            }

            container.appendChild(button);
        });
    }

    function renderSlots() {
        var container = document.getElementById("demo-slots");
        if (!container) return;

        container.innerHTML = "";
        if (!state.selectedDate) {
            container.innerHTML = '<p class="col-span-full font-body-sm text-body-sm text-on-surface-variant">Selecciona un dia para ver horarios.</p>';
            return;
        }

        var slots = state.availability[state.selectedDate] || [];
        if (slots.length === 0) {
            container.innerHTML = '<p class="col-span-full font-body-sm text-body-sm text-on-surface-variant">No hay horarios disponibles para este dia.</p>';
            return;
        }

        slots.forEach(function (slot) {
            var isActive = slot === state.selectedSlot;
            var button = document.createElement("button");
            button.type = "button";
            button.className = "booking-slot rounded-lg py-2 font-label-caps text-label-caps " + (isActive ? "is-active" : "");
            button.textContent = slot;
            button.addEventListener("click", function () {
                state.selectedSlot = slot;
                renderSlots();
                updateSummary();
            });
            container.appendChild(button);
        });
    }

    function renderReservationsPreview() {
        var list = document.getElementById("demo-reservations-preview");
        if (!list) return;

        var reservations = getStorage()
            .slice()
            .sort(function (a, b) {
                var left = a.dateKey + " " + a.time;
                var right = b.dateKey + " " + b.time;
                return left < right ? -1 : 1;
            })
            .slice(0, 4);

        list.innerHTML = "";
        if (reservations.length === 0) {
            list.innerHTML = '<li class="font-body-sm text-body-sm text-on-surface-variant">Sin reservas registradas.</li>';
            return;
        }

        reservations.forEach(function (item) {
            var li = document.createElement("li");
            var date = fromDateKey(item.dateKey);
            li.className = "bg-surface-container-low rounded-lg px-3 py-2";
            li.innerHTML =
                '<p class="font-body-sm text-body-sm text-on-surface"><strong>' + labelDate(date) + '</strong> - ' + item.time + '</p>' +
                '<p class="font-body-sm text-body-sm text-on-surface-variant">' + item.name + " / " + item.service + '</p>';
            list.appendChild(li);
        });
    }

    function chooseFirstAvailable() {
        var first = state.dates.find(function (date) {
            var key = toDateKey(date);
            return (state.availability[key] || []).length > 0;
        });

        if (!first) {
            state.selectedDate = null;
            state.selectedSlot = null;
            return;
        }

        state.selectedDate = toDateKey(first);
        state.selectedSlot = null;
    }

    function loadWeek() {
        state.dates = getWeekDates();
        var from = state.dates[0];
        var to = state.dates[state.dates.length - 1];

        setBusy(true);
        apiFetchAvailability(from, to)
            .then(function (availability) {
                state.availability = availability;

                if (!state.selectedDate || state.dates.every(function (d) { return toDateKey(d) !== state.selectedDate; })) {
                    chooseFirstAvailable();
                }

                renderDays();
                renderSlots();
                renderReservationsPreview();
                updateSummary();
            })
            .catch(function () {
                showFeedback("error", "No se pudo cargar disponibilidad demo. Intenta de nuevo.");
            })
            .finally(function () {
                setBusy(false);
            });
    }

    function handleSubmit(event) {
        event.preventDefault();

        var name = document.getElementById("demo-name").value.trim();
        var phone = document.getElementById("demo-phone").value.trim();
        var service = document.getElementById("demo-service").value;

        if (!name || !phone || !service) {
            showFeedback("error", "Completa nombre, telefono y tipo de consulta.");
            return;
        }

        if (!state.selectedDate || !state.selectedSlot) {
            showFeedback("error", "Selecciona fecha y horario antes de reservar.");
            return;
        }

        var submitButton = document.getElementById("demo-booking-submit");
        submitButton.disabled = true;
        submitButton.textContent = "Reservando...";

        apiCreateBooking({
            dateKey: state.selectedDate,
            time: state.selectedSlot,
            name: name,
            phone: phone,
            service: service
        })
            .then(function () {
                showFeedback("success", "Cita demo reservada correctamente. La agenda se actualizo en tiempo real.");
                document.getElementById("demo-booking-form").reset();
                state.selectedSlot = null;
                return loadWeek();
            })
            .catch(function (error) {
                showFeedback("error", error.message || "No se pudo reservar el horario.");
                loadWeek();
            })
            .finally(function () {
                submitButton.disabled = false;
                submitButton.innerHTML = '<span class="material-symbols-outlined" style="font-size:18px">event_available</span>Reservar cita demo';
            });
    }

    function init() {
        var shell = document.getElementById("demo-booking-shell");
        if (!shell) return;

        seedReservationsIfNeeded();

        var prevButton = document.getElementById("demo-week-prev");
        var nextButton = document.getElementById("demo-week-next");
        var form = document.getElementById("demo-booking-form");

        if (prevButton) {
            prevButton.addEventListener("click", function () {
                state.weekOffset -= 1;
                state.selectedDate = null;
                state.selectedSlot = null;
                loadWeek();
            });
        }

        if (nextButton) {
            nextButton.addEventListener("click", function () {
                state.weekOffset += 1;
                state.selectedDate = null;
                state.selectedSlot = null;
                loadWeek();
            });
        }

        if (form) {
            form.addEventListener("submit", handleSubmit);
        }

        loadWeek();
    }

    document.addEventListener("DOMContentLoaded", init);
})();
