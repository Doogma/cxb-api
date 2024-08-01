import * as dotenv from "dotenv";
import path = require("path");

export type ConfigProps = {
  ENV: string;
  REGION: string;
  DYNAMO_TABLE_NAME: string;
  API_DOMAIN: string;
  API_DOMAIN_CERT_ARN: string;
};

export const getConfig = (env: string): ConfigProps => {
  dotenv.config({ path: path.resolve(__dirname, `../.env.${env}`) });

  return {
    ENV: env || "test",
    REGION: process.env.REGION || "us-east-1",
    DYNAMO_TABLE_NAME: process.env.DYNAMO_TABLE_NAME || "",
    API_DOMAIN: process.env.API_DOMAIN || "",
    API_DOMAIN_CERT_ARN: process.env.API_DOMAIN_CERT_ARN || "",
  };
};
