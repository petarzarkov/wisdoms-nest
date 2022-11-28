import { SetMetadata } from "@nestjs/common";

export const skipCredsValidation = (doSkip = true) => SetMetadata("skipCredsValidation", doSkip);
export const skipJwtValidation = (doSkip = true) => SetMetadata("skipJwtValidation", doSkip);
export const skipHttpIntercepting = (doSkip = true) => SetMetadata("skipHttpIntercepting", doSkip);