/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.2.0/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "config.js",
    "revision": "07b2ee590134e809c933854af501f9db"
  },
  {
    "url": "index.html",
    "revision": "a3be156f35127b43a53b748409a64c0a"
  },
  {
    "url": "service-worker.js",
    "revision": "ea0f9c6fedc9364461557140e9ca5e26"
  },
  {
    "url": "src/assets/images/1f680.png",
    "revision": "0652d2ce2e3312d018a5771bcdef066b"
  },
  {
    "url": "src/components/data/twit-auth.js",
    "revision": "9b8615f833d3d5f16dd0dc0d587100a9"
  },
  {
    "url": "src/components/data/twit-login.js",
    "revision": "7ee93b03c779676ae3863e9440d1d66c"
  },
  {
    "url": "src/components/data/twit-store.js",
    "revision": "312a728659a482719c4598b165022e9b"
  },
  {
    "url": "src/components/data/twit-sync.js",
    "revision": "dc6fc896d5e4b766ee365743a25bcfca"
  },
  {
    "url": "src/components/layout/blocs/twit-button.js",
    "revision": "25b5718697512e519c269ed4d22c4b7b"
  },
  {
    "url": "src/components/layout/blocs/twit-element.js",
    "revision": "798fb93adaf6c1c1090cf6577008bab0"
  },
  {
    "url": "src/components/layout/blocs/twit-new.js",
    "revision": "9c6da907ba4406fcf0cc00b3f7ee6341"
  },
  {
    "url": "src/components/layout/blocs/twit-pic.js",
    "revision": "b2802f4be94347ca8d6a5cec0b412bdc"
  },
  {
    "url": "src/components/layout/navigation/twit-footer.js",
    "revision": "6ac04198f5d81b965776693e89cb188d"
  },
  {
    "url": "src/components/layout/navigation/twit-header.js",
    "revision": "7a7782492994e9835840543ca7bbace3"
  },
  {
    "url": "src/components/system/connectivity.js",
    "revision": "ec02ff99a671ed4bb27a3196cd16afde"
  },
  {
    "url": "src/components/twit-app.js",
    "revision": "cd1dbe901a3fdeb2765208a200fe85fe"
  },
  {
    "url": "src/components/views/twit-home.js",
    "revision": "9fae1fdd7a06a455f8561228ff55407b"
  },
  {
    "url": "src/components/views/twit-notification.js",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "src/components/views/twit-post.js",
    "revision": "1278951f93ad34ec62a737876c3faf70"
  },
  {
    "url": "src/components/views/twit-profile.js",
    "revision": "7490160227e27a16e55e25ae1f40ae12"
  },
  {
    "url": "workbox-config.js",
    "revision": "1c67e7bee876c4f48ba3d185e2254492"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
