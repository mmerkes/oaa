module.exports = {

  dev: {
    // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot
	  'url': 'mongodb://localhost/oaa'
  },

  test: {
    'url': 'mongodb://localhost/oaa-test'
  },

  prod: {
    'url': 'mongodb://localhost/oaa-prod'
  }
};
