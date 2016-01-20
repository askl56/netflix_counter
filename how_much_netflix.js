
// how_much_netflix.js
// A script that looks through your Netflix viewing activity and
// tallys up how much time you've spent watching Netflix
//
// INSTRUCTIONS TO USE:
// Open https://www.netflix.com/WiViewingActivity and the developer console
// Copy and paste this script into the developer console and press enter
//
(function() {
  var fetchAllViewedItems = function() {
    var deferred = jQuery.Deferred();
    var viewedItems = [];
    (function fetchPage(page) {
      var api = netflix.contextData.services.data.api;
      var path = api.protocol + '://' + api.hostname + '/' + api.path.join('/');
      jQuery.getJSON(path + '/viewingactivity?pg=' + page).done(function(json) {
        viewedItems = viewedItems.concat(json.viewedItems);
        console.log('Fetched %s viewed items', viewedItems.length);
        if (json.viewedItems.length == json.size) {
          fetchPage(++page);
        } else {
          deferred.resolve(viewedItems);
        }
      }).fail(deferred.reject);
    })(0);
    return deferred.promise();
  };
  fetchAllViewedItems().then(function(viewedItems) {
    var totalTime = viewedItems.reduce(function(runningTotal, viewedItem) {
      return runningTotal + viewedItem.bookmark;
    }, 0);
    var days = Math.floor(totalTime / 60 / 60 / 24);
    var hours = Math.floor((totalTime / 60 / 60) % 24);
    var minutes = Math.round((totalTime / 60) % 60);
    console.log('According to your viewing history, you have cumulatively watched %i days, %i hours and %i minutes of Netflix', days, hours, minutes);
  });
})();
