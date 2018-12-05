
import mongoose from 'mongoose';
import { error } from 'util';

export default ({ config }) => new Promise((resolve, reject) => {
  // connect to a database if needed, then pass it to `callback`:
  mongoose.connect(config.mongo.uri, { useMongoClient: true }, (error) => {
    if (error) {
      console.error('Error connecting to mongo db...');
      return reject(error);
    }
  });
  mongoose.connection.once('open', () => {
    return resolve(mongoose.connection);
  });
});
