# SimplyFood

SimplyFood is a web application that serves as a platform for users to search, post, and comment on recipes. It was developed as a learning project.

## Technology Stack

- **Frontend**: The frontend is built using Next.js and React, with Tailwind CSS for styling.
- **Backend**: The backend is implemented with serverless functions, abstracting away the server.
- **Database**: We use Neon.tech PostgreSQL DB's in our project. We have different DB's for production and development. We use AWS S3 buckets to store large fiels such as images. We have separate buckets for production and development.
- **Deployment**: The application is deployed on Vercel's cloud service.

## CI/CD
We use github actions to setup a CI/CD pipeline. We have a file [.github/workflows/deployment_pipeline.yml](.github/workflows/deployment_pipeline.yml) that defines the steps for build and test checks. And then we have Vercels own checks that deploy the app to Vercel.

## Development Roadmap
- More Oauth providers
- comments
- user page
- Top users in home page

## Known faults
- Since the recipe page is being built on every client request it  is a bit slow.
