module.exports = {
  apps : [{
    name   : 'kpd',
    script : '/app/dist/main.js',
    env: {
      NODE_ENV: "production"
    }
  }]
}
