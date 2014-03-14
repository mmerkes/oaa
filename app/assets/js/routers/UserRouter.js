'use strict';

//var User               = require('../models/User');
//var UserView           = require('../views/UserView');

var Backbone           = require('backbone');
var $                  = require('jquery');
var UserCollection     = require('../models/UserCollection');
var UserCollectionView = require('../views/UserCollectionView');

module.exports = Backbone.Router.extend({
  routes: {'users/:id': 'show',
           'users': 'index'},

  show: function(id){
    console.log(id);
  },

  start: function(){
    Backbone.history.start({pushState: true});
  },

  index: function(){
    this.userList.fetch();
    $('.container').replaceWith(this.userListView.el);
  },

  initialize: function(){
    this.userList = new UserCollection();
    this.userListView = new UserCollectionView({collection: this.userList});

  }
});
