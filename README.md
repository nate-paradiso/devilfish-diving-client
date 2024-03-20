Paypal SDK Transaction Client Environment.

This is the client-side application for Devilfish Diving, a dive charter website. It utilizes the
PayPal SDK for transaction integration, along with Next.js and Tailwind CSS for the frontend, and
Express for the backend.

Here is the server repo. https://github.com/nate-paradiso/devilfish-diving-server

I used the standard integration builder with React to get started.
https://developer.paypal.com/integration-builder/

Getting Started To get started with the Devilfish Diving client, follow these steps:

Installation Clone this repository to your local machine:

git clone https://github.com/nate-paradiso/devilfish-diving-client.git Navigate into the project
directory:

cd devilfish-diving-client Install dependencies using npm:

npm install Configuration Before running the client, you'll need to configure your PayPal Business
account and obtain client credentials. Make sure to set up the necessary environment variables:

NEXT_PUBLIC_PAYPAL_CLIENT_ID: Your PayPal client ID. NEXT_PUBLIC_BACKEND_URL: The URL of your
backend server. Running the Client Start the client application using the following command:

npm run dev The client will be accessible at http://localhost:3000.

Testing PayPal Transactions Important: This client is intended for testing purposes only and should
not be used for real transactions. Use the PayPal sandbox environment to simulate transactions and
ensure everything works correctly before deploying to a production environment.

Usage Once the client is running, you can interact with it to simulate transactions. Follow the
on-screen prompts to initiate transactions using PayPal.

This is a [Next.js](https://nextjs.org/) project bootstrapped with
[`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the
file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to
automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your
feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the
[Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more
details.
