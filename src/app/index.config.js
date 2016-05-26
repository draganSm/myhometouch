(function() {
  'use strict';

  angular
    .module('myhometouch')
    .config(config);

  /** @ngInject */
  function config($logProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

  }

})();
