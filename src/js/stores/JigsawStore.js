var AppConstants = require('../constants/AppConstants');
var EventEmitter = require('events').EventEmitter;
var Immutable = require('immutable');
var AppDispatcher = require('../dispatchers/AppDispatcher');
var _ = require('underscore');

var jigsawConfig = Immutable.Map({
    gridWidth: 4,
    gridHeight: 4,
    pixelWidth: 400,
    pixelHeight: 400,
    tabProbability: .8,
    curveCtrlMin: .02,
    curveCtrlMax: .05,
    tabLenFactorMin: .3,
    tabLenFactorMax: .3,
    tabThicknessFactorMin: .5,
    tabThicknessFactorMax: .5,
    tabCurveFactorMin: .4,
    tabCurveFactorMax: .4,
    variance: .1,
    randSeed: Math.random()
});

var jigsawConfigObj = null;

var undoStack = Immutable.Stack();

var redoStack = Immutable.Stack();

function update(updates) {
  undoStack = undoStack.push(jigsawConfig);
  jigsawConfig = jigsawConfig.merge(updates);
  jigsawConfigObj = null;
  redoStack = Immutable.Stack();
}

function randomize() {
  update({randSeed: Math.random()});
}

function undo() {
  redoStack = redoStack.push(jigsawConfig);
  jigsawConfig = undoStack.peek();
  jigsawConfigObj = null;
  undoStack = undoStack.pop();
}

function redo() {
  undoStack = undoStack.push(jigsawConfig);
  jigsawConfig = redoStack.peek();
  jigsawConfigObj = null;
  redoStack = redoStack.pop();
}

var JigsawStore = _.extend(EventEmitter.prototype, {
  emitChange: function() {
    this.emit(
      AppConstants.CHANGE_EVENT
    );
  },

  addChangeListener: function(callback) {
    this.on(AppConstants.CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(AppConstants.CHANGE_EVENT, callback);
  },

  getConfig: function() {
    if (jigsawConfigObj == null) {
      jigsawConfigObj = jigsawConfig.toJS();
    }
    return jigsawConfigObj;
  },

  canUndo: function() {
    return undoStack.size > 0;
  },

  canRedo: function() {
    return redoStack.size > 0;
  },

  getRandSeed: function() {
    return jigsawConfig.get('randSeed');
  },

  dispatcherIndex: AppDispatcher.register(function(payload) {
    var action = payload.action;
    switch(action.actionType) {
      case AppConstants.ActionTypes.JIGSAW_UPDATE:
        update(action.data);
        break;
      case AppConstants.ActionTypes.JIGSAW_UNDO:
            if (JigsawStore.canUndo()) {
              undo();
            } else {
              return true; // ?
            }
            break;
      case AppConstants.ActionTypes.JIGSAW_REDO:
            if (JigsawStore.canRedo()) {
              redo();
            } else {
              return true; // ?
            }
            break;
      case AppConstants.ActionTypes.RANDOMIZE:
            randomize();
            break;
      default:
        return true;
    }

    JigsawStore.emitChange();
    return true;
  })

});

JigsawStore.setMaxListeners(20);

module.exports = JigsawStore;
