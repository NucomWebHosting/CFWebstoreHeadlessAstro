module.exports = {
  apps: [
    {
      name: "astro-app",
      script: "./dist/server/entry.mjs",
      env: {
        HOST: "127.0.0.1",
        PORT: 4321,
        NODE_ENV: "production",
        UPLOAD_DIR: "/var/www/frontend.nucomwebhosting.com/images",
        IMAGE_BASE_URL: "/images",
      },
    },
  ],
};
