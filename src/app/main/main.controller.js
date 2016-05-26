(function() {
  'use strict';

  angular
    .module('myhometouch.main', ['ngMap', 'google.places'])
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($scope, NgMap, timeZoneService) {
    var vm = this;

    // used by auto-complete field
    vm.place = null;
    // the resulting local time for the give place
    vm.currentTime = null;

    NgMap.getMap().then(function (map) {
      vm.map = map;
    });

    $scope.$on('g-places-autocomplete:select', function (event, place) {
      var lat = place.geometry.location.lat();
      var lng = place.geometry.location.lng();

      // update the position on the gmap
      vm.position = {
        lat: lat,
        lng: lng
      };
      vm.map.setCenter(place.geometry.location);

      timeZoneService.getTimeZone(lat, lng).then(function(response) {
        // find the time zone
        var localTime = timeZoneService.getLocalTime(response.data.dstOffset + response.data.rawOffset);
        vm.currentTime = localTime.format('HH:MM a');
      });
    });
  }
})();
