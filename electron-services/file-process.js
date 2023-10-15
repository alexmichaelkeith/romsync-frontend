const fs = require('fs').promises;
const path = require('path');

async function scanDirectory(directoryPath) {
  try {
    const files = await fs.readdir(directoryPath);
    const fileDetails = [];

    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const stats = await fs.stat(filePath);

      if (stats.isFile()) {
        fileDetails.push({
          fileName: file,
          lastModified: stats.mtime,
          fileSizeBytes: stats.size,
        });
      }
    }

    return fileDetails;
  } catch (err) {
    return [];
  }
}

module.exports = { scanDirectory };
