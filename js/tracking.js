(function () {
    function safeCall(fn, args) {
        try {
            fn.apply(null, args);
        } catch (error) {
            // Fail silently to avoid breaking UX in static deployments.
        }
    }

    function serialize(payload) {
        return payload && typeof payload === "object" ? payload : {};
    }

    var tracker = {
        track: function (name, payload) {
            var cfg = (window.AppConfig && window.AppConfig.tracking) || {};
            var data = serialize(payload);

            if (cfg.debug) {
                console.log("[tracking]", name, data);
            }

            if (typeof window.gtag === "function") {
                safeCall(window.gtag, ["event", name, data]);
            }

            if (typeof window.fbq === "function") {
                safeCall(window.fbq, ["trackCustom", name, data]);
            }
        }
    };

    function bindTrackClicks() {
        document.querySelectorAll("[data-track-event]").forEach(function (el) {
            el.addEventListener("click", function () {
                tracker.track(el.getAttribute("data-track-event"), {
                    source: el.getAttribute("data-track-source") || "site"
                });
            });
        });
    }

    window.SwapTracking = tracker;

    document.addEventListener("DOMContentLoaded", function () {
        tracker.track("page_view_landing", {
            page: "home"
        });
        bindTrackClicks();
    });
})();
