import cors from 'cors';
import express, { Request, Response } from 'express';
import compression from 'compression';
import dotenv from 'dotenv';
import { ExperienceRepository } from '../repository/ExperienceRepository';
import { SchemaRepository } from '../repository/SchemaRepository';
import { ProjectExperiencesResponse } from '../contracts/ProjectExperiencesResponse';
import { ExperienceResponse } from '../contracts/ExperienceResponse';
import { SchemaResponse } from '../contracts/SchemaResponse';
import { CreateExperienceRequest } from '../contracts/CreateExperienceRequest';
import { InternalErrorResponse } from '../contracts/InternalErrorResponse';

dotenv.config();

const app = express();
const router = express.Router();

router.use(compression());
router.use(cors());
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const awsRegion = process.env.REGION!;
const dynamoTableName = process.env.DYNAMO_TABLE_NAME!;

const experienceRepository = new ExperienceRepository(
  awsRegion,
  dynamoTableName
);
const schemaRepository = new SchemaRepository(awsRegion, dynamoTableName);

// get project experience names list

router.get(
  '/projects/:projectId/experiences',
  async (req: Request, res: Response) => {
    try {
      const experienceNames =
        await experienceRepository.getProjectExperienceNames(
          req.params.projectId
        );
      const response = {
        experiences: experienceNames,
      } as ProjectExperiencesResponse;

      return res.status(200).json(response);
    } catch (error) {
      console.error(
        `Get project experience names error: ${JSON.stringify(error)}`
      );
      return res.status(500).json(InternalErrorResponse);
    }
  }
);

// get single project experience

router.get(
  '/projects/:projectId/experiences/:experienceId',
  async (req: Request, res: Response) => {
    try {
      const model = await experienceRepository.getExperience(
        req.params.projectId,
        req.params.experienceId
      );

      if (!model) {
        return res.status(404).json();
      }

      const response = {
        json: model.json,
        styles: model.styles,
        scripts: model.scripts,
      } as ExperienceResponse;

      return res.status(200).json(response);
    } catch (error) {
      console.error(`Get project experience error: ${JSON.stringify(error)}`);
      return res.status(500).json(InternalErrorResponse);
    }
  }
);

// create / update project experience

router.put(
  '/projects/:projectId/experiences/:experienceId',
  async (req: Request, res: Response) => {
    try {
      const createExperienceRequest = req.body as CreateExperienceRequest;

      await experienceRepository.createOrUpdateExperience(
        req.params.projectId,
        req.params.experienceId,
        createExperienceRequest.json,
        createExperienceRequest.styles,
        createExperienceRequest.scripts,
        new Date().toISOString()
      );

      return res.status(204).json();
    } catch (error) {
      console.error(`Save project experience error: ${JSON.stringify(error)}`);
      return res.status(500).json(InternalErrorResponse);
    }
  }
);

// get schema

router.get(
  '/configs/schemas/:schemaId',
  async (req: Request, res: Response) => {
    const schema = await schemaRepository.getSchema(req.params.schemaId);

    if (!schema) {
      return res.status(404).json();
    }

    const response = { schema: schema } as SchemaResponse;

    return res.status(200).json(response);
  }
);

// The serverless-express library creates a server and listens on a Unix
// Domain Socket for you, so you can remove the usual call to app.listen.
// app.listen(3000)
app.use('/', router);

export { app };
