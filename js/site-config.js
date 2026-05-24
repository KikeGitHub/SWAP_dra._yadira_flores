(function () {
    var appConfig = {
        clinic: {
            name: "Dra. Yadira Flores",
            city: "CDMX"
        },
        contacts: {
            whatsappE164: "5215576645037",
            whatsappDisplay: "+52 1 55 7664 5037"
        },
        booking: {
            // Replace this with the real Google Appointment Schedule URL.
            googleBookingUrl: "",
            fallbackMode: "whatsapp"
        },
        api: {
            baseUrl: "http://localhost:8080",
            clientId: "dra-yadira",
            timeoutMs: 12000
        },
        tracking: {
            ga4MeasurementId: "",
            metaPixelId: "",
            debug: true
        }
    };

    window.AppConfig = appConfig;
    // Backward compatibility for existing integration points.
    window.GoogleBookingConfig = {
        bookingUrl: appConfig.booking.googleBookingUrl
    };
})();
