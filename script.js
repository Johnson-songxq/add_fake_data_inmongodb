const { MongoClient } = require("mongodb");
const { faker } = require("@faker-js/faker");
const dayjs = require("dayjs");

// const DB_URL = "mongodb://localhost:27017";
const DB_URL = "mongodb://127.0.0.1:27017";
const DB_NAME = "school";
const COLLECTION_NAME = "students";

/**
 * {
 *    _id: ObjectId,
 *    name: String,
 *    dob: Date,
 *    assignmentResult: [number],
 *    finalGpa: number,
 * }
 */
//add 100* 1000 data

const NUM_OF_STUDENTS = 100 * 10000;

MongoClient.connect(DB_URL).then((client) => {
  const db = client.db(DB_NAME);
  const collection = db.collection(COLLECTION_NAME);
  let students = [];
  let udpateQueries = []; //[Promise, Promise, Promise]

  for (let i = 0; i < NUM_OF_STUDENTS; i++) {
    const student = {
      name: faker.name.firstName(),
      dob: faker.date.past(),
      assignmentResults: Array.from({ length: 10 }).map(() =>
        faker.datatype.number({ min: 0, max: 100 })
      ),
      finalGpa: faker.datatype.number({ min: 0, max: 7 }),
    };

    students.push(student);

    if (students.length === 1000) {
      udpateQueries.push(collection.insertMany(students));
      students = [];
    }
  }

  Promise.all(udpateQueries).then(() => {
    console.log("done");
    client.close();
  });
});

/** add 100 data
MongoClient.connect(DB_URL).then((client) => {
  const db = client.db(DB_NAME);
  const collection = db.collection(COLLECTION_NAME);

  const students = Array.from({ length: 100 }).map(() => ({
    name: faker.name.firstName(),
    dob: faker.date.past(),
    assignmentResults: Array.from({ length: 10 }).map(() =>
      faker.datatype.number({ min: 0, max: 100 })
    ),
    finalGpa: faker.datatype.number({ min: 0, max: 7 }),
  }));

  collection.insertMany(students).then((result) => {
    console.log("inserted");
    client.close();
  });
});
*/
