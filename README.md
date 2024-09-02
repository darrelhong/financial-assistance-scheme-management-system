# Overview

Database schema is defined in [`src/schema.ts`](src/schema.ts), and generated migrations are at [`drizle/*.sql`](drizzle).

It has 4 tables with minimal fields for now.

## Auth

Authentication is done with hardcoded user and password as proof-of-concept. It returns session using a JWT token in a cookie, that will be used to authorise future requests.

## Scheme

There is 2 parts to checking elibility for assistance schemes. The first is storing user fields to compare with the critieria. This is done using json and storing the string in database, this allows for flexibility in adding and removing fields and nested data. To ensure that not any free form json is allowed, all json inputs are validated using Zod to ensure input adheres to the desired structure. The schema is defined in [`src/routes/applicants/applicant-fields-schema.ts`](src/routes/applicants/applicant-fields-schema.ts).

The second part is storing the eligibilty logic. Once again json is chosen and with the use of JsonLogic library, any complex and arbitrary rules can be represented in json and stored in the database. Similarly this json is validated before persistence. Example rules can be view at [`src/routes/schemes`](src/routes/schemes). The rules can be applied against any user simply using the JsonLogic library. If depending on an external library is too risky, similar logic system could also be implemented instead.

# Deployment

This project is deployed on Google Cloud Run at https://financial-assistance-scheme-management-system-232576732371.asia-southeast1.run.app/

Database instance is hosted on Turso.

# Documentation

API documentation can be found at [`/documentation`](https://financial-assistance-scheme-management-system-232576732371.asia-southeast1.run.app/documentation) route.

# Setup

To run the project locally, you will first need to provide Turso credentials thorugh environment variables.

```
TURSO_DB_URL=
TURSO_DB_TOKEN=
JWT_SECRET= (for jwt plugin)
```

To run initial migrations,

`npx drizzle-kit migrate`

To add data, view example API calls in [`postman.json`](postman.json).

# Getting Started with [Fastify-CLI](https://www.npmjs.com/package/fastify-cli)

This project was bootstrapped with Fastify-CLI.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

To start the app in dev mode.\
Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

### `npm start`

For production mode

### `npm run test`

Run the test cases.
