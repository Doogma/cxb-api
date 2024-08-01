# cxb-api

- [Infrastructure deployment](#infrastructure-deployment)
- [Database](#database)
- [API](#api)

## Infrastructure deployment

1. Go to the [Actions](https://github.com/Doogma/cxb-api/actions) page
2. Select `Deploy Infra - Test` workflow, click `Run workflow` drop down on the right and click `Run workflow`
3. You can check progress of the jobs and see detailed output by clicking on the specifc job.

## Database

Dynamo DB is used as a primary data storage and follows single-table design pattern.

Table config:

- partition key: pk
- sort key: sk

TTL attribute: ttl (not used yet)

Entities:

**PROJECT EXPERIENCE**

```
{
 "pk": 'p#${projectId}',
 "sk": 'e#${experienceId}',
 "json": {},
 "styles": "",
 "scripts": "",
 "modifiedAt": "2024-07-23T11:42:44.224Z"
}
```

## API

**1.Create/update project experience**

PUT https://host/projects/{projectId}/experiences/{experienceId}

**Headers:**

- Content-Type: application/json

**Body:**

```
{
    "json": {},
    "styles": "",
    "scripts": "",
}
```

**Response**

Status: 204

**2.Get project experience**

GET https://host/projects/{projectId}/experiences/{experienceId}

**Response**

Status: 200

**Body:**

```
{
    "json": {},
    "styles": "",
    "scripts": "",
}
```

**3.Get project experiences names**

GET https://host/projects/{projectId}/experiences

**Response**

Status: 200

**Body:**

```
{
    "experiences": ["exp1", "exp2"]
}
```
