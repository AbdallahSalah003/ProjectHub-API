const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

const clientOptions = {
  serverApi: { version: '1', strict: true, deprecationErrors: true },
};
async function run() {
  try {
    await mongoose.connect(process.env.URI, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!',
    );
  } finally {
    await mongoose.disconnect();
  }
}
run().catch(console.dir);

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`App running on part ${port}....`);
});
