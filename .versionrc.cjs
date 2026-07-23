module.exports = {
  tagPrefix: "",
  bumpFiles: [
    "package.json",
    { filename: "tg-ad-filter.user.js", updater: "src/meta-updater.js" },
    { filename: "src/meta.txt", updater: "src/meta-updater.js" }
  ],
  scripts: {
    prerelease: "npm run lint:all"
  },
  writerOpts: {
    finalizeContext(context) {
      if (!context.commitGroups?.length) {
        context.commitGroups = [{ commits: [{ header: "No significant changes" }] }];
      }
      return context;
    }
  }
};
