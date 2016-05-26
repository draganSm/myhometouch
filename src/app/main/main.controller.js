(function() {
  'use strict';

  angular
    .module('myhometouch.main', ['ngMap', 'google.places'])
    .constant('updateInterval', 500)
    .constant('timeFormat', 'HH:MM:ss a')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($scope, NgMap, timeZoneService, $timeout, updateInterval, timeFormat) {
    var vm = this;

    // the place name
    vm.placeName = null;
    // used by auto-complete field
    vm.place = null;
    // the resulting local time for the give place
    vm.currentTime = null;
    // offset (DST + raw) given in secs
    vm.offset = 0;

    NgMap.getMap().then(function (map) {
      vm.map = map;
    });

    vm.updateTime = function() {
      // find the time zone
      var localTime = timeZoneService.getLocalTime(vm.offset);
      vm.currentTime = localTime.format(timeFormat);
      $timeout(vm.updateTime, updateInterval);
    };

    $scope.$on('g-places-autocomplete:select', function (event, place) {
      var lat = place.geometry.location.lat();
      var lng = place.geometry.location.lng();

      // update the position on the gmap
      vm.position = {
        lat: lat,
        lng: lng
      };
      vm.map.setCenter(place.geometry.location);
      vm.placeName = place.name;

      timeZoneService.getTimeZone(lat, lng).then(function(response) {
        vm.offset = response.data.dstOffset + response.data.rawOffset;
        vm.updateTime();
      });
    });
  }
})();
