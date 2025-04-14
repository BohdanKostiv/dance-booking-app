const Datastore = require("gray-nedb");
const bcrypt = require("bcryptjs");
const path = require("path");

const saltRounds = 10;

class UserDAO {
  constructor(dbFilePath) {
    this.db = new Datastore({
      filename: path.join(__dirname, "../data/users.db"),
      autoload: true,
    });
  }

  create(username, password) {
    return bcrypt.hash(password, saltRounds).then((hash) => {
      const entry = { user: username, password: hash };
      return new Promise((resolve, reject) => {
        this.db.insert(entry, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    });
  }

  lookup(username) {
    return new Promise((resolve, reject) => {
      this.db.find({ user: username }, (err, users) => {
        if (err) reject(err);
        else resolve(users[0]);
      });
    });
  }
}

function getAllOrganisers() {
  return new Promise((resolve, reject) => {
    this.db.find({}, (err, docs) => {
      if (err) reject(err);
      else resolve(docs);
    });
  });
}

function deleteUser(username) {
  return new Promise((resolve, reject) => {
    this.db.remove({ user: username }, {}, (err, numRemoved) => {
      if (err) reject(err);
      else resolve(numRemoved);
    });
  });
}

function seedAdmin() {
  return this.lookup('admin').then(async (existingUser) => {
    if (existingUser) {
      console.log('Admin already exists');
      return;
    }

    const hashed = await bcrypt.hash('admin123', 10);
    return this.create('admin', 'admin')
      .then(() => console.log('Default admin created'))
      .catch((err) => console.error('Failed to create admin:', err));
  });
}

module.exports = new (class {
  constructor() {
    this.db = new Datastore({
      filename: path.join(__dirname, "../data/users.db"),
      autoload: true
    });
  }

  create = UserDAO.prototype.create;
  lookup = UserDAO.prototype.lookup;
  getAllOrganisers = getAllOrganisers.bind(this);
  delete = deleteUser.bind(this);
  seedAdmin = seedAdmin.bind(this);
})();

