/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-7e5eb42b'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "registerSW.js",
    "revision": "1872c500de691dce40960bb85481de07"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "896bcc9d5bf388c38d62c56e71ed79f6"
  }, {
    "url": "pwa-512x512.png",
    "revision": "6e5ab8bb4bbb996302433aaa38788a63"
  }, {
    "url": "pwa-192x192.png",
    "revision": "81002e857bb21673c9c67af41647e85d"
  }, {
    "url": "index.html",
    "revision": "585c08ddd3acf58db98b02fe5da7c3dc"
  }, {
    "url": "icon.svg",
    "revision": "caea6bcb7bddddec835c3731a8715f53"
  }, {
    "url": "favicon.png",
    "revision": "1f74c451c18557207f149e8de709a68e"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "7c77b10ead7481600e41e2a997c9a45b"
  }, {
    "url": "assets/index-siUZ1nO-.js",
    "revision": null
  }, {
    "url": "assets/index-CcQ8Fkdh.css",
    "revision": null
  }, {
    "url": "assets/glb/rook_white.glb.gz.b64",
    "revision": null
  }, {
    "url": "assets/glb/queen_white.glb.gz.b64",
    "revision": null
  }, {
    "url": "assets/glb/pawn_white.glb.gz.b64",
    "revision": null
  }, {
    "url": "assets/glb/option8_cathedral.glb.gz.b64",
    "revision": null
  }, {
    "url": "assets/glb/knight_white.glb.gz.b64",
    "revision": null
  }, {
    "url": "assets/glb/king_white.glb.gz.b64",
    "revision": null
  }, {
    "url": "assets/glb/bishop_white.glb.gz.b64",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "7c77b10ead7481600e41e2a997c9a45b"
  }, {
    "url": "favicon.png",
    "revision": "1f74c451c18557207f149e8de709a68e"
  }, {
    "url": "icon.svg",
    "revision": "caea6bcb7bddddec835c3731a8715f53"
  }, {
    "url": "pwa-192x192.png",
    "revision": "81002e857bb21673c9c67af41647e85d"
  }, {
    "url": "pwa-512x512.png",
    "revision": "6e5ab8bb4bbb996302433aaa38788a63"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "896bcc9d5bf388c38d62c56e71ed79f6"
  }, {
    "url": "manifest.webmanifest",
    "revision": "c0146b7a556ace94b0bcd090d055016a"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));

}));
