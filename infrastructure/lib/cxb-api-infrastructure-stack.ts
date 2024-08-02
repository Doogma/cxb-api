import * as cdk from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as logs from "aws-cdk-lib/aws-logs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { Construct } from "constructs";
import { ConfigProps } from "./config";
import * as path from "path";
import { Cors } from "aws-cdk-lib/aws-apigateway";

type AwsEnvStackProps = cdk.StackProps & {
  config: Readonly<ConfigProps>;
};

export class CXBApiInfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AwsEnvStackProps) {
    super(scope, id, props);

    const { config } = props;

    const dynamoTable = new dynamodb.Table(this, "CxbDataTable", {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: "pk", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "sk", type: dynamodb.AttributeType.STRING },
      tableName: `cxb-data-${config.ENV}`,
      timeToLiveAttribute: "ttl",
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      deletionProtection: true,
    });

    const cxbApiLambda = new NodejsFunction(this, "CxbApiLambda", {
      handler: "handler",
      entry: path.join(__dirname, "..", "..", "src", "lambdas", "apiLambda.ts"),
      functionName: `CxbApi-${config.ENV}`,
      runtime: lambda.Runtime.NODEJS_20_X,
      timeout: cdk.Duration.seconds(15),
      logRetention: logs.RetentionDays.ONE_WEEK,
      environment: {
        REGION: config.REGION,
        DYNAMO_TABLE_NAME: dynamoTable.tableName,
      },
    });

    const api = new apigateway.LambdaRestApi(this, "CxbApi", {
      restApiName: `CxbApi-${config.ENV}`,
      handler: cxbApiLambda,
      proxy: false,
      endpointTypes: [apigateway.EndpointType.REGIONAL],
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
      },
    });

    const proxyResource = api.root.addResource("{proxy+}");
    proxyResource.addMethod(
      "POST",
      new apigateway.LambdaIntegration(cxbApiLambda)
    );
    proxyResource.addMethod(
      "PUT",
      new apigateway.LambdaIntegration(cxbApiLambda)
    );
    proxyResource.addMethod(
      "GET",
      new apigateway.LambdaIntegration(cxbApiLambda)
    );

    dynamoTable.grantReadWriteData(cxbApiLambda);

    // const plan = api.addUsagePlan("CxbApiKeyPlan", {
    //   name: `CxbApiKeyPlan-${config.ENV}`,
    // });
    // const key = api.addApiKey(`CxbApiKey-${config.ENV}`);
    // plan.addApiKey(key);
    // plan.addApiStage({ stage: api.deploymentStage });

    // custom domain for API

    // const apiDomainName = new apigateway.DomainName(
    //   this,
    //   "CxbApiCustomDomain",
    //   {
    //     domainName: config.API_DOMAIN,
    //     certificate: Certificate.fromCertificateArn(
    //       this,
    //       "CxbApiCustomCertificate",
    //       config.API_DOMAIN_CERT_ARN
    //     ),
    //     endpointType: apigateway.EndpointType.REGIONAL,
    //   }
    // );

    // new apigateway.BasePathMapping(this, "CxbApiBasePathMapping", {
    //   domainName: apiDomainName,
    //   restApi: api,
    // });
  }
}
