const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION OCCURED SHUTING DOWN....');
  console.log(err);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

mongoose.connect(process.env.URI).then((conn) => {
  console.log('Connected Successfully To DB ✅');
});

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`App running on part ${port}....`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDELED REJECTION OCCURED SHUTING DOWN....');
  console.log(err);
  server.close(() => {
    //first we gracefully close server.
    process.exit(1);
  });
});
