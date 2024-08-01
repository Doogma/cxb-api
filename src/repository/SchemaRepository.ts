import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoRepository } from './DynamoRepository';

export class SchemaRepository extends DynamoRepository {
  constructor(region: string, tableName: string) {
    super(region, tableName);
  }

  public async getSchema(schemaId: string): Promise<string | undefined> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: {
        pk: 'c#config',
        sk: `s#${schemaId}`,
      },
      ConsistentRead: false,
    });

    const result: any = await this.docClient.send(command);
    if (!result.Item) {
      return undefined;
    }

    return result.Item.schema;
  }
}
