'use strict';

var Backbone           = require('backbone');
var $                  = require('jquery');
var User               = require('../models/User');
var UserCollection     = require('../models/UserCollection');
var UserView           = require('../views/UserView');
var UserCollectionView = require('../views/UserCollectionView');

module.exports = Backbone.Router.extend({
  routes: {'users/:id': 'show',
           'users': 'index'},

  show: function(id){

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
