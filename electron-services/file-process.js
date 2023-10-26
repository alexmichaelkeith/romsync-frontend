const fs = require("fs");
const path = require("path");
const axios = require("axios");
const moment = require("moment");
const util = require("util");
const utimes = util.promisify(require("utimes").utimes);
// Function to create a file within a directory

async function createFile(fileDetails) {
  try {
    const response = await axios({
      method: "get",
      url: "http://localhost:5000/rombackend/us-central1/app/data",
      responseType: "stream",
      headers: {
        filename: fileDetails.fileName,
        authorization: fileDetails.authorization
      }
    });


    const mtime = moment(
      response.headers.lastmodified,
      "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ [(]z[)]"
    ).toDate();

    const ctime = moment(
      response.headers.createdtime,
      "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ [(]z[)]"
    ).toDate();

    await fs.promises.writeFile(fileDetails.path, response.data);
    utimes(fileDetails.path, ctime, mtime)
    return 'File Created'
    }
    catch{
      throw new Error('File not Created');
    }

}


async function readFile(path) {
  try {
    const [fileContent, fileStats] = await Promise.all([
      fs.promises.readFile(path),
      fs.promises.stat(path),
    ]);
    return {
      file: fileContent,
      stats: fileStats,
    };
  } catch (error) {
    console.error('Error reading file:', error);
    throw new Error('File read error');
  }
}

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
try{
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
          createdtime: stats.birthtime.toString(),
          fileSizeBytes: stats.size
        });
      }
    }
    return fileDetails
  }
  catch{
    err=>console.log(err)
  }
}

module.exports = { scanDirectory, removeFile, createFile, readFile };
