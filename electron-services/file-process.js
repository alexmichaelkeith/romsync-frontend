const fs = require("fs");
const path = require("path");
const axios = require("axios");
const moment = require("moment");
const util = require("util");
const utimes = util.promisify(require("utimes").utimes);
// Function to create a file within a directory

async function createFile(fileDetails) {
  axios({
    method: "get",
    url:
      "http://localhost:5000/rombackend/us-central1/app/data",
    responseType: "stream",
    headers: {
      filename: fileDetails.fileName,
      authorization: fileDetails.authorization
    }
  }).then(function(response) {
    const mtime = moment(
      response.headers.lastmodified,
      "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ [(]z[)]"
    ).toDate();
    const ctime = moment(
      response.headers.createdtime,
      "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ [(]z[)]"
    ).toDate();
    // Write data to your file
    fs.promises
      .writeFile(fileDetails.path, response.data)
      .then(() => {
        // Use utimes to set the new modified time
        return fs.promises.stat(fileDetails.path);
      })
      .then(stats => {
        return utimes(fileDetails.path, ctime, mtime);
      })
      .then(() => {
        console.log("File times updated successfully!");
      })
      .catch(err => {
        console.error(err);
      });
      console.log('wrote')
  });
}

// Function to read and return the content of a file
async function readFile(path) {
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
      if (stats.isFile() && file[0] != ".") {
        fileDetails.push({
          fileName: file,
          path: filePath,
          lastModified: stats.mtime.toString(),
          createdtime: stats.birthtime.toString(), //possible issue on linux
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
