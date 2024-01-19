# SimplyFood

SimplyFood is a web application that serves as a platform for users to search, post, and comment on recipes. It was developed as a learning project. The app is deployed [here](https://simplyfood-kaarlej.vercel.app/).

## Technology Stack

- **Frontend**: The frontend is built using Next.js and React, with Tailwind CSS for styling.
- **Backend**: The backend is implemented with serverless functions, abstracting away the server.
- **Database**: We use Neon.tech PostgreSQL DB's in our project. We have different DB's for production and development. We use AWS S3 buckets to store large fiels such as images. We have separate buckets for production and development.
- **Deployment**: The application is deployed on Vercel's cloud service.

## CI/CD
We use github actions to setup a CI/CD pipeline. We have a file [.github/workflows/deployment_pipeline.yml](.github/workflows/deployment_pipeline.yml) that defines the steps for build and test checks. And then we have Vercels own checks that deploy the app to Vercel.

## Development Roadmap
- comments
- update recipes
- delete recipes
- delete comments
- user page
- Top users in home page
- Incrementally updating to app router


## Known faults
- We had to change pages that were using SSR to be CSR. That's because of the limitations of vercel's free-tier
- We have no component tests for frontend and no E2E tests. The tests overall seem to be a bit thin.
