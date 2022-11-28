export * from "./constants";
export { default as defaultConfig } from "./config";
export { DefaultConfig } from "./config";

import { wisdomsBG, wisdomsBGRaw } from "./wisdomsBg";
import { wisdomsEn, wisdomsEnRaw } from "./wisdomsEn";

export const wisdomParts = {
    bg: wisdomsBG,
    en: wisdomsEn
};

export const wisdoms = {
    bg: wisdomsBGRaw,
    en: wisdomsEnRaw
};