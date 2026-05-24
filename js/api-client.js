(function () {
    function getConfig() {
        var app = window.AppConfig || {};
        var api = app.api || {};
        return {
            baseUrl: (api.baseUrl || "http://localhost:8080").replace(/\/$/, ""),
            clientId: api.clientId || "dra-yadira",
            timeoutMs: typeof api.timeoutMs === "number" ? api.timeoutMs : 12000
        };
    }

    function normalizeErrorMessage(status, body) {
        if (body && typeof body === "object") {
            if (typeof body.message === "string" && body.message) return body.message;
            if (typeof body.error === "string" && body.error) return body.error;
        }
        if (status === 409) return "El horario ya fue reservado. Elige otro.";
        if (status === 400) return "Datos inválidos. Revisa los campos e intenta de nuevo.";
        if (status >= 500) return "El servidor no respondió correctamente. Intenta más tarde.";
        return "No se pudo completar la solicitud.";
    }

    function withTimeout(promise, timeoutMs) {
        return new Promise(function (resolve, reject) {
            var timer = setTimeout(function () {
                reject(new Error("Tiempo de espera agotado al conectar con el servidor."));
            }, timeoutMs);

            promise
                .then(function (value) {
                    clearTimeout(timer);
                    resolve(value);
                })
                .catch(function (error) {
                    clearTimeout(timer);
                    reject(error);
                });
        });
    }

    function request(path, options) {
        var cfg = getConfig();
        var method = (options && options.method) || "GET";
        var headers = (options && options.headers) || {};
        var body = options && options.body;

        headers["X-Client-Id"] = cfg.clientId;
        if (body && !headers["Content-Type"]) {
            headers["Content-Type"] = "application/json";
        }

        var fetchPromise = fetch(cfg.baseUrl + path, {
            method: method,
            headers: headers,
            body: body
        }).then(function (response) {
            return response.text().then(function (text) {
                var parsed = null;
                try {
                    parsed = text ? JSON.parse(text) : null;
                } catch (e) {
                    parsed = null;
                }

                if (!response.ok) {
                    var err = new Error(normalizeErrorMessage(response.status, parsed));
                    err.status = response.status;
                    err.body = parsed;
                    throw err;
                }
                return parsed;
            });
        });

        return withTimeout(fetchPromise, cfg.timeoutMs);
    }

    function getAvailability(fromDateKey, toDateKey) {
        var cfg = getConfig();
        var path = "/api/v1/" + encodeURIComponent(cfg.clientId) + "/availability?from=" +
            encodeURIComponent(fromDateKey) + "&to=" + encodeURIComponent(toDateKey);
        return request(path, { method: "GET" });
    }

    function createBooking(payload) {
        var cfg = getConfig();
        var path = "/api/v1/" + encodeURIComponent(cfg.clientId) + "/bookings";
        return request(path, {
            method: "POST",
            body: JSON.stringify(payload)
        });
    }

    function cancelBooking(eventId) {
        var cfg = getConfig();
        var path = "/api/v1/" + encodeURIComponent(cfg.clientId) + "/bookings/" + encodeURIComponent(eventId);
        return request(path, { method: "DELETE" });
    }

    window.SwapApiClient = {
        getAvailability: getAvailability,
        createBooking: createBooking,
        cancelBooking: cancelBooking
    };
})();
