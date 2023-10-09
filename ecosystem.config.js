module.exports = {
  apps: [
    {
      name: "AdminConsole",
      script: "npm run start",
      watch: false,
      port: 5000,
      ignore_watch: ["node_modules"],
      env_production: {
        NODE_ENV: "production"
      },
    },
  ],
};


// require('dotenv').config();

// module.exports = {
//   apps: [
//     {
//       name: `AdminConsole`,
//       script: 'node_modules/next/dist/bin/next',
//       args: 'start',
// 		  wait_ready: true,
//       ignore_watch: ["node_modules"],
//       port: 5530,
//       env_development: {
//         APP_ENV: 'Development',
//         PORT: 5530,
//       },
//       env_production: {
//         APP_ENV: 'Production',
//         PORT: 5530,
//       }
//     },
//   ],
// };