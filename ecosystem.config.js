module.exports = {
  apps: [
    {
      name: "AdminConsole",
      script: "npm run start",
      watch: false,
      ignore_watch: ["node_modules"],
      env_production: {
        NODE_ENV: "production"
      },
    },
  ],
};
