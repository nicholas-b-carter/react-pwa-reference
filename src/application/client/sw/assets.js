/***
 * Copyright (c) 2015, 2016 Alex Grant (@localnerve), LocalNerve LLC
 * Copyrights licensed under the BSD License. See the accompanying LICENSE file for terms.
 *
 * Precaching and route installs for non-project (cdn) assets.
 * The 'data' module is generated by the build.
 */
'use strict';

var toolbox = require('sw-toolbox');
var urlm = require('utils/urls');
var data = require('./data');

/**
 * Install route GET handlers for cdn requests and precache assets.
 *
 * Route handlers for CDN requests are installed everytime as a side effect
 * of setting up precaching. However, precaching is only carried out as a result
 * of an 'install' event (not everytime).
 *
 * @see sw-toolbox
 */
function setupAssetRequests () {
  var next, hostname;

  toolbox.precache(
    data.assets
    .sort()
    .map(function (asset) {
      next = urlm.getHostname(asset);

      if (hostname !== next) {
        hostname = next;
        // New hostname, so install GET handler for that host
        toolbox.router.get('*', toolbox.networkFirst, {
          origin: hostname,
          // any/all CDNs get 3 seconds max
          networkTimeoutSeconds: 3
        });
      }

      // Precache the asset in 'install'
      return asset;
    })
  );
}

module.exports = {
  setupAssetRequests: setupAssetRequests
};