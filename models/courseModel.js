const Datastore = require('gray-nedb');
const path = require('path');

const db = new Datastore({ filename: path.join(__dirname, '../data/courses.db'), autoload: true });

function seedCourses() {
  db.count({}, (err, count) => {
    if (count === 0) {
      db.insert([
        {
          name: "Beginner Latin Dance",
          duration: "12 weeks",
          schedule: "Tuesdays, 6–7 PM",
          description: "A fun and friendly introduction to Latin basics.",
          location: "Studio A",
          price: "£60"
        },
        {
          name: "Weekend Contemporary Workshop",
          duration: "2 days",
          schedule: "Sat & Sun, 10 AM – 3 PM",
          description: "Explore contemporary techniques in a dynamic setting.",
          location: "Main Hall",
          price: "£40"
        }
      ]);
      console.log("Sample courses inserted.");
    }
  });
}

function getAllCourses() {
  return new Promise((resolve, reject) => {
    db.find({}, (err, docs) => {
      if (err) reject(err);
      else resolve(docs);
    });
  });
}

function addCourse(course) {
    return new Promise((resolve, reject) => {
      db.insert(course, (err, newDoc) => {
        if (err) reject(err);
        else resolve(newDoc);
      });
    });
  }
  
function deleteCourse(id) {
  return new Promise((resolve, reject) => {
    db.remove({ _id: id }, {}, (err, numRemoved) => {
      if (err) reject(err);
      else resolve(numRemoved);
    });
});
}

function updateCourse(id, newData) {
  return new Promise((resolve, reject) => {
    db.update({ _id: id }, { $set: newData }, {}, (err, numReplaced) => {
      if (err) reject(err);
      else resolve(numReplaced);
    });
  });
}

function updateCourse(id, newData) {
    return new Promise((resolve, reject) => {
      db.update({ _id: id }, { $set: newData }, {}, (err, numReplaced) => {
        if (err) reject(err);
        else resolve(numReplaced);
      });
    });
}
  
  
module.exports = {
    seedCourses,
    getAllCourses,
    addCourse,
    deleteCourse,
    updateCourse
};
  
