'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
Object.defineProperty(exports, 'Foo', {
  enumerable: true,
  get: function get() {
    return _Foo.default;
  },
});
Object.defineProperty(exports, 'Table', {
  enumerable: true,
  get: function get() {
    return _table.default;
  },
});
Object.defineProperty(exports, 'CustomTable', {
  enumerable: true,
  get: function get() {
    return _customTable.default;
  },
});

var _Foo = _interopRequireDefault(require('./components/Foo'));

var _table = _interopRequireDefault(require('./components/table'));

var _customTable = _interopRequireDefault(require('./components/custom-table'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
