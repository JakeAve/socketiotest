const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);
const writeFile = promisify(fs.writeFile);
const appendFile = promisify(fs.appendFile);
const unlink = promisify(fs.unlink);

class ghettoDB {
  constructor(path) {
    this.dbRoot = path;
    this.systemUser = 'system-user';
  }

  crPath(chatroom) {
    return path.join(this.dbRoot, `/${chatroom}.json`);
  }

  async storeMessage(msg, cr) {
    const crPath = this.crPath(cr);
    const rawData = await readFile(crPath);
    const data = JSON.parse(rawData);
    data.messages.push(msg);
    const user = msg.sender;
    if (user !== this.systemUser && !data.users.includes(user))
      data.users.push(user);
    await writeFile(crPath, JSON.stringify(data));
  }

  async createChatroom(cr, users) {
    const crPath = this.crPath(cr);
    const data = {};
    if (Array.isArray(users)) data.users = users;
    else throw new Error({ msg: 'users are not array' });
    data.messages = [];
    if (fs.existsSync(crPath))
      throw new Error({ msg: 'chatroom already exists' });
    await writeFile(crPath, JSON.stringify(data));
  }

  async destroyChatroom(cr) {
    await unlink(this.crPath(cr));
  }

  async getMessages(cr) {
    const rawData = await readFile(this.crPath(cr));
    const data = JSON.parse(rawData);
    return data.messages;
  }

  async getChatrooms() {
    const dirs = await readdir(this.dbRoot);
    return dirs
      .filter((f) => f !== '.gitignore')
      .map((file) => file.replace(/\.json$/, ''));
  }

  addUser(chatroom) {}

  async removeUser(user, chatroom) {
    const crPath = this.crPath(chatroom);
    const rawData = await readFile(crPath);
    const data = JSON.parse(rawData);
    data.users = data.users.filter((u) => u !== user);
    await writeFile(crPath, JSON.stringify(data));
  }
}

module.exports = ghettoDB;
