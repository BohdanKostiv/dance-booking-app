const Datastore = require('gray-nedb');
const path = require('path');

const db = new Datastore({ filename: path.join(__dirname, '../data/bookings.db'), autoload: true });

function addBooking(name, courseId) {
  const booking = {
    name,
    courseId,
    date: new Date().toISOString()
  };

  return new Promise((resolve, reject) => {
    db.insert(booking, (err, newDoc) => {
      if (err) reject(err);
      else resolve(newDoc);
    });
  });
}

function getBookingsByCourse(courseId) {
    return new Promise((resolve, reject) => {
      db.find({ courseId }, (err, docs) => {
        if (err) reject(err);
        else resolve(docs);
      });
    });
}
  
function deleteBooking(id) {
    return new Promise((resolve, reject) => {
      db.remove({ _id: id }, {}, (err, numRemoved) => {
        if (err) reject(err);
        else resolve(numRemoved);
      });
    });
}
  
function getBookingsByUser(name) {
    return new Promise((resolve, reject) => {
      db.find({ name }, (err, docs) => {
        if (err) reject(err);
        else resolve(docs);
      });
    });
}

function deleteBookingsByUsername(name) {
    return new Promise((resolve, reject) => {
      db.remove({ name }, { multi: true }, (err, numRemoved) => {
        if (err) reject(err);
        else resolve(numRemoved);
      });
    });
}
  
  
module.exports = {
    addBooking,
    getBookingsByCourse,
    deleteBooking,
    getBookingsByUser,
    deleteBookingsByUsername

};
