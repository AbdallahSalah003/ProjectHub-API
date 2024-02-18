# ProjectHub REST API

The ProjectHub API is a robust RESTful platform designed to facilitate project and task management for users.

## Built With

[![Node][Node.js]][Node-url] [![Express][Express.js]][Express-url] [![MongoDB][MongoDB]][MongoDB-url] [![Mongoose][Mongoose]][Mongoose-url]

## Features

- Full CRUD features for User and Project, Task, Activity instances.
- Pagination and filtering of server responses to avoid slow page load times.
- Authentication and Hash encryption of passwords and access management with JWT tokens.
- Restricted user access to CRUD operations.
- Provide users with comprehensive project management capabilities.
- Users can efficiently manage their projects by creating teams with ease.
- Each project is composed of tasks, and each task is divided into sub-small activities.

## Getting Started

To use this code you will require an account with [Mailtrap](https://mailtrap.io/). Sign-up is free and no credit card is required to access a free-tier API Key.

Node.js version 12+ and npm must be installed on your machine. In terminal type the following commands:

```
git clone https://github.com/AbdallahSalah003/ProjectHub-API.git
cd ProjectHub-API
touch config.env
npm install
```

Insert the following lines in `config.env`, replacing all `<content>` with your own information:

```
NODE_ENV=development
PORT=<PORT-NUMBER>
DATABASE=<MONGODB_CONNECTION_STRING-WITH-PASSWORD>

JWT_SECRET=<32-CHAR-UNIQUE-KEY-OF-YOUR-CHOICE>
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

EMAIL_USERNAME=<MAILTRAP-USERNAME>
EMAIL_PASSWORD=<MAILTRAP-PASSWORD>
EMAIL_HOST=<MAILTRAP-HOST>
EMAIL_PORT=<MAILTRAP-PORT>
```

To run the web server return to the root of the repository and type:

```
npm run start:dev
```

Alternatively you can run web server using production env

```
npm run start
```

#### click here for [Postman API documentation](https://documenter.getpostman.com/view/32627767/2sA2r8244e)

[Node.js]: https://img.shields.io/badge/NODE.js-rgb(50,120,50)?style=for-the-badge&logo=node.js
[Node-url]: https://nodejs.org/
[Express.js]: https://img.shields.io/badge/express.js-grey?style=for-the-badge&logo=express
[Express-url]: https://expressjs.org/
[MongoDB]: https://img.shields.io/badge/mongodb-rgb(0,30,80)?style=for-the-badge&logo=mongoDB
[MongoDB-url]: https://mongodb.org/
[Mongoose]: https://img.shields.io/badge/mogoose.js-rgb(136,0,0)?style=for-the-badge&logo=mongoose
[Mongoose-url]: https://mongoosejs.com
