'use strict';

var Backbone = require('backbone');
var UserView = require('./UserView');
//var User = require('../models/User');

module.exports = Backbone.View.extend({
  initialize: function(){
    this.collection.on('add', this.addUser, this);
    this.collection.on('reset', this.addAll, this);
  },

  addUser: function(user){
    var userView = new UserView({model: user});
    this.$el.append(userView.el);
  },

  addAll: function(){
    this.collection.forEach(this.addUser, this);
  },

  render: function(){
    this.addAll();
  }
});
