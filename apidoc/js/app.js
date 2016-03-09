(function() { 'use strict';

angular.module('tradity-apidoc', [
  'hc.marked'
]).config(function(markedProvider) {
  markedProvider.setOptions({gfm: true});
});

})();
