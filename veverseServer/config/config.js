
const path = require('path')

const serviceKey = path.join(__dirname, '../veversedikshit-efa8a9a779b3.json')
console.log('serviceKey',serviceKey)
const { Storage } = require('@google-cloud/storage')

const storage = new Storage({
  keyFilename: serviceKey,
  projectId: 'veversedikshit',
})

module.exports = storage


