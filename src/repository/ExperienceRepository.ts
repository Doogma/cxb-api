import { GetCommand, QueryCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoRepository } from './DynamoRepository';
import { ExperienceModel } from '../models/ExperienceModel';

export class ExperienceRepository extends DynamoRepository {
  constructor(region: string, tableName: string) {
    super(region, tableName);
  }

  public async getExperience(
    projectId: string,
    experienceId: string
  ): Promise<ExperienceModel | undefined> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: {
        pk: `p#${projectId}`,
        sk: `e#${experienceId}`,
      },
      ConsistentRead: false,
    });

    const result: any = await this.docClient.send(command);
    if (!result.Item) {
      return undefined;
    }

    return { ...result.Item };
  }

  public async getProjectExperienceNames(projectId: string): Promise<string[]> {
    const command = new QueryCommand({
      TableName: process.env.DYNAMO_TABLE_NAME,
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: {
        ':pk': 'p#' + projectId,
      },
      ConsistentRead: false,
    });
    const result: any = await this.docClient.send(command);

    return result.Items.map((x: any) => x.sk.replace('e#', ''));
  }

  public async createOrUpdateExperience(
    projectId: string,
    experienceId: string,
    json: string,
    styles: string,
    scripts: string,
    modifiedAt: string
  ): Promise<boolean> {
    const command = new PutCommand({
      TableName: process.env.DYNAMO_TABLE_NAME,
      Item: {
        pk: `p#${projectId}`,
        sk: `e#${experienceId}`,
        json: json,
        styles: styles,
        scripts: scripts,
        modifiedAt: modifiedAt,
      },
    });
    await this.docClient.send(command);

    return true;
  }
}
