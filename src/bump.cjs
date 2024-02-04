const { join } = require("node:path");
const { readdir, readFile, writeFile } = require("node:fs/promises");
const { execSync } = require("node:child_process");

const root = join(__dirname, "..");

async function updateFiles() {
  try {
    const files = await readdir(root);
    const userJSFilename = files.find(file => file.endsWith(".user.js"));
    const filepath = join(root, userJSFilename);
    const contents = await readFile(filepath, "utf8");
    const updatedContents = contents.replace(/\b\d+\.\d+\.\d+\b/g, process.env.npm_package_version);
    await writeFile(filepath, updatedContents, "utf8");

    execSync(`git add ${filepath}`).toString();
  } catch (error) {
    console.error("Error:", error);
  }
}

updateFiles();
