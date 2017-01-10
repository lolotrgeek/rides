module.exports = function(Subscriber) {

  // Google Maps API has a rate limit of 10 requests per second
  // Seems we need to enforce a lower rate to prevent errors
  var lookupGeo = require('function-rate-limit')(5, 1000, function() {
    var geoService = Subscriber.app.dataSources.geo;
    geoService.geocode.apply(geoService, arguments);
  });

  Subscriber.beforeRemote('prototype.updateAttributes', function(ctx, user, next) {
        
    var body = ctx.req.body;
    console.log('beforeRemote -- prototype.updateAttributes');    
    if (body                    &&
        body.preferences        &&
        body.preferences.start_address &&
        body.preferences.end_address ) {

      var loc = body.preferences;

      // geocode start
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
		//geocode end
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




  //The Rides
  Subscriber.getRides = function (subscriberId, cb) {
      Subscriber.findById(subscriberId, function (err, instance) {

          if (err) {
              return cb(err);
          }

          //parse location
          //parse location
          if (instance && instance.preferences) {
              var start_lat = instance.geo.lat;
              var start_lon = instance.geo.lng;
              var end_lat = instance.endgeo.lat;
              var end_lon = instance.endgeo.lng;
			  
				
              //find nearby rides
              var rides = Subscriber.app.dataSources.rides;
			  
			  rides.getrides
              (
                start_lat,
                start_lon,
                end_lat,
                end_lon,
                function (err, results) {

                    if (err) {
                        cb(err);
                    } else {
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


  Subscriber.remoteMethod('getRides', {
      accepts: [
        { arg: 'id', type: 'string', required: true }
      ],
      http: { path: '/:id/rides', verb: 'get' },
      returns: { arg: 'rides', type: 'object' }
  });

};