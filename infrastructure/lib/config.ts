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
  const override = env === "prod";
  dotenv.config({
    path: path.resolve(__dirname, `../.env.${env}`),
    override: override,
  });

  return {
    ENV: env || "test",
    REGION: process.env.REGION || "us-west-2",
    DYNAMO_TABLE_NAME: process.env.DYNAMO_TABLE_NAME || "",
    API_DOMAIN: process.env.API_DOMAIN || "",
    API_DOMAIN_CERT_ARN: process.env.API_DOMAIN_CERT_ARN || "",
  };
};
