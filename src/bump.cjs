const { join } = require("node:path");
const { readFile, writeFile } = require("node:fs/promises");
const { execSync } = require("node:child_process");

const root = join(__dirname, "..");
const files = [join(root, "tg-ad-filter.user.js"), join(root, "src/meta.txt")];

async function updateFiles() {
  try {
    for (const filepath of files) {
      const contents = await readFile(filepath, "utf8");
      const updatedContents = contents.replace(/\b\d+\.\d+\.\d+\b/g, process.env.npm_package_version);
      await writeFile(filepath, updatedContents, "utf8");
    }

    execSync(`git add ${files.join(" ")}`).toString();
  } catch (error) {
    console.error("Error:", error);
  }
}

updateFiles();
