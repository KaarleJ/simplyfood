# SimplyFood

SimplyFood is a web application that serves as a platform for users to search, post, and comment on recipes. It was developed as a learning project. The app is deployed [here](https://simplyfood-kaarlej.vercel.app/).

## Technology Stack

- **Frontend**: The frontend is built using Next.js and React, with Tailwind CSS for styling.
- **Backend**: The backend is implemented with serverless functions, abstracting away the server.
- **Database**: We use Neon.tech PostgreSQL DB's in our project. We have different DB's for production and development. We use AWS S3 buckets to store large files such as images. We have separate buckets for production and development.
- **Deployment**: The application is deployed on Vercel's cloud service.

## Development
This app was developed with NextJs. Initially the project was started with NextJs 12 pages router. But later the project was migrated to NextJs 13 app router. Pages router with vercel's free-tier did not work ideally and was a bit slow, so we had to change the pages to be rendered clientside. We migrated the pages to app router and that improved the performance, so we changed the pages to be rendered serverside.

## CI/CD
We use github actions to setup a CI/CD pipeline. We have a file [.github/workflows/deployment_pipeline.yml](.github/workflows/deployment_pipeline.yml) that defines the steps for build and test checks. And then we have Vercels own checks that deploy the app to Vercel.

## Development Roadmap
- Migrate api to app router
- Make api use middleware to make api routes more neat
- Refactor unit tests
- Implement E2E tests
- Implement unit tests for frontend components


## Known faults
- The api currently looks like spaghetti and we don't currently use middleware.
- We don't have any E2E tests and the tests currently are a bit lacking.
