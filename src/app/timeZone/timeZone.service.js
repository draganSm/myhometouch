(function () {
  'use strict';

  angular
    .module('myhometouch.timeZone', [])
    .constant('googleServiceUrl', 'https://maps.googleapis.com/maps/api/timezone/json')
    .factory('timeZoneService', timeZone);


  /** @ngInject */
  function timeZone($http, moment, googleServiceUrl) {

    /**
     * get the local time
     * @param offset DST + raw offset given in seconds
     */
    function getLocalTime(offset) {
      var utc = moment.utc();
      var localTime = utc.add(offset, 'second');
      return localTime;
    }


    /**
     * get time zone based on latitude and longitude for the give place
     * @param lat
     * @param lng
     * @returns {*}
     */
    function getTimeZone(lat, lng) {
      var unixEpochMs = moment.utc().valueOf(),
      /*
         https://developers.google.com/maps/documentation/timezone/intro#Requests:
         timestamp specifies the desired time as seconds since midnight,
         January 1, 1970 UTC. The Google Maps Time Zone API uses the
         timestamp to determine whether or not Daylight Savings should
         be applied. Times before 1970 can be expressed as negative values.
         */
        timestamp = parseInt(unixEpochMs/1000), // ms -> sec  conversion
        http = {
        method: 'get',
        url: googleServiceUrl,
        params: {
          location: [lat, lng].join(','),
          timestamp: timestamp
        }
      };
      return $http(http);
    }

    return {
      getTimeZone: getTimeZone,
      getLocalTime: getLocalTime
    }
  }

})();
