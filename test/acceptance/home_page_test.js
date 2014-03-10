'use strict';
/*global casper*/

casper.test.begin('testing our REST API', 1, function suite(test) {

  casper.start('http://localhost:3000', function() {
    test.assertHttpStatus(200);
  });

  casper.then(function(){
    this.log('and then?');
    this.echo(this.getHTML('body'));
  });

  casper.run(function(){
    test.done();
  });

});
