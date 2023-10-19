const fs = require("fs");
const path = require("path");
const axios = require("axios");
// Function to create a file within a directory
async function createFile(fileDetails) {
  axios({
    method: "get",
    url:
      "http://localhost:5000/rombackend/us-central1/app/data?directory=akeithx&authorization=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFsZXgubWljaGFlbC5rZWl0aEBnbWFpbC5jb20iLCJpYXQiOjE2OTY4ODgzNjV9.LXfwDA8aaCcWAk65HNdudjhVIzTJUy73xGiPvxUJkBo&fileName=Super Mario 64 DS2.nds",
    responseType: "stream",
    headers: {
      filename: fileDetails.fileName,
      authorization: fileDetails.authorization
    }
  }).then(function(response) {
    response.data.pipe(
      fs.createWriteStream("/Users/alexkeith/roms/" + fileDetails.fileName)
    );
  });
}

// Function to read and return the content of a file
async function readFile(path) {
  let fileDetails = {};

  function getFileDetails(path) {
    return new Promise((resolve, reject) => {
      const fileDetails = {};

      fs.readFile(path, (err, file) => {
        if (err) {
          console.error(err);
          reject(err);
          return;
        }
        fileDetails.file = file;

        fs.stat(path, (err, stats) => {
          if (err) {
            console.error(err);
            reject(err);
            return;
          }
          fileDetails.stats = stats;

          resolve(fileDetails);
        });
      });
    });
  }
  return getFileDetails(path);
}

// Function to remove a file within a directory
async function removeFile(directoryPath, fileName) {
  try {
    const filePath = path.join(directoryPath, fileName);
    await fs.promises.unlink(filePath);
    console.log(`File "${fileName}" removed from "${directoryPath}"`);
  } catch (err) {
    console.error(
      `Error removing file "${fileName}" from "${directoryPath}":`,
      err
    );
  }
}

async function scanDirectory(directoryPath) {
  try {
    const files = await fs.promises.readdir(directoryPath);
    const fileDetails = [];

    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const stats = await fs.promises.stat(filePath);

      if (stats.isFile()) {
        fileDetails.push({
          fileName: file,
          path: filePath,
          lastModified: stats.mtime.toString(),
          fileSizeBytes: stats.size
        });
      }
    }

    return fileDetails;
  } catch (err) {
    return [];
  }
}

module.exports = { scanDirectory, removeFile, createFile, readFile };
