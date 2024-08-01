#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CXBApiInfrastructureStack } from '../lib/cxb-api-infrastructure-stack';
import { getConfig } from "../lib/config";

const app = new cdk.App();
new CXBApiInfrastructureStack(app, 'CXBApiInfrastructureStack-test', {
  env: { region: 'us-west-2' },
  config: getConfig('test')
});

new CXBApiInfrastructureStack(app, 'CXBApiInfrastructureStack-prod', {
  env: { region: 'us-west-2' },
  config: getConfig('prod')
});