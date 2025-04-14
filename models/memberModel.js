const Datastore = require("gray-nedb");
const bcrypt = require("bcrypt");
const path = require("path");

const saltRounds = 10;
const db = new Datastore({
  filename: path.join(__dirname, "../data/members.db"),
  autoload: true,
});

function create(username, password) {
  return bcrypt.hash(password, saltRounds).then((hash) => {
    const entry = { user: username, password: hash, role: "user" };
    return new Promise((resolve, reject) => {
      db.insert(entry, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
}

function lookup(username) {
  return new Promise((resolve, reject) => {
    db.find({ user: username }, (err, users) => {
      if (err) reject(err);
      else resolve(users[0]);
    });
  });
}

function getAllUsers() {
  return new Promise((resolve, reject) => {
    db.find({}, (err, docs) => {
      if (err) reject(err);
      else resolve(docs);
    });
  });
}

function deleteUser(username) {
  return new Promise((resolve, reject) => {
    db.remove({ user: username }, {}, (err, numRemoved) => {
      if (err) reject(err);
      else resolve(numRemoved);
    });
  });
}

module.exports = {
  create,
  lookup,
  getAllUsers,
  deleteUser,
};
