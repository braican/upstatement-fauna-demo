# A Fauna Demo

Demos some Fauna functionality, including authentication to the app with Google. The application is built with React and serverless functions, which can be run with [Netlify Dev](https://www.netlify.com/products/dev), and uses [Fauna DB]((https://fauna.com/)) as a database for persistent storage.

## Setup

This demo utilizes two third party services, both of which you'll need to configure:

- **[Google Cloud Platform](https://console.cloud.google.com/)**, for logging in with Google (note that this is the only authentication method - you'll need a Google account to log in to the app).
- **[Fauna DB](https://fauna.com/)**, for the database.

Credentials for these applications can be stored in an `.env` file at the root of the project. Before going through the following steps, copy the `.env.sample` file to a `.env` file.

You'll also need the [Netlify CLI](https://docs.netlify.com/cli/get-started/) installed to run serverless functions. You can install this with the following command:

```sh
npm install netlify-cli -g
```

### Setting up an application on Google Cloud Platform

For the authentication piece via Google, you'll need to set up a project within Google Cloud:

1. Log into [Google Cloud's console](https://console.cloud.google.com/) and create a new project.
2. Once created, make sure you've selected your new project and navigate to the "APIs & Services" page, then click on the "OAuth consent screen" link in the sidebar (you'll need to set this up to add credentials for your OAuth client ID).
3. Choose the "External" option for user type, then enter the app name and developer addresses in the required fields (don't worry about the other fields).
4. Once saved, click into the "Credentials" page in the sidebar. Once on this page, click the "Create Credentials" button near the top and select the "OAuth client ID" option.
5. Choose the "Web Application" option under "Application Type", then fill out a name. For both the "Authorized JavaScript origins" and "Authorized redirect URIs" settings, add the `http://localhost:8888` URI.
6. Click create. A modal will pop up with your credentials; store the client ID in your `.env` file as the `REACT_APP_GOOGLE_OAUTH_CLIENT_ID` value, and store the client secret as the `GOOGLE_OAUTH_CLIENT_SECRET` value.

### Setting up a Fauna application

Fauna will provide the database that will store the authenticated users and manage authorization of data from the database. If you don't already have one, create a free [Fauna](https://fauna.com/) account, then log in to your dashboard. Then:

1. Create a new database. It can be named anything you'd like (don't check the pre-populate with demo data option).
2. Once created, navigate to the "GraphQL tab in the sidebar and click the "Import Schema" button. Upload the schema file from this project located at `_schema/data.gql`. This will create two collections, one for Users and one for Games, as well as an index for retrieving a User by their uid.
3. Next, visit the "Security" page, and create a new key. Select the "Server" option from the Role dropdown, and give the key a name if you'd like. Upon saving, Fauna will display your server key; copy it and save it to the `FAUNA_SERVER_KEY` variable in your `.env` file.

### The application

The front-end application is built with React and uses a handful of other dependencies. You can install these with the following install command:

```sh
yarn install
```

## Starting the app

Once everything is installed and configured, you can start the application with the following command:

```sh
yarn start
```
This will start Netlify dev which will start your local environment with environment variables, as well as compile and run the serverless functions.

The start command will output a localhost url (it should be http://localhost:8888) that you can use to access the site. When you visit the site, you should see a login button; clicking this will open a Google login screen in a modal. Once you log in with a Google account here, the app should authenticate and display your name and email address at the top. Refreshing the page should keep you logged in.

Open up Fauna and click into your application. Check out the User collection, and note that there should be a record for your login.

## What's happening

### Logging in

- The application renders a login button, which when clicked initiates the Google sign-in process on the client side via their [JavaScript library](https://developers.google.com/identity/sign-in/web/reference). We're using a utility component, [react-google-login](https://github.com/anthonyjgrove/react-google-login), to help facilitate this.
- Once the client authenticates, the application will receive an encrypted token. We take that token and send it to our own `auth` endpoint, which is handled by a serverless function that we've defined.
- Our auth endpoint does a few things:
    - Authenticates the user by verifying the token that we recieved on the front-end with Google's [node.js auth library](https://www.npmjs.com/package/google-auth-library).
    - Checks our Fauna database to see if we have a record for that user. If so, we get the user record; if not, we add the user record to the database.
    - Logs in to Fauna by creating an access token for the user. This generates a unique token that can be used to authenticate requests to the database for the specific user that the token was created for, allowing us to ensure that they can only touch what the current user is allowed to touch.
    - Sends the user data and their access token back to the front-end. We'll then use that token to authenticate future requests that the user makes.

### Logging out

Once a user is logged in, a button will be provided that will let them log out. Clicking this button send a request to our `logout` endpoint (also handled by a serverless function), which calls Fauna's `Logout` function to delete the token that was created as a part of the log in process.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
