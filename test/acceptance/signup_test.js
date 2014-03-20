'use strict';
/*global casper*/

casper.test.begin('users', 2, function suite(test) {

  casper.start('http://localhost:3000/signup', function() {
    test.assertHttpStatus(200);
  });

  casper.then(function(){
    this.fill('form#signupForm', {
      'email': 'test@example.com',
      'password': 'valid-pass-word'
    }, true);
  });

  casper.then(function(){
    test.info(this.getHTML());
    test.assertTextExists('Profile','page body contains profile');
    test.assertHttpStatus(200);
  });

  casper.run(function(){
    test.done();
  });

});
