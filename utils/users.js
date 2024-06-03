const users = [];

export function saveUser(id, username, code) {
  const user = { id, username, code };

  users.push(user);

  return user;
}

export function removeUser(id) {
  const index = users.findIndex( user => user.id === id);

  if(index !== -1) {
    const removedUser = users.splice(index, 1)[0];
    return removedUser;
  }
}

export function getUsersByCode(code) {
  return users.filter( user => user.code === code);
}

export function getCurrentUser(id) {
  return users.find( user => user.id === id);
}