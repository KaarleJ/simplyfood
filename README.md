# SimplyFood

SimplyFood is a web application that serves as a platform for users to search, post, and comment on recipes. It was developed as a learning project. The app is deployed [here](https://simplyfood-kaarlej.vercel.app/).

## Technology Stack

- **Frontend**: The frontend is built using Next.js and React, with Tailwind CSS for styling.
- **Backend**: The backend is implemented with serverless functions, abstracting away the server.
- **Database**: We use Neon.tech PostgreSQL DB's in our project. We have different DB's for production and development. We use AWS S3 buckets to store large files such as images. We have separate buckets for production and development.
- **Deployment**: The application is deployed on Vercel's cloud service.

## Development
This app was developed with NextJs. Initially the project was started with NextJs 12 pages router but later the project was migrated to NextJs 13 app router.

## CI/CD
We use github actions to setup a CI/CD pipeline. We have a file [.github/workflows/build_tests.yml](.github/workflows/build_tests.yml) that defines the steps for build and test checks. And then we have Vercels own checks that deploy the app to Vercel.

## Development Roadmap
- Rework the E2E tests


## Known faults
- We don't have any E2E tests
- Minor visual bugs in UI