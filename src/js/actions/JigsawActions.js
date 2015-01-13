var AppConstants = require('../constants/AppConstants');
var AppDispatcher = require('../dispatchers/AppDispatcher');
var seedrandom = require('seedrandom');

var JigsawActions = {

  updateValues: function(m) {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.ActionTypes.JIGSAW_UPDATE,
      data: m
    });
  },

  updateValue: function(k, v) {
    var d = {};
    d[k] = v;
    JigsawActions.updateValues(d);
  },

  randomize: function() {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.ActionTypes.RANDOMIZE});
  },

  undo: function() {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.ActionTypes.JIGSAW_UNDO
    });
  },
  redo: function() {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.ActionTypes.JIGSAW_REDO
    });
  }
};

module.exports = JigsawActions;
