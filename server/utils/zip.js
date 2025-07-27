import fs from "fs-extra";
import archiver from "archiver";
import path from "path";

/**
 * Helper to get folder size in bytes
 */
async function getFolderSize(folderPath) {
  const files = await fs.readdir(folderPath);
  let totalSize = 0;

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const stats = await fs.stat(filePath);

    if (stats.isDirectory()) {
      totalSize += await getFolderSize(filePath);
    } else {
      totalSize += stats.size;
    }
  }

  return totalSize;
}

/**
 * Zips a folder excluding unnecessary files like node_modules, .git, dist, etc.
 * @param {string} sourceFolderPath - Absolute path to the folder you want to zip.
 * @param {string} zipFilePath - Absolute path to save the generated zip file.
 */
export async function zipFolder(sourceFolderPath, zipFilePath) {
  return new Promise(async (resolve, reject) => {
    console.log("Zipping folder:", sourceFolderPath);

    const beforeSize = await getFolderSize(sourceFolderPath);
    console.log(
      `Original folder size: ${(beforeSize / (1024 * 1024)).toFixed(2)} MB`
    );

    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", async () => {
      const stats = await fs.stat(zipFilePath);
      console.log(
        `Zipped file size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`
      );
      console.log(`Folder zipped successfully to ${zipFilePath}`);
      resolve();
    });

    archive.on("error", (err) => {
      console.error("Zipping error:", err);
      reject(err);
    });

    archive.pipe(output);

    archive.glob("**/*", {
      cwd: sourceFolderPath,
      ignore: [
        "node_modules/**",
        "dist/**",
        "build/**",
        ".git/**",
        "*.log",
        ".env",
        ".DS_Store",
      ],
    });

    archive.finalize();
  });
}
