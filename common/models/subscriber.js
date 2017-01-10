// subscriber.js
// Get ride data for a subscriber by id.  
// No lat/lon from the front end, geocode the incoming addresses.	
// send coords to backend to build the queries
// Send 
module.exports = function(Subscriber) {
   
  // Google Maps API has a rate limit of 10 requests per second
  // Seems we need to enforce a lower rate to prevent errors
  var lookupGeo = require('function-rate-limit')(5, 1000, function() {
    var geoService = Subscriber.app.dataSources.geo;
    geoService.geocode.apply(geoService, arguments);
  });

  Subscriber.beforeRemote('prototype.updateAttributes', function(ctx, user, next) {
    
	// Grab the route from memory
    var body = ctx.req.body;
    console.log('beforeRemote -- route geocoded');    
    if (body                    &&
        body.route        &&
        body.route.start_address &&
        body.route.end_address ) {

      var loc = body.route;
		
      // Geocode the start of route
      lookupGeo(loc.start_address, 
        function(err, result) {
           if (result && result[0]) {
            body.geo = result[0];
             console.log(result);
          } else {
             //TODO: Need to find out how to handle this with better a UX experience
            next(new Error('could not find location'));
          }
        });
		// Geocode the destination
      lookupGeo(loc.end_address, 
        function(err, end_result) {
           if (end_result && end_result[0]) {
            body.endgeo = end_result[0];
             console.log(end_result);
			next();
          } else {
             //TODO: Need to find out how to handle this with better a UX experience
			next(new Error('could not find location'));
          }
        });

    } else {
      next();
    }

  });


  // Get rides for specific subscriber by id
  Subscriber.getRides = function (subscriberId, cb) {
      Subscriber.findById(subscriberId, function (err, instance) {

          if (err) {
              return cb(err);
          }

          // grab lats/lons from geocoder
          if (instance && instance.route) {
              var start_lat = instance.geo.lat;
              var start_lon = instance.geo.lng;
              var end_lat = instance.endgeo.lat;
              var end_lon = instance.endgeo.lng;
			  
			  var rides = Subscriber.app.dataSources.rides;
			  
			  // send lats/lons to datasources
			  rides.getrides
              (
                start_lat,
                start_lon,
                end_lat,
                end_lon,
                function (err, results) {
					// wait for queries...
                    if (err) {
                        cb(err);
                    } else {
						// show us the ride data!
                        console.log(results);
                        cb(null, results);
                    }

                }
              );

          } else {
              cb(null, {});
          }

      })
  };

// Generate a string so the front end can display the ride data, see home controller.js
  Subscriber.remoteMethod('getRides', {
      accepts: [
        { arg: 'id', type: 'string', required: true }
      ],
      http: { path: '/:id/rides', verb: 'get' },
      returns: { arg: 'rides', type: 'object' }
  });

};