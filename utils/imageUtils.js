const fs = require('fs');
const axios = require('axios');
const path = require('path');
const sharp = require('sharp');

const downloadImage = async (imageUrl, imageName) => {
  const folderName = __dirname + "/../images";
  const imagePath = path.resolve(folderName, imageName);
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }

  // download image using axios with response type stream
  const response = await axios({
    method: 'GET',
    url: imageUrl,
    responseType: 'stream'
  });

  // pipe the result stream into file on disc
  response.data.pipe(fs.createWriteStream(imagePath));

  // return a promise to be used when the download finishes
  return new Promise((resolve, reject) => {
    response.data.on('end', () => {
      resolve(imagePath);
    });

    response.data.on('error', e => {
      reject(e)
    });
  });


};

const resizeImage = (imagePath, format, width, height) => {
  const readStream = fs.createReadStream(imagePath);
  let transform = sharp();
  if (format) {
    transform = transform.toFormat(format);
  }

  if (width || height) {
    transform = transform.resize(width, height);
  }

  return readStream.pipe(transform);
}

module.exports = {
  downloadImage,
  resizeImage
}