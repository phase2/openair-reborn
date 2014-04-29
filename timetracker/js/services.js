angular.module('timeTracker.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('ProjectsService', function() { //, [function () {
  // Might use a resource here that returns a JSON array
  // var ref = new Firebase("https://time-tracker123.firebaseio.com/");
  var retrievedObject,
  retrievedObject2 = [];




  return {
    all: function() {


      // Retrieve the object from storage
      retrievedObject = localStorage.getItem('timetrackersss');
      // console.log(JSON.parse(retrievedObject));
      // console.log('------------');



      // console.log('retrievedObject: ', JSON.parse(retrievedObject));
      return JSON.parse(retrievedObject);
      //
      // Return All Record
      // return $firebase(ref);
    },
    get: function(trackerId) {
      var tempSuper = JSON.parse(retrievedObject);
      // console.log(tempSuper.kbb);


      for (var key in tempSuper) {
        console.log('owhgohwegohewgoi');
         var obj = tempSuper[key];
         if(key == trackerId) {
          return obj;
          console.log(obj);
        }
      }

      // retrievedObject = localStorage.getItem('timetracker');
      // retrievedObject2= JSON.parse(retrievedObject);
      // return retrievedObject.trackerId;
        // return localStorage.timetracker.trackerId;
      // Return Records based on Project ID
      // return $firebase(ref.child(trackerId));
    },
    set: function(tracker) {
      // Put the object into storage
      localStorage.setItem('timetrackersss', JSON.stringify(tracker));
    }
  }
});
  // }
// }
// });
