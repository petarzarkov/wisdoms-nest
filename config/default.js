module.exports = {
    servicePort: 5056,
    log: {
        appType: "wisdoms-service",
        appName: "wisdoms-service",
        level: "INFO",
        color: true,
        filters: [{
            key: "eventName",
            values: [
                "/service/healthcheck",
                "/service/upcheck"
            ]
        }],
        serializers: [{
            key: "eventName",
            values: ["/api/adaptors", "/api/providers", "/api/games", "/api/brands", "/api/brands/{brandId}"],
            modifiers: [{ properties: ["data.result"] }]
        }, {
            key: "eventName",
            values: ["/adapter/history"],
            modifiers: [{ properties: ["data.result.detailsContent"] }]
        }]
    }
};
