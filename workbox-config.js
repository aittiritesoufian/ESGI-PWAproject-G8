module.exports = {
  "globDirectory": "./",
  "globPatterns": [
    "**/*.{js,html,png,jpg,jpeg}"
  ],
  "swDest": "sw.js",
  "runtimeCaching": [{
    "urlPattern": /\.(?:png|gif|jpg|jpeg|svg)$/,
    "handler": "CacheFirst",
  }],
  "importWorkboxFrom": "local",
  "globIgnores": [
    'node_modules/**/*',
    'workbox-config.js',
    'workbox-v4.2.0'
  ]
};