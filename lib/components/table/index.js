'use strict';

function _typeof(obj) {
  '@babel/helpers - typeof';
  if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj &&
        typeof Symbol === 'function' &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? 'symbol'
        : typeof obj;
    };
  }
  return _typeof(obj);
}

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

var _react = _interopRequireDefault(require('react'));

var _antd = require('antd');

var _reactResizable = require('react-resizable');

var _excluded = ['onResize', 'width'];

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _extends() {
  _extends =
    Object.assign ||
    function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
  return _extends.apply(this, arguments);
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }
    keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(
          target,
          key,
          Object.getOwnPropertyDescriptor(source, key),
        );
      });
    }
  }
  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function _toConsumableArray(arr) {
  return (
    _arrayWithoutHoles(arr) ||
    _iterableToArray(arr) ||
    _unsupportedIterableToArray(arr) ||
    _nonIterableSpread()
  );
}

function _nonIterableSpread() {
  throw new TypeError(
    'Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
  );
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === 'string') return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === 'Object' && o.constructor) n = o.constructor.name;
  if (n === 'Map' || n === 'Set') return Array.from(o);
  if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}

function _iterableToArray(iter) {
  if (
    (typeof Symbol !== 'undefined' && iter[Symbol.iterator] != null) ||
    iter['@@iterator'] != null
  )
    return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ('value' in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError('Super expression must either be null or a function');
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, writable: true, configurable: true },
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf =
    Object.setPrototypeOf ||
    function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
  return _setPrototypeOf(o, p);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
      result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result);
  };
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === 'object' || typeof call === 'function')) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError(
      'Derived constructors may only return object or undefined',
    );
  }
  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called",
    );
  }
  return self;
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === 'undefined' || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === 'function') return true;
  try {
    Boolean.prototype.valueOf.call(
      Reflect.construct(Boolean, [], function () {}),
    );
    return true;
  } catch (e) {
    return false;
  }
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
  return _getPrototypeOf(o);
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}

var ResizeableTitle = function ResizeableTitle(props) {
  var onResize = props.onResize,
    width = props.width,
    restProps = _objectWithoutProperties(props, _excluded);

  if (!width) {
    return /*#__PURE__*/ _react.default.createElement('th', restProps);
  }

  return /*#__PURE__*/ _react.default.createElement(
    _reactResizable.Resizable,
    {
      width: width,
      height: 0,
      handle: /*#__PURE__*/ _react.default.createElement('span', {
        className: 'react-resizable-handle',
        onClick: function onClick(e) {
          e.stopPropagation();
        },
      }),
      draggableOpts: {
        enableUserSelectHack: false,
      },
      onResize: onResize,
    },
    /*#__PURE__*/ _react.default.createElement('th', restProps),
  );
};

var BasicTable = /*#__PURE__*/ (function (_React$Component) {
  _inherits(BasicTable, _React$Component);

  var _super = _createSuper(BasicTable);

  function BasicTable() {
    var _this;

    _classCallCheck(this, BasicTable);

    for (
      var _len = arguments.length, args = new Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    _this.state = {
      columns: [],
      expandedRows: [],
    };
    _this.components = {
      header: {
        cell: ResizeableTitle,
      },
    };

    _this.handleResize = function (index) {
      return function (e, _ref) {
        var size = _ref.size;

        _this.setState(function (_ref2) {
          var columns = _ref2.columns;

          var nextColumns = _toConsumableArray(columns);

          nextColumns[index] = _objectSpread(
            _objectSpread({}, nextColumns[index]),
            {},
            {
              width: size.width,
            },
          );
          return {
            columns: nextColumns,
          };
        });
      };
    };

    _this.onTableChange = function (pagination1) {
      var _this$props = _this.props,
        pagination = _this$props.pagination,
        onChange = _this$props.onChange;

      if (onChange) {
        for (
          var _len2 = arguments.length,
            rest = new Array(_len2 > 1 ? _len2 - 1 : 0),
            _key2 = 1;
          _key2 < _len2;
          _key2++
        ) {
          rest[_key2 - 1] = arguments[_key2];
        }

        onChange.apply(
          void 0,
          [_objectSpread(_objectSpread({}, pagination), pagination1)].concat(
            rest,
          ),
        );
      }
    };

    _this.onExpandedRowsChange = function (keys) {
      var onExpandedRowsChange = _this.props.onExpandedRowsChange;

      if (onExpandedRowsChange) {
        onExpandedRowsChange(keys);
      } else {
        _this.setState({
          expandedRows: keys,
        });
      }
    };

    return _this;
  }

  _createClass(BasicTable, [
    {
      key: 'componentDidMount',
      value: function componentDidMount() {
        var columnsFromProps = this.props.columns;
        this.setState({
          columns: columnsFromProps,
        });
      },
    },
    {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        this.setState({
          columns: nextProps.columns,
        });
      },
    },
    {
      key: 'render',
      value: function render() {
        var _this2 = this;

        var _this$props2 = this.props,
          noReSize = _this$props2.noReSize,
          onExpandedRowsChange = _this$props2.onExpandedRowsChange,
          expandedRowKeys = _this$props2.expandedRowKeys,
          pagination = _this$props2.pagination;
        var columnsFromState = this.state.columns;
        var columns = noReSize
          ? columnsFromState
          : columnsFromState &&
            columnsFromState.map(function (col, index) {
              return _objectSpread(
                _objectSpread({}, col),
                {},
                {
                  onHeaderCell: function onHeaderCell(column) {
                    return {
                      width: parseInt(column.width, 10) || 120,
                      onResize: _this2.handleResize(index),
                    };
                  },
                },
              );
            });
        var expandedRows = this.state.expandedRows;
        return /*#__PURE__*/ _react.default.createElement(
          _antd.ConfigProvider,
          {
            renderEmpty: function renderEmpty() {
              return /*#__PURE__*/ _react.default.createElement(
                _antd.Empty,
                null,
              );
            },
          },
          /*#__PURE__*/ _react.default.createElement(
            _antd.Table,
            _extends(
              {
                components: this.components,
              },
              this.props,
              {
                pagination: pagination,
                onChange: this.onTableChange,
                columns: columns,
                expandedRowKeys: onExpandedRowsChange
                  ? expandedRowKeys
                  : expandedRows,
                onExpandedRowsChange: this.onExpandedRowsChange,
              },
            ),
          ),
        );
      },
    },
  ]);

  return BasicTable;
})(_react.default.Component);

BasicTable.defaultProps = {
  dataSource: [],
  prefixCls: 'ant-table',
  useFixedHeader: false,
  className: '',
  size: 'default',
  loading: false,
  bordered: true,
  locale: {},
  dropdownPrefixCls: '',
  onChange: function onChange() {},
  columns: [],
};
var _default = BasicTable;
exports.default = _default;
