"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var Binder = function () {
  /*
  bind: function (
  	obj: object,
  	prop: string,
  	cbk: function () => void
  ) => object
  */
  function bind(emitter, property, callback, owner) {
    if (!emitter._binder) {
      Object.defineProperty(emitter, '_binder', {
        configurable: true,
        value: {}
      });
    }

    if (!emitter._binder[property]) {
      emitter._binder[property] = {
        value: emitter[property],
        callbacks: []
      };
      Object.defineProperty(emitter, property, {
        configurable: true,
        get: function get() {
          return this._binder[property].value;
        },
        set: function set(newValue) {
          var oldValue = this._binder[property].value;

          if (newValue !== oldValue) {
            this._binder[property].value = newValue;

            var callbacks = _toConsumableArray(this._binder[property].callbacks);

            for (var index = 0, length = callbacks.length; index < length; index++) {
              callbacks[index].callback(newValue, oldValue);
            }
          }
        }
      });
    }

    emitter._binder[property].callbacks.push({
      callback: callback,
      owner: owner
    });

    return emitter;
  }
  /*
  bind: function (
  	obj: object,
  	prop: undefined | null | string,
  	cbk: undefined | null | function () => void
  ) => object
  */


  function unbind(emitter, property, callback, owner) {
    if (emitter._binder) {
      var process = function process(property) {
        // Remove callback
        var index = 0;

        while (index < emitter._binder[property].callbacks.length) {
          if (callback == null || callback === emitter._binder[property].callbacks[index].callback || owner == null || owner === emitter._binder[property].callbacks[index].owner) {
            emitter._binder[property].callbacks.splice(index, 1);

            continue;
          }

          index++;
        } // Remove property


        if (emitter._binder[property].callbacks.length === 0) {
          delete emitter[property];
          emitter[property] = emitter._binder[property].value;
          delete emitter._binder[property]; // Remove binder

          var isEmpty = true;

          for (var key in emitter._binder) {
            // eslint-disable-line no-unused-vars
            isEmpty = false;
            break;
          }

          if (isEmpty) {
            delete emitter._binder;
          }
        }
      };

      if (property == null) {
        for (var key in emitter._binder) {
          process(key);
        }
      } else {
        process(property);
      }
    }

    return emitter;
  }

  return {
    bind: bind,
    unbind: unbind
  };
}();
/* exported Binder */