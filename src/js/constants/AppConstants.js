var keyMirror = require('react/lib/keyMirror');

module.exports = {

  CHANGE_EVENT: 'change',

  ActionTypes: keyMirror({
    JIGSAW_UPDATE: null,
    JIGSAW_UNDO: null,
    JIGSAW_REDO: null,
    RANDOMIZE: null
  }),

  ActionSources: keyMirror({
    SERVER_ACTION: null,
    VIEW_ACTION: null
  })

};
