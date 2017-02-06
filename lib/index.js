"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var dispatch = _ref.dispatch;
  return function (next) {
    return function (action) {
      if (Array.isArray(action)) {
        return action.map(dispatch);
      }
      return next(action);
    };
  };
};