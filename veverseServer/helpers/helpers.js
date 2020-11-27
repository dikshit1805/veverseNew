const util = require('util')
const gc = require('../config/config')
const bucket = gc.bucket('veversestorage')

const { format } = util

/**
 *
 * @param { File } object file object that will be uploaded
 * @description - This function does the following
 * - It uploads a file to the image bucket on Google Cloud
 * - It accepts an object as an argument with the
 *   "originalname" and "buffer" as keys
 */

const uploadImage = (file,videoID) => new Promise((resolve, reject) => {
  const { originalname, buffer } = file

  const blob = bucket.file(`Video/${videoID}/`+originalname.replace(/ /g, "_"))
  const blobStream = blob.createWriteStream({
    resumable: false
  })
  console.log('blob name',blob.name);
  blobStream.on('finish', () => {
    const publicUrl = format(
      `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    )
    console.log('publicUrl',publicUrl);
    resolve(publicUrl)
  })
  .on('error', () => {
    reject(`Unable to upload video, something went wrong`)
  })
  .end(buffer)

})

module.exports = uploadImage