require("dotenv").config();
const axios = require("axios");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const self = this
self.internal = false
self.baseUrl = 'https://spux.art'
self.configUrl = `${self.baseUrl}/config.json`
self.tilesUrl = `${self.baseUrl}/tiles.json`

const getConfig = async () => {
  try {
    const response = await axios.get(self.configUrl);
    return response.data;
  } catch (error) {
    console.error("Error fetching config:", error);
    throw error;
  }
};

const isUUID = (str) => {
  const pattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/i;
  return pattern.test(str);
}

const argv = yargs(hideBin(process.argv))
  .option("action", {
    alias: "a",
    type: "string",
    description: "Action to call",
  })
  .option('uuid', {
    alias: 'u',
    type: 'string',
    description: 'UUID for login',
  })
  .option('handle', {
    alias: 'h',
    type: 'string',
    description: 'Handle for tile',
  })
  .option('tileID', {
    alias: 'n',
    type: 'string',
    description: 'Tile UUID',
    })
  .option('color', {
    alias: 'c',
    type: 'integer',
    description: 'Color for tile [0-30]',
  })
  .option('x', {
    alias: 'x',
    type: 'integer',
    description: 'X coordinate for tile',
  })
  .option('y', {
    alias: 'y',
    type: 'integer',
    description: 'Y coordinate for tile',
  })
  .option('o', {
    alias: 'o',
    type: 'integer',
    description: 'Orientation for tile',
  })
  .option('coords', {
    alias: 'xyo',
    type: 'string',
    description: 'Coordinates for tile [x,y,o]',
  })
  .option('shape', {
    alias: 's',
    type: 'string',
    description: 'Shape for tile [0 = Thicc, 1 = Thin]',
  })
  .help().argv;

const getTiles = async (self, uuid) =>{
  try {
    const response = await axios.get(self.tilesUrl)
    return response.data
  } catch (error) {
    console.error("Error fetching tiles:", error);
    throw error;
  }
}

const getTile = async (self, uuid, user) => {
  const path = 'tile'
  const method = 'GET'

  const params = { i: uuid }
  // const tiles = getTiles(self, uuid)

  // const tile = isUUID(user) ? tiles.find(tile => tile.n === user) : tiles.find(tile => tile.h === user) 
  
  return await processRequest(self, method, path, params)
}

const changeColor = (self, uuid, user, color) =>{
  const path = 'tile'
  const method = 'POST'

  const params = { i: uuid }

  return processRequest(self, method, path, params)
}

const placeTile = (self, uuid, user, color, x, y, o, shape) =>{
  const path = 'place'
  const method = 'POST'

  const params = { i: uuid, c: color, x, y, o, s: shape }

  params = isUUID(user) ? { ...params, n: user } : { ...params, h: user }

  return processRequest(self, method, path, params)
}


const processRequest = async (self, method, path, params) => {
  const config = self.config;
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": config.API_KEY,
  };

  const url = config.API_URL || 'localhost'

  const request = {
    host: new URL(url).host,
    path: path || '/',
    method: method || 'POST',
    headers,
    url,
    body: params
  }

  axios(request)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

const uuid = argv.uuid || process.env.UUID;

getConfig().then(async (config) => {
    console.log({argv})
    self.config = config;
    const action = argv.action || 'getTiles'
    let response, tile = null;
    switch (action) {
      case 'getTiles':
        console.log('Getting tiles')
        response = await getTiles(self, uuid)
        console.log(response)
        return response
      case 'getTile':
        tile = argv.handle || argv.tileID
        console.log('Getting tile for', tile)
        response = await getTile(self, uuid, tile)
        console.log('Tile: ', response)
        return response
      case 'placeTile':
        tile = argv.handle || argv.tileID
        console.log('Placing tile for', tile)
        response = placeTile(self, uuid, tile, argv.color, argv.x, argv.y, argv.o, argv.shape)
        console.log(response)
        return response
      default:
        throw new Error(`Unknown action: ${action}`);
    }  
  }
);
