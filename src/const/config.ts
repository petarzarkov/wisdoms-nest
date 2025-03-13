import { IsNumber, IsString, Max, Min, validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export class EnvVars {
  @IsString()
  APP_ENV: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  SERVICE_PORT: number;
}

export const validateConfig = (config: Record<string, unknown>) => {
  const validatedConfig = plainToInstance(EnvVars, config, { enableImplicitConversion: true });

  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return {
    env: validatedConfig.APP_ENV,
    isDev: !validatedConfig.APP_ENV || validatedConfig.APP_ENV === 'dev',
    app: {
      port: validatedConfig.SERVICE_PORT,
      docs: {
        apiPath: process.env.API_DOCS_PATH || 'api',
      },
    },
  };
};

export type ValidatedConfig = ReturnType<typeof validateConfig>;
