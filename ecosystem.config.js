module.exports = {
  apps: [
    {
      name: "AdminConsole",
      script: "npm",
      args: "run start",
      cwd: "/apps/vigoplace-admin",
      interpreter: "node",
      watch: false,
      ignore_watch: ["node_modules"],
      env: {
        NODE_ENV: "production",
        PORT: 5000
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 5000
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