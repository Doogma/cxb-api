import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { fromEnv } from '@aws-sdk/credential-providers';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import type { AwsCredentialIdentityProvider } from '@smithy/types';

export class DynamoRepository {
  private readonly region: string;
  protected readonly tableName: string;
  protected readonly docClient: DynamoDBDocumentClient;

  constructor(region: string, tableName: string) {
    this.region = region;
    this.tableName = tableName;

    const config = {
      region: this.region,
      credentials: this.getAwsCredentials(),
    };
    const client = new DynamoDBClient(config);
    this.docClient = DynamoDBDocumentClient.from(client);
  }

  private getAwsCredentials(): AwsCredentialIdentityProvider | undefined {
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      return fromEnv();
    }
    return undefined;
  }
}
