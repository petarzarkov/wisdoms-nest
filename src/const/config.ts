import config from "config";

export interface DefaultConfig {
    NODE_ENV?: string;
    app: {
        port: number;
        apiPath: string;
    };
    /**
     * @default "10min"
     */
    tokenExpiryTime: string | number;
}

export default (print = true) => {
    const defaultConfig: DefaultConfig & Record<string, unknown> = {
        NODE_ENV: process.env.NODE_ENV || "development",
        app: {
            port: Number(process.env.PORT) || Number(process.env.SERVICE_PORT) || (config?.has("servicePort") ? config?.get<number>("servicePort") : 5052),
            apiPath: process.env.API_DOCS_PATH || "api"
        },
        tokenExpiryTime: process.env.HISTORY_TOKEN_EXPIRY_TIME || "10m"
    };

    if (print) {
        console.log("LOADED CONFIGURATION", defaultConfig);
    }

    return defaultConfig;
};