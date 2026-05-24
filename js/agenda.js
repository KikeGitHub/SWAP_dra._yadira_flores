(function () {
    function getConfig() {
        return window.AppConfig || {};
    }

    function getWhatsAppNumber() {
        var cfg = getConfig();
        return (cfg.contacts && cfg.contacts.whatsappE164) || "5215576645037";
    }

    function waBase() {
        return "https://wa.me/" + getWhatsAppNumber();
    }

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

    // Simulated available slots per weekday (0=Sun … 6=Sat)
    var SLOTS = {
        presencial: {
            1: ["09:00", "10:30", "12:00", "16:00"],          // Mon
            2: ["09:00", "11:00", "16:00", "17:30"],          // Tue
            3: [],                                              // Wed
            4: ["09:00", "10:30", "12:00", "16:00", "17:30"], // Thu
            5: ["10:00", "11:30", "14:00"],                    // Fri
            6: [],                                              // Sat
            0: []                                               // Sun
        },
        video: {
            1: ["10:00", "15:00", "16:30"],   // Mon
            2: [],                             // Tue
            3: ["10:00", "11:00", "15:00"],   // Wed
            4: ["10:00", "16:00"],            // Thu
            5: ["09:00", "15:30"],            // Fri
            6: [],                             // Sat
            0: []                              // Sun
        }
    };

    var DAYS_ES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    var MONTHS_ES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun",
                     "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

    var state = {
        tab: "presencial",       // "presencial" | "video"
        selectedDayIndex: null,  // 0-6 (index in the 7-day window)
        selectedTime: null,
        dates: []                // array of Date objects (next 7 days)
    };

    /* ── helpers ── */
    function buildDates() {
        state.dates = [];
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        for (var i = 0; i < 7; i++) {
            var d = new Date(today);
            d.setDate(today.getDate() + i);
            state.dates.push(d);
        }
    }

    function slotsFor(dayIndex) {
        var dow = state.dates[dayIndex].getDay();
        return SLOTS[state.tab][dow] || [];
    }

    /* ── open / close ── */
    function openModal() {
        buildDates();
        state.selectedDayIndex = null;
        state.selectedTime = null;
        renderDays();
        renderSlots();
        document.getElementById("agenda-modal").classList.remove("hidden");
        document.body.style.overflow = "hidden";
        track("booking_modal_open", { source: "manual" });
    }

    function closeModal() {
        document.getElementById("agenda-modal").classList.add("hidden");
        document.body.style.overflow = "";
    }

    /* ── inline Google booking ── */
    function initInlineBooking() {
        var section = document.getElementById("reserva-google-inline");
        var shell = document.getElementById("google-booking-shell");
        var frame = document.getElementById("google-booking-frame");
        var fallback = document.getElementById("google-booking-fallback");
        if (!section || !shell || !frame || !fallback) return;

        var cfg = getConfig();
        var bookingCfg = cfg.booking || {};
        var legacyCfg = window.GoogleBookingConfig || {};
        var bookingUrl = bookingCfg.googleBookingUrl || legacyCfg.bookingUrl || frame.getAttribute("data-booking-url") || "";
        var fallbackText = "Hola Dra. vengo de su web y quiero confirmar mi cita.";

        frame.setAttribute("data-booking-url", bookingUrl);
        fallback.href = waBase() + "?text=" + encodeURIComponent(fallbackText);

        // Keeps the current WhatsApp modal as fallback while URL is still placeholder.
        var hasRealUrl = bookingUrl && bookingUrl.indexOf("TU_URL_DE_RESERVA") === -1;
        if (!hasRealUrl) {
            shell.classList.add("is-loaded");
            shell.setAttribute("aria-busy", "false");
            track("booking_inline_fallback", { reason: "missing_google_url" });
            return;
        }

        var loaded = false;
        var markLoaded = function () {
            if (loaded) return;
            loaded = true;
            shell.classList.add("is-loaded");
            shell.setAttribute("aria-busy", "false");
        };

        frame.addEventListener("load", markLoaded, { once: true });

        // Timebox loading feedback to avoid spinner hanging forever in blocked contexts.
        setTimeout(function () {
            if (!loaded) {
                shell.classList.add("has-timeout");
                shell.setAttribute("aria-busy", "false");
            }
        }, 12000);

        var hydrateFrame = function () {
            if (frame.getAttribute("src")) return;
            frame.setAttribute("src", bookingUrl);
            track("booking_inline_hydrated", { source: "google" });
        };

        if ("IntersectionObserver" in window) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        hydrateFrame();
                        observer.disconnect();
                    }
                });
            }, { rootMargin: "220px 0px" });
            observer.observe(section);
        } else {
            hydrateFrame();
        }
    }

    function goToInlineBooking() {
        var section = document.getElementById("reserva-google-inline");
        if (!section) {
            openModal();
            return;
        }
        section.scrollIntoView({ behavior: "smooth", block: "start" });
        track("booking_scroll_to_inline", { source: "cta" });
    }

    function applyDynamicWhatsAppLinks() {
        var number = getWhatsAppNumber();
        document.querySelectorAll("a[data-wa-link]").forEach(function (link) {
            var context = link.getAttribute("data-wa-context") || "web";
            var message = "Hola Dra. vengo de su web y quiero confirmar mi cita. (" + context + ")";
            link.href = "https://wa.me/" + number + "?text=" + encodeURIComponent(message);
        });
    }

    /* ── tabs ── */
    function switchTab(tab) {
        state.tab = tab;
        state.selectedDayIndex = null;
        state.selectedTime = null;
        track("booking_modal_tab_change", { tab: tab });

        // tab buttons
        ["presencial", "video"].forEach(function (t) {
            var btn = document.getElementById("tab-" + t);
            if (t === tab) {
                btn.classList.add("border-b-2", "border-primary", "text-primary");
                btn.classList.remove("text-on-surface-variant");
            } else {
                btn.classList.remove("border-b-2", "border-primary", "text-primary");
                btn.classList.add("text-on-surface-variant");
            }
        });

        // address line
        document.getElementById("agenda-address").textContent =
            tab === "presencial"
                ? "Tuxpan 2, Roma Sur – Cuauhtémoc, CDMX"
                : "Consulta en línea por videollamada";

        renderDays();
        renderSlots();
    }

    /* ── calendar ── */
    function renderDays() {
        var container = document.getElementById("agenda-days");
        container.innerHTML = "";
        state.dates.forEach(function (date, i) {
            var slots = slotsFor(i);
            var isToday = i === 0;
            var hasSlots = slots.length > 0;
            var isSelected = state.selectedDayIndex === i;

            var btn = document.createElement("button");
            btn.type = "button";
            btn.className = [
                "flex flex-col items-center gap-1 px-3 py-3 rounded-xl transition-all min-w-[64px] text-center",
                isSelected
                    ? "bg-primary text-on-primary shadow-md scale-105"
                    : hasSlots
                        ? "bg-surface hover:bg-primary-container hover:text-on-primary-container border border-outline-variant cursor-pointer"
                        : "bg-surface-container-lowest text-on-surface-variant opacity-40 cursor-not-allowed"
            ].join(" ");

            btn.disabled = !hasSlots;
            btn.innerHTML =
                '<span class="font-label-caps text-label-caps">' +
                DAYS_ES[date.getDay()] + "</span>" +
                '<span class="font-headline-sm text-headline-sm leading-none">' +
                date.getDate() + "</span>" +
                '<span class="font-body-sm text-body-sm opacity-80">' +
                MONTHS_ES[date.getMonth()] + "</span>" +
                (hasSlots && !isSelected
                    ? '<span class="w-1.5 h-1.5 rounded-full bg-primary mt-0.5 inline-block"></span>'
                    : "");

            if (hasSlots) {
                btn.addEventListener("click", function () {
                    state.selectedDayIndex = i;
                    state.selectedTime = null;
                    renderDays();
                    renderSlots();
                });
            }
            container.appendChild(btn);
        });
    }

    function renderSlots() {
        var container = document.getElementById("agenda-slots");
        container.innerHTML = "";
        if (state.selectedDayIndex === null) {
            container.innerHTML =
                '<p class="font-body-sm text-body-sm text-on-surface-variant text-center py-4">' +
                "Selecciona un día disponible para ver los horarios.</p>";
            return;
        }
        var slots = slotsFor(state.selectedDayIndex);
        if (slots.length === 0) {
            container.innerHTML =
                '<p class="font-body-sm text-body-sm text-on-surface-variant text-center py-4">' +
                "No hay horarios disponibles este día.</p>";
            return;
        }
        var grid = document.createElement("div");
        grid.className = "grid grid-cols-3 sm:grid-cols-4 gap-2";
        slots.forEach(function (time) {
            var btn = document.createElement("button");
            btn.type = "button";
            btn.className = [
                "py-2 rounded-lg font-label-caps text-label-caps transition-all",
                state.selectedTime === time
                    ? "bg-primary text-on-primary shadow"
                    : "bg-surface border border-outline-variant text-on-surface hover:bg-primary-container hover:text-on-primary-container"
            ].join(" ");
            btn.textContent = time;
            btn.addEventListener("click", function () {
                state.selectedTime = time;
                renderSlots();
            });
            grid.appendChild(btn);
        });
        container.appendChild(grid);
    }

    /* ── submit → WhatsApp ── */
    function buildMessage() {
        var nombre = document.getElementById("ag-nombre").value.trim();
        var telefonoInput = document.getElementById("ag-telefono");
        var telefono = sanitizePhone(telefonoInput ? telefonoInput.value : "");
        if (telefonoInput) telefonoInput.value = telefono;
        var email = document.getElementById("ag-email").value.trim();
        var servicio = document.getElementById("ag-servicio").value;
        var motivo = document.getElementById("ag-motivo").value.trim();
        var primera = document.querySelector('input[name="ag-primera"]:checked');

        if (!nombre || !telefono || !servicio) {
            showFormError("Por favor completa nombre, teléfono y tipo de consulta.");
            return null;
        }
        if (telefono.length !== 10) {
            showFormError("El teléfono debe tener exactamente 10 dígitos.");
            return null;
        }
        if (state.selectedDayIndex === null || state.selectedTime === null) {
            showFormError("Por favor selecciona un día y horario.");
            return null;
        }

        var modalidad = state.tab === "presencial" ? "Visita presencial" : "Videoconsulta";
        var fecha = state.selectedDayIndex !== null && state.selectedTime
            ? DAYS_ES[state.dates[state.selectedDayIndex].getDay()] + " " +
              state.dates[state.selectedDayIndex].getDate() + " de " +
              MONTHS_ES[state.dates[state.selectedDayIndex].getMonth()] +
              " a las " + state.selectedTime + " hrs"
            : "pendiente de confirmar";

        return (
            "Hola Dra. Yadira Flores, me gustaría agendar una cita.\n\n" +
            "👤 Nombre: " + nombre + "\n" +
            "📞 Teléfono: " + telefono + "\n" +
            (email ? "📧 Email: " + email + "\n" : "") +
            "🏥 Tipo de consulta: " + servicio + "\n" +
            "📋 Modalidad: " + modalidad + "\n" +
            "📅 Fecha y hora solicitada: " + fecha + "\n" +
            (primera ? "🌟 Primera visita: " + primera.value + "\n" : "") +
            (motivo ? "📝 Motivo: " + motivo : "")
        );
    }

    function showFormError(msg) {
        var el = document.getElementById("agenda-error");
        el.textContent = msg;
        el.classList.remove("hidden");
        setTimeout(function () { el.classList.add("hidden"); }, 4000);
    }

    function handleSubmit() {
        var msg = buildMessage();
        if (!msg) return;
        var url = waBase() + "?text=" + encodeURIComponent(msg);
        track("booking_modal_submit_whatsapp", { tab: state.tab });
        window.open(url, "_blank", "noopener,noreferrer");
    }

    /* ── init ── */
    document.addEventListener("DOMContentLoaded", function () {
        applyDynamicWhatsAppLinks();
        initInlineBooking();
        setupPhoneInput("ag-telefono");

        // open triggers
        document.querySelectorAll("[data-open-agenda]").forEach(function (el) {
            el.addEventListener("click", function (e) {
                e.preventDefault();
                goToInlineBooking();
            });
        });

        // close button
        var closeBtn = document.getElementById("agenda-close");
        if (closeBtn) closeBtn.addEventListener("click", closeModal);

        // backdrop click
        var backdrop = document.getElementById("agenda-backdrop");
        if (backdrop) backdrop.addEventListener("click", closeModal);

        // tab buttons
        var tabP = document.getElementById("tab-presencial");
        var tabV = document.getElementById("tab-video");
        if (tabP) tabP.addEventListener("click", function () { switchTab("presencial"); });
        if (tabV) tabV.addEventListener("click", function () { switchTab("video"); });

        // confirm button
        var confirmBtn = document.getElementById("agenda-confirm");
        if (confirmBtn) confirmBtn.addEventListener("click", handleSubmit);

        // Esc key
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") closeModal();
        });

        // ── Mobile menu ──
        var mobileBtn = document.getElementById("mobile-menu-btn");
        var mobileMenu = document.getElementById("mobile-menu");
        if (mobileBtn && mobileMenu) {
            mobileBtn.addEventListener("click", function () {
                var isOpen = !mobileMenu.classList.contains("hidden");
                mobileMenu.classList.toggle("hidden", isOpen);
                var icon = this.querySelector(".material-symbols-outlined");
                icon.textContent = isOpen ? "menu" : "close";
                this.setAttribute("aria-expanded", String(!isOpen));
            });
            // close on link click
            mobileMenu.querySelectorAll("a").forEach(function (link) {
                link.addEventListener("click", function () {
                    mobileMenu.classList.add("hidden");
                    var icon = mobileBtn.querySelector(".material-symbols-outlined");
                    icon.textContent = "menu";
                    mobileBtn.setAttribute("aria-expanded", "false");
                });
            });
        }
    });
})();
