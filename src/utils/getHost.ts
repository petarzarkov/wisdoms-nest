import { HotLogger } from "@toplo/api";
import { lookup } from "dns";
import { hostname } from "os";

const log = HotLogger.createLogger("@utils/getHost");

export const getHost = () => new Promise<string>((resolve) => {
    try {
        lookup(hostname(), (_, address) => {
            resolve(address);
        });
    } catch (error) {
        log.error("Error getting host", { err: <Error>error });
        resolve("localhost");
    }
});