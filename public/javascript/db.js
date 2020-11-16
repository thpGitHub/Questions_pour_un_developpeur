//require('dotenv').config(); // variables environment

const MongoClient = require('mongodb').MongoClient,
    //url         = 'mongodb://localhost:27017/',
      url         = process.env.DB_HOST_LOCAL,
      url_test    = process.env.DB_HOST_ATLAS,
      dbName      = process.env.DB_NAME;

connectDB = (cb) => {
  MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
    if (err) {
      return console.log('err connect DB');
    }
    const theDB = client.db(dbName);
    cb(theDB, client);
  })
};

connectDB_test = (cb) => {
  MongoClient.connect(url_test, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
    if (err) {
      return console.log('err connect DB');
    }
    const theDB = client.db(dbName);
    cb(theDB, client);
  })
};

exports.find = (settings) => {
  connectDB_test((theDB, client) => {
    const myCollection = theDB.collection(settings.theCollection);
    myCollection.find(settings.filter).toArray((err, docs) => {
      client.close();
      settings.done(docs);
    });
  });
};

exports.insert = (settings) => {
  connectDB_test( (theDB, client) => {
    const myCollection = theDB.collection(settings.theCollection);
    myCollection.insertOne(settings.filter).toArray((err, docs) => {
      client.close();
      settings.done(docs);
    });
  });
};