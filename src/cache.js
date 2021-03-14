// TODO útfæra redis cache
import redis from 'redis';
import util from 'util';
import dotenv from 'dotenv';

dotenv.config();

const redisOptions = {
  url: 'redis://127.0.0.1:6379/0',
};

let client;
let asyncGet;
let asyncSet;

if (process.env.DEV === 'TRUE') {
  client = redis.createClient(redisOptions);
  asyncGet = util.promisify(client.get).bind(client);
  asyncSet = util.promisify(client.set).bind(client);
}

export async function set(key, data) {
  if (!client) return;
  try {
    const jsonString = await JSON.stringify(data);
    await asyncSet(key, jsonString);
  } catch (e) {
    console.error(`Error while attempting to save to cache: ${e.message}`);
  }
}

export async function get(key) {
  if (!client) return null;
  let data;
  try {
    data = await asyncGet(key);
    return JSON.parse(data);
  } catch (e) {
    console.error(`Error while fetching data: ${e.message}`);
    return null;
  }
}
