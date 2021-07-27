# TaskManagerAppAPI

A REST API for task manager app, where one can setup an account and create their own personal list of tasks, that they have done, or plan to do.

### How to run:
- Development Environment Variables
  - Create a file named `dev.env` in `src/config` directory
  - Add variables `PORT`, `MONGODB_URL` and `JWT_SECRET`
  - For enabling emails to be sent from your Gmail account using OAuth2, add variables `CLIENT_ID`, `CLIENT_SECRET`, `REFRESH_TOKEN` and `REDIRECT_URL` to the `dev.env` file.
  Refer this [article](https://www.freecodecamp.org/news/use-nodemailer-to-send-emails-from-your-node-js-server/) to get exact steps on how to generate these vaiables.
  - Example:
  ```
  PORT=3000
  MONGODB_URL=mongodb://127.0.0.1:27017/eduTracker
  ```
- Start MongoDB server
- Install the required packages by running `npm install`
- Now start the project in dev by running `npm start dev`

The REST API is hosted [here](https://suman-task-manager-app-api.herokuapp.com/). To make request using the API, apps like [Postman](https://www.postman.com/downloads/) can be used.