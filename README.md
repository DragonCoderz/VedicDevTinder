We have set up the frontend and the backend of our project into seperate pieces. To get started open two different shell tabs. In the first tab we will cd into the client with the below script.

### `cd client`
### `npm start`

In the seperate tab we will start our backend as well so it can communcate with our client.

### `cd server` 
### `npm run start:backend` 

The backend is hosted at port 8000, but this is irrelavent aside from development purposes. The front end and the product itself is hosted on Port 3000. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the seperate project directories, you can also run:

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.
