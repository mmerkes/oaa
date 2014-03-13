//users_test.js

'use strict';
/*global casper*/

casper.test.begin('users', 3, function suite(test) {

  casper.start('http://localhost:3000#users', function() {
    test.assertHttpStatus(200);
  });

  casper.then(function(){
    test.assertTextExists('first_name', 'first name field label displays');
  });

  casper.then(function() {
    test.assertTextExists('last_name','last name field label displays');
  });

  casper.run(function(){
    test.done();
  });

});
