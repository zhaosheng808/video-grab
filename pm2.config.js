module.exports = {
  apps: [
    {
      name: 'video-grab',
      script: './server.js',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
