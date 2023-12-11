# SimplyFood

SimplyFood is a web application that serves as a platform for users to search, post, and comment on recipes. It was developed as a learning project.

## Technology Stack

- **Frontend**: The frontend is built using Next.js and React, with Tailwind CSS for styling.
- **Backend**: The backend is implemented with serverless functions, abstracting away the server.
- **Database**: We use Vercel's "Blobs" storage for storing files such as images, and a PostgreSQL database for both production and development. Currently, we do not have separate databases for production and development due to the limitations of Vercel's free tier.
- **Deployment**: The application is deployed on Vercel's cloud service.

## Known faults
- Currently we don't have tests built
- We don't have separate DB's for different environments.
- In the recipes route we fetch server-side props and build the page on each request. It seems to be quite slow for now, so we might just fetch the props client-side.
