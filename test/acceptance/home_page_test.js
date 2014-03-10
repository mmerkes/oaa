'use strict';
/*global casper*/

casper.test.begin('testing our REST API', 1, function suite(test) {

  casper.start('http://localhost:3000/api/v1/users', function() {
    test.assertHttpStatus(200);
  });

  casper.then(function(){
    // we will replace this test with real user acceptance tests later
    this.echo(this.getHTML('body'));
  });

  casper.run(function(){
    test.done();
  });

});
