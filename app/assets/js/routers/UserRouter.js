'use strict';

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
    Backbone.history.start({pushState: false});
  },

  index: function(){
    this.userList.fetch();
    $('.mainContent').replaceWith(this.userListView.el);
  },

  initialize: function(){
    this.userList = new UserCollection();
    this.userListView = new UserCollectionView({collection: this.userList});

  }
});
