const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

mongoose.connect(process.env.URI).then((conn) => {
  console.log('Connected Successfully To DB ✅');
});

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`App running on part ${port}....`);
});
