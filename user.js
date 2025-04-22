// users.js

let users = [];

function login(username) {
  const user = { id: Date.now().toString(), username };
  users.push(user);
  return user;
}

function getUsers() {
  return users;
}

module.exports = { login, getUsers };
