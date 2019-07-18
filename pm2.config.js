const config = require("./config/config");
module.exports = {
  apps: [
    {
      name: config.PROCESS_NAME,
      script: "./index.js",
      autorestart: true,
      watch: true,
      env: {
        NODE_ENV: "development"
      },
      env_production: {
        NODE_ENV: "production"
      }
    }
  ]
};
