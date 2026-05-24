(function () {

    var DAYS_ES = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
    var MONTHS_ES = [
        "ene", "feb", "mar", "abr", "may", "jun",
        "jul", "ago", "sep", "oct", "nov", "dic"
    ];

    var state = {
        weekOffset: 0,
        dates: [],
        availability: {},
        selectedDate: null,
        selectedSlot: null,
        busy: false
    };

    function track(name, payload) {
        if (window.SwapTracking && typeof window.SwapTracking.track === "function") {
            window.SwapTracking.track(name, payload || {});
        }
    }

    function sanitizePhone(value) {
        return String(value || "").replace(/\D/g, "").slice(0, 10);
    }

    function setupPhoneInput(id) {
        var input = document.getElementById(id);
        if (!input) return;
        input.addEventListener("input", function () {
            input.value = sanitizePhone(input.value);
        });
    }

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

    function ensureApiClient() {
        if (!window.SwapApiClient) {
            throw new Error("No se encontro el cliente API. Verifica que js/api-client.js este cargado.");
        }
        return window.SwapApiClient;
    }

    function normalizeAvailability(map, fromDate, toDate) {
        var safeMap = map && typeof map === "object" ? map : {};
        var normalized = {};
        var cursor = startOfDay(fromDate);
        var end = startOfDay(toDate);

        while (cursor <= end) {
            var key = toDateKey(cursor);
            normalized[key] = Array.isArray(safeMap[key]) ? safeMap[key] : [];
            cursor.setDate(cursor.getDate() + 1);
        }
        return normalized;
    }

    function apiFetchAvailability(fromDate, toDate) {
        var api = ensureApiClient();
        var fromKey = toDateKey(fromDate);
        var toKey = toDateKey(toDate);

        return api.getAvailability(fromKey, toKey)
            .then(function (map) {
                return normalizeAvailability(map, fromDate, toDate);
            });
    }

    function apiCreateBooking(payload) {
        var api = ensureApiClient();
        return api.createBooking(payload);
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

    function clearFeedback() {
        var el = document.getElementById("demo-feedback");
        if (!el) return;
        el.classList.add("hidden");
        el.textContent = "";
        el.classList.remove("bg-error-container", "text-on-error-container", "bg-primary-fixed", "text-on-primary-fixed");
    }

    function updateSummary() {
        var el = document.getElementById("demo-selected-summary");
        if (!el) return;

        if (!state.selectedDate || !state.selectedSlot) {
            el.innerHTML = '<span style="display:flex;align-items:center;gap:6px;color:#9e8a8a">' +
                '<span class="material-symbols-outlined" style="font-size:16px">touch_app</span>' +
                'Selecciona fecha y horario para continuar.' +
                '</span>';
            el.style.cssText = "background:#f5f3f3;border:1.5px dashed #d4c2c3;";
            return;
        }

        var date = fromDateKey(state.selectedDate);
        el.innerHTML =
            '<div style="display:flex;align-items:flex-start;gap:10px">' +
              '<span class="material-symbols-outlined" style="font-size:20px;color:#7c5357;margin-top:1px;flex-shrink:0">event_available</span>' +
              '<div>' +
                '<p style="font-weight:700;color:#7c5357;font-size:14px">' + labelDate(date) + ' &middot; ' + state.selectedSlot + ' hrs</p>' +
                '<p style="font-size:12px;color:#504444;margin-top:2px">Cita confirmada al completar el formulario.</p>' +
              '</div>' +
            '</div>';
        el.style.cssText = "background:linear-gradient(135deg,#ffdadc22 0%,#fdf8f8 100%);border:1.5px solid #e8b4b8;";
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
            var pillLabel = disabled ? "Sin hrs" : (slots.length + " hrs");
            button.innerHTML =
                '<p class="font-label-caps text-label-caps uppercase tracking-widest">' + DAYS_ES[date.getDay()] + '</p>' +
                '<p class="font-headline-sm text-headline-sm leading-none mt-1" style="font-size:22px">' + date.getDate() + '</p>' +
                '<span class="booking-day-pill">' + pillLabel + '</span>';

            if (!disabled) {
                button.addEventListener("click", function () {
                    clearFeedback();
                    state.selectedDate = key;
                    state.selectedSlot = null;
                    renderDays();
                    renderSlots();
                    updateSummary();
                    track("booking_demo_day_selected", { dateKey: key });
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
            button.innerHTML = '<span class="material-symbols-outlined" style="font-size:13px;line-height:1;opacity:.7">schedule</span>' + slot;
            button.addEventListener("click", function () {
                state.selectedSlot = slot;
                renderSlots();
                updateSummary();
                track("booking_demo_slot_selected", {
                    dateKey: state.selectedDate,
                    time: slot
                });
            });
            container.appendChild(button);
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
                updateSummary();
            })
            .catch(function (error) {
                showFeedback("error", (error && error.message) || "No se pudo cargar disponibilidad. Intenta de nuevo.");
                track("booking_demo_load_error", { reason: "availability_request_failed" });
            })
            .finally(function () {
                setBusy(false);
            });
    }

    function handleSubmit(event) {
        event.preventDefault();

        var name = document.getElementById("demo-name").value.trim();
        var phoneInput = document.getElementById("demo-phone");
        var phone = sanitizePhone(phoneInput ? phoneInput.value : "");
        if (phoneInput) phoneInput.value = phone;
        var service = document.getElementById("demo-service").value;

        if (!name || !phone || !service) {
            showFeedback("error", "Completa nombre, telefono y tipo de consulta.");
            track("booking_demo_validation_error", { reason: "missing_fields" });
            return;
        }

        if (phone.length !== 10) {
            showFeedback("error", "El telefono debe tener exactamente 10 digitos.");
            track("booking_demo_validation_error", { reason: "invalid_phone_length" });
            return;
        }

        if (!state.selectedDate || !state.selectedSlot) {
            showFeedback("error", "Selecciona fecha y horario antes de reservar.");
            track("booking_demo_validation_error", { reason: "missing_slot" });
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
            email: null,
            service: service,
            notes: null,
            firstVisit: false
        })
            .then(function (bookingResponse) {
                var confirmation = bookingResponse && bookingResponse.confirmationCode ?
                    (" Código: " + bookingResponse.confirmationCode + ".") : "";
                showFeedback("success", "Cita reservada correctamente." + confirmation);
                document.getElementById("demo-booking-form").reset();
                state.selectedSlot = null;
                track("booking_demo_reserved", {
                    dateKey: state.selectedDate,
                    service: service
                });
                return loadWeek();
            })
            .catch(function (error) {
                showFeedback("error", error.message || "No se pudo reservar el horario.");
                track("booking_demo_submit_error", { reason: "already_taken_or_error" });
                loadWeek();
            })
            .finally(function () {
                submitButton.disabled = false;
                submitButton.innerHTML = '<span class="material-symbols-outlined" style="font-size:18px">event_available</span>Reservar cita';
            });
    }

    function init() {
        var shell = document.getElementById("demo-booking-shell");
        if (!shell) return;

        setupPhoneInput("demo-phone");

        var prevButton = document.getElementById("demo-week-prev");
        var nextButton = document.getElementById("demo-week-next");
        var form = document.getElementById("demo-booking-form");

        if (prevButton) {
            prevButton.addEventListener("click", function () {
                clearFeedback();
                state.weekOffset -= 1;
                state.selectedDate = null;
                state.selectedSlot = null;
                loadWeek();
            });
        }

        if (nextButton) {
            nextButton.addEventListener("click", function () {
                clearFeedback();
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
        track("booking_demo_loaded", { mode: "backend" });
    }

    document.addEventListener("DOMContentLoaded", init);
})();
