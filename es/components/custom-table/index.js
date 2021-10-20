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

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err);
      }
      _next(undefined);
    });
  };
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

function _slicedToArray(arr, i) {
  return (
    _arrayWithHoles(arr) ||
    _iterableToArrayLimit(arr, i) ||
    _unsupportedIterableToArray(arr, i) ||
    _nonIterableRest()
  );
}

function _nonIterableRest() {
  throw new TypeError(
    'Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
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

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}

function _iterableToArrayLimit(arr, i) {
  var _i =
    arr == null
      ? null
      : (typeof Symbol !== 'undefined' && arr[Symbol.iterator]) ||
        arr['@@iterator'];
  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i['return'] != null) _i['return']();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
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

/* eslint-disable react/sort-comp */
import React, { Component, useEffect, useMemo, useRef, useState } from 'react';
import { Popover, Checkbox, Dropdown, Menu, Tree, Button } from 'antd';
import {
  MoreOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignMiddleOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { useSelections } from 'ahooks';
import httpFetch from 'share/httpFetch';
import Table from '../table';
import config from 'config';
import SettingSvg from './images/setting';
import './style.less';
/**
 * 表格行操作菜单，鼠标移入才显示
 */

export function OperateMenus(props) {
  var _props$tableProps = props.tableProps,
    operateMenus = _props$tableProps.operateMenus,
    onEditHandle = _props$tableProps.onEditHandle,
    onCopyHandle = _props$tableProps.onCopyHandle,
    onDeleteHandle = _props$tableProps.onDeleteHandle;
  var menus = useMemo(
    function () {
      if (Array.isArray(operateMenus)) {
        return operateMenus;
      } else {
        return [
          {
            label: '编辑',
            onClick: onEditHandle,
          }, // 编辑
          {
            label: '复制',
            onClick: onCopyHandle,
          }, // 复制
          {
            label: '删除',
            onClick: onDeleteHandle,
            className: 'menu-delete',
          }, // 删除
        ];
      }
    },
    [operateMenus],
  );

  var handleMenuClick = function handleMenuClick(e) {
    e.domEvent.stopPropagation();
    var operate = menus.find(function (menu) {
      return e.key === menu.label;
    });

    if (operate === null || operate === void 0 ? void 0 : operate.onClick) {
      var record = props.record,
        index = props.index;
      operate.onClick(record, index);
    }
  };

  var overlay = /*#__PURE__*/ React.createElement(
    Menu,
    {
      onClick: handleMenuClick,
    },
    menus.map(function (menu) {
      return /*#__PURE__*/ React.createElement(
        Menu.Item,
        _extends({}, menu, {
          key: menu.label,
        }),
        menu.label,
      );
    }),
  );
  return /*#__PURE__*/ React.createElement(
    Dropdown,
    {
      overlay: overlay,
      overlayClassName: 'operate-menus-wrap',
      trigger: ['click'],
      getPopupContainer: function getPopupContainer(node) {
        return node.parentElement;
      },
    },
    /*#__PURE__*/ React.createElement(MoreOutlined, {
      onClick: function onClick(e) {
        return e.stopPropagation();
      },
    }),
  );
}
/**
 * 表头设置
 */

export function HeaderSettingsDropDown(props) {
  var _fixedColumns$left, _fixedColumns$right;

  var columns = props.columns,
    tableColumns = props.tableColumns,
    onChange = props.onChange;

  var _useState = useState({
      left: [],
      right: [],
    }),
    _useState2 = _slicedToArray(_useState, 2),
    fixedColumns = _useState2[0],
    setFixedColumns = _useState2[1]; // 获取 固定在 左边和右边的选项
  // 当 columns 改变的时候 触发这个函数

  useEffect(
    function () {
      var left = [];
      var right = [];
      columns.forEach(function (col) {
        if (col.fixed === 'left') left.push(col.dataIndex);
        else if (col.fixed === 'right') right.push(col.dataIndex);
      });
      setFixedColumns({
        left: left,
        right: right,
      });
    },
    [columns],
  ); // 获取 必选项，提前渲染出来

  var _useMemo = useMemo(
      function () {
        var required = [];
        var all = columns
          .filter(function (col) {
            return col.title;
          })
          .map(function (col) {
            if (col.requiredFlag) required.push(col.dataIndex);
            return col.dataIndex;
          });
        return {
          allCols: all,
          requiredCols: required,
        };
      },
      [columns],
    ),
    allCols = _useMemo.allCols; // 获取 选择到的 选项

  var selectedCol = useMemo(
    function () {
      return tableColumns
        .filter(function (col) {
          return col.title;
        })
        .map(function (col) {
          return col.dataIndex;
        });
    },
    [tableColumns],
  );

  var _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    popoverVisible = _useState4[0],
    setPopoverVisible = _useState4[1];

  var _useSelections = useSelections(allCols, selectedCol),
    selected = _useSelections.selected,
    isSelected = _useSelections.isSelected,
    toggle = _useSelections.toggle,
    setSelected = _useSelections.setSelected;

  var settingIconRef = useRef(); // 请求数据

  var onSave = function onSave(data) {
    var headSettingKey = props.headSettingKey,
      headerValues = props.headerValues;

    var params = _objectSpread(
      _objectSpread({}, headerValues),
      {},
      {
        settingValue: JSON.stringify(data),
        settingKey: headSettingKey,
        settingName: 'config',
        settingType: 'TABLE',
      },
    );

    httpFetch
      .post(''.concat(config.baseUrl, '/api/user/component/setting'), params)
      .then(function (res) {
        var _window, _window$g_app, _window$g_app$_store$;

        if (
          !((_window = window) === null || _window === void 0
            ? void 0
            : (_window$g_app = _window.g_app) === null ||
              _window$g_app === void 0
            ? void 0
            : _window$g_app._store)
        )
          return;
        var search =
          (_window$g_app$_store$ = window.g_app._store.getState()) === null ||
          _window$g_app$_store$ === void 0
            ? void 0
            : _window$g_app$_store$.search;

        if (search.all && search.all[headSettingKey]) {
          var _res$data, _window2, _window2$g_app;

          var tableIndex = search.all[headSettingKey].findIndex(function (
            item,
          ) {
            return item.settingType === 'TABLE';
          });
          var result =
            (_res$data = res.data) === null || _res$data === void 0
              ? void 0
              : _res$data[0];
          if (~tableIndex) search.all[headSettingKey][tableIndex] = result;
          else search.all[headSettingKey].push(result);

          var _window$g_app$_store =
              (_window2 = window) === null || _window2 === void 0
                ? void 0
                : (_window2$g_app = _window2.g_app) === null ||
                  _window2$g_app === void 0
                ? void 0
                : _window2$g_app._store,
            dispatch = _window$g_app$_store.dispatch;

          if (dispatch) {
            dispatch({
              type: 'search/saveAllSearchData',
              payload: search.all,
            });
          }
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }; // 点击 确认后，根据 left temp right 来重排 表格列的顺序

  var onOKHandle = function onOKHandle(e) {
    if (e.preventDefault) e.preventDefault(); // 重排cols顺序

    var left = [];
    var right = [];
    var temp = [];
    var getTableColumnDataIndex = props.getTableColumnDataIndex;
    var originColumns = getTableColumnDataIndex();
    columns.forEach(function (col) {
      if (col.fixed === 'left') left.push(col);
      else if (col.fixed === 'right') right.push(col);
      else {
        var index = originColumns.findIndex(function (dataIndex) {
          return dataIndex === col.dataIndex;
        });
        temp[index] = col;
      } // else temp.push(col);
    });
    temp = temp.filter(function (col) {
      return col;
    });
    var final = left.concat(temp).concat(right); // 滤出勾选的数据

    var result = final.filter(function (col) {
      var bool = col.requiredFlag || selected.includes(col.dataIndex);

      if (bool) {
        col.isSelected = true;
      }

      return bool;
    });
    onSave(final);

    if (onChange) {
      onChange(final, result);
    }

    onVisibleTurnFalse(); // onClose();
  }; // 重置 表格列

  var onResetHandle = function onResetHandle(e) {
    if (e.preventDefault) e.preventDefault();
    setSelected(allCols);
    setFixedColumns({
      left: [],
      right: [],
    });
    var onReset = props.onReset;
    onReset();
  }; // 点击 icon 图标后 ，关闭气泡窗
  // const onClose = () => {
  //   settingIconRef.current.click();
  // }
  // 控制 气泡窗 是否可见

  var onVisibleChange = function onVisibleChange(visible) {
    setPopoverVisible(visible);

    if (visible) {
      setSelected(selectedCol);
    }
  }; // 手动 控制 气泡窗的显示

  var onVisibleTurnFalse = function onVisibleTurnFalse() {
    setPopoverVisible(false);
  }; // 阻止冒泡

  var onStopClick = function onStopClick(e) {
    e.stopPropagation();
  }; // 记录了 修改后的数组

  var arrayMove = function arrayMove(arr, from, to) {
    var newArr = arr.slice();
    var startIndex = to < 0 ? newArr.length + to : to;
    var item = newArr.splice(from, 1)[0];
    newArr.splice(startIndex, 0, item);
    return newArr;
  }; // 排序后 重置表格列

  var handleResetColsAfterSort = function handleResetColsAfterSort(info) {
    var _info$dragNode$pos$sp = info.dragNode.pos.split('-'),
      _info$dragNode$pos$sp2 = _slicedToArray(_info$dragNode$pos$sp, 2),
      oldIndex = _info$dragNode$pos$sp2[1];

    var _info$node$pos$split = info.node.pos.split('-'),
      _info$node$pos$split2 = _slicedToArray(_info$node$pos$split, 2),
      newIndex = _info$node$pos$split2[1];

    var dropPos = info.node.pos.split('-');
    var dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    if (oldIndex > newIndex && dropPosition >= 0) {
      newIndex = Number(newIndex) + 1;
    }

    var temp = arrayMove(columns, Number(oldIndex), Number(newIndex));

    if (onChange) {
      onChange(temp, temp);
    }
  }; // 格式化 处理表格列

  var formatColumns = function formatColumns() {
    var temp = columns.filter(function (col) {
      return !col.fixed;
    });
    var originColumns = props.getTableColumnDataIndex();
    var treeNodes = [];
    temp.forEach(function (col) {
      var index = originColumns.findIndex(function (dataIndex) {
        return dataIndex === col.dataIndex;
      });
      col.key = col.dataIndex;
      treeNodes[index] = col;
    });
    return treeNodes.filter(function (col) {
      return col;
    });
  }; // 固定 表格列中 选中的选项

  var handleFixColumn = function handleFixColumn(item, type) {
    var _setFixedColumns;

    // 借用引用数据类型特性
    var anotherType = type === 'left' ? 'right' : 'left';
    item.fixed = type;
    item.ellipsis = true;

    if (Array.isArray(fixedColumns[type])) {
      fixedColumns[type].push(item.dataIndex);
    } else fixedColumns[type] = [item.dataIndex];

    var index = fixedColumns[anotherType].findIndex(function (col) {
      return col === item.dataIndex;
    });

    if (~index) {
      fixedColumns[anotherType].splice(index, 1);
    }

    setFixedColumns(
      ((_setFixedColumns = {}),
      _defineProperty(_setFixedColumns, type, fixedColumns[type]),
      _defineProperty(_setFixedColumns, anotherType, fixedColumns[anotherType]),
      _setFixedColumns),
    );
  }; // 取消 表格列中 被固定的选项

  var handleCancelFix = function handleCancelFix(col, type) {
    var index = fixedColumns[type].findIndex(function (item) {
      return item === col.dataIndex;
    });
    if (~index) fixedColumns[type].splice(index, 1);
    col.fixed = '';
    col.ellipsis = false;
    setFixedColumns(
      _objectSpread(
        _objectSpread({}, fixedColumns),
        {},
        _defineProperty({}, type, fixedColumns[type]),
      ),
    );
  }; // 渲染 进行列控制的节点树上的 节点

  var renderTreeNode = function renderTreeNode(item) {
    return /*#__PURE__*/ React.createElement(
      'div',
      {
        key: item.dataIndex,
        className: 'checkbox-item',
      },
      item.requiredFlag
        ? /*#__PURE__*/
          // 必须要勾选的列
          React.createElement(
            Checkbox,
            {
              disabled: true,
              checked: true,
            },
            item.title,
          )
        : /*#__PURE__*/ React.createElement(
            Checkbox,
            {
              checked: isSelected(item.dataIndex),
              onClick: function onClick() {
                return toggle(item.dataIndex);
              },
            },
            item.title,
          ),
      /*#__PURE__*/ React.createElement(
        'span',
        {
          className: 'fixed-col-ico-group',
        },
        item.fixed === 'left'
          ? /*#__PURE__*/ React.createElement(VerticalAlignMiddleOutlined, {
              title: '\u53D6\u6D88\u56FA\u5B9A',
              onClick: function onClick() {
                handleCancelFix(item, 'left');
              },
            })
          : /*#__PURE__*/ React.createElement(VerticalAlignTopOutlined, {
              title: '\u5DE6\u56FA\u5B9A',
              onClick: function onClick() {
                handleFixColumn(item, 'left');
              },
            }),
        item.fixed === 'right'
          ? /*#__PURE__*/ React.createElement(VerticalAlignMiddleOutlined, {
              title: '\u53D6\u6D88\u56FA\u5B9A',
              onClick: function onClick() {
                handleCancelFix(item, 'right');
              },
            })
          : /*#__PURE__*/ React.createElement(VerticalAlignBottomOutlined, {
              title: '\u53F3\u56FA\u5B9A',
              onClick: function onClick() {
                handleFixColumn(item, 'right');
              },
            }),
      ),
    );
  }; // 根据固定左右的类型 渲染 列控制节点树上的分组

  var renderFixedColsByType = function renderFixedColsByType(type) {
    var fixed = columns.filter(function (col) {
      return col.fixed === type;
    });
    var text = type === 'left' ? '固定在左侧' : '固定在右侧';

    if (fixed.length) {
      return /*#__PURE__*/ React.createElement(
        React.Fragment,
        null,
        /*#__PURE__*/ React.createElement(
          'div',
          {
            className: 'col-group-title',
          },
          text,
        ),
        fixed.map(function (leftCol) {
          return renderTreeNode(leftCol);
        }),
      );
    }
  }; // 渲染 列控制节点树

  var content = /*#__PURE__*/ React.createElement(
    'div',
    {
      onClick: onStopClick,
      style: {
        maxHeight: 250,
        display: 'flex',
        flexDirection: 'column',
      },
    },
    /*#__PURE__*/ React.createElement(
      'div',
      {
        className: 'checkbox-wrap',
        style: {
          borderBottom: '1px solid #f0f0f0',
          overflow: 'auto',
          maxHeight: 200,
        },
      },
      renderFixedColsByType('left'),
      !!(
        (fixedColumns === null || fixedColumns === void 0
          ? void 0
          : (_fixedColumns$left = fixedColumns.left) === null ||
            _fixedColumns$left === void 0
          ? void 0
          : _fixedColumns$left.length) ||
        (fixedColumns === null || fixedColumns === void 0
          ? void 0
          : (_fixedColumns$right = fixedColumns.right) === null ||
            _fixedColumns$right === void 0
          ? void 0
          : _fixedColumns$right.length)
      ) &&
        /*#__PURE__*/ React.createElement(
          'div',
          {
            className: 'col-group-title',
          },
          '\u4E0D\u56FA\u5B9A',
        ),
      /*#__PURE__*/ React.createElement(Tree, {
        className: 'draggable-tree',
        draggable: true,
        blockNode: true,
        selectable: false,
        treeData: formatColumns(),
        titleRender: renderTreeNode,
        onDrop: handleResetColsAfterSort,
        style: {
          padding: '4px 0px 12px',
        },
      }),
      renderFixedColsByType('right'),
    ),
    /*#__PURE__*/ React.createElement(
      'div',
      {
        className: 'table-header-footer',
        style: {
          overflow: 'hidden',
          padding: '12px 16px',
        },
      },
      /*#__PURE__*/ React.createElement(
        'div',
        {
          style: {
            float: 'right',
          },
        },
        /*#__PURE__*/ React.createElement(
          Button,
          {
            size: 'small',
            onClick: onResetHandle,
          },
          '\u91CD\u7F6E',
        ),
        /*#__PURE__*/ React.createElement(
          Button,
          {
            size: 'small',
            type: 'primary',
            style: {
              marginLeft: 8,
            },
            onClick: onOKHandle,
          },
          '\u786E\u5B9A',
        ),
      ),
    ),
  );
  return /*#__PURE__*/ React.createElement(
    Popover,
    {
      overlayClassName: 'table-header-settings',
      title: /*#__PURE__*/ React.createElement(
        'div',
        {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 14,
            padding: '7px 0px 8px',
          },
        },
        /*#__PURE__*/ React.createElement(
          'span',
          {
            style: {
              fontWeight: 600,
            },
          },
          '\u8868\u5934\u96C6\u4E2D\u5C55\u793A\u8BBE\u7F6E',
        ),
        /*#__PURE__*/ React.createElement(CloseOutlined, {
          style: {
            fontSize: 12,
            color: '#7A828D',
          },
          onClick: onVisibleTurnFalse,
        }),
      ),
      content: content,
      trigger: ['click'],
      placement: 'bottomRight',
      onVisibleChange: onVisibleChange,
      visible: popoverVisible,
    },
    /*#__PURE__*/ React.createElement(SettingSvg, {
      onClick: onStopClick,
      className: 'setting-icon hover-theme-color',
      title: '\u8BBE\u7F6E',
      ref: settingIconRef,
    }),
  );
}

var CustomTable = /*#__PURE__*/ (function (_Component) {
  _inherits(CustomTable, _Component);

  var _super = _createSuper(CustomTable);

  function CustomTable(_props) {
    var _this;

    _classCallCheck(this, CustomTable);

    _this = _super.call(this, _props);

    _this.getTableColumnsFromBackend = function (props) {
      var _ref = props || _this.props,
        headSettingKey = _ref.headSettingKey,
        columns = _ref.columns;

      return new Promise(function (resolve) {
        if (headSettingKey) {
          var _window3, _window3$g_app, _window$g_app$_store$2;

          if (
            !((_window3 = window) === null || _window3 === void 0
              ? void 0
              : (_window3$g_app = _window3.g_app) === null ||
                _window3$g_app === void 0
              ? void 0
              : _window3$g_app._store)
          ) {
            resolve({
              columns: columns,
              isDefault: true,
            });
            return;
          }

          var search =
            (_window$g_app$_store$2 = window.g_app._store.getState()) ===
              null || _window$g_app$_store$2 === void 0
              ? void 0
              : _window$g_app$_store$2.search;

          if (search.all && search.all[headSettingKey]) {
            var tableConfig = search.all[headSettingKey].find(function (item) {
              return item.settingType === 'TABLE';
            });

            if (tableConfig) {
              var flag = Array.isArray(tableConfig) && tableConfig.length;
              resolve({
                columns: flag ? tableConfig : columns,
                isDefault: !flag,
              });
              return;
            }
          }

          httpFetch
            .get(
              ''
                .concat(config.baseUrl, '/api/user/component/setting/list?key=')
                .concat(headSettingKey, '&type=TABLE'),
            )
            .then(function (res) {
              if (Array.isArray(res.data)) {
                var _flag = Array.isArray(res.data) && res.data[0];

                resolve({
                  columns: _flag ? res.data[0] : columns,
                  isDefault: !_flag,
                });
              } else {
                resolve({
                  columns: columns,
                  isDefault: true,
                });
              }
            })
            .catch(function (err) {
              console.log(err);
              resolve({
                columns: columns,
                isDefault: true,
              });
            });
        } else {
          resolve(columns);
        }
      });
    };

    _this.getTableColumns = function (columns, nextProps, reset) {
      var showNumber = nextProps.showNumber,
        headSettingKey = nextProps.headSettingKey,
        operateMenus = nextProps.operateMenus;
      var sortColumn = _this.state.sortColumn;
      (columns || []).forEach(function (items) {
        var item = items;

        if (item.tooltips) {
          item.render = function (value) {
            return /*#__PURE__*/ React.createElement(
              Popover,
              {
                content: value,
                getPopupContainer: function getPopupContainer(node) {
                  return node.parentNode;
                },
                overlayStyle: {
                  maxWidth: 500,
                  wordWrap: 'break-word',
                },
              },
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'over-range',
                },
                value,
              ),
            );
          };
        } else if (item.fixed) {
          item.ellipsis = true;

          if (item.render) {
            var tempRender = item.render;

            item.render = function (values, record, index) {
              return /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'over-range',
                },
                tempRender(values, record, index),
              );
            };
          } else {
            item.render = function (values) {
              return /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'over-range',
                },
                values,
              );
            };
          }
        }

        if (item.key && !item.dataIndex) {
          item.dataIndex = item.key;
        }

        if (item.align !== 'right') {
          item.align = 'left';
        }
      });

      var tableColumns = _toConsumableArray(columns);

      if (showNumber) {
        tableColumns = [sortColumn].concat(_toConsumableArray(columns));
      }

      if (operateMenus) {
        // 操作列下拉菜单
        var fixed = tableColumns.find(function (col) {
          return col.fixed === 'left';
        })
          ? 'left'
          : undefined;
        tableColumns = [
          {
            dataIndex: 'operate-menus',
            className: 'operate-menus',
            requiredFlag: true,
            fixed: fixed,
            ellipsis: !!fixed,
            render: function render(value, record, index) {
              return /*#__PURE__*/ React.createElement(OperateMenus, {
                tableProps: _this.props,
                record: record,
                index: index,
              });
            },
          },
        ].concat(_toConsumableArray(tableColumns));
      }

      if (reset) {
        tableColumns.forEach(function (item) {
          if (item.fixed !== item.originFixed) {
            item.fixed = undefined;
          }
        });

        _this.setState({
          tableColumns: tableColumns,
          allColumns: _toConsumableArray(columns),
        });

        return;
      }

      _this.setState({
        tableColumns: tableColumns,
      });

      if (headSettingKey) {
        // 显示标题设置
        _this.getHeaderSettings(tableColumns, nextProps);
      }
    };

    _this.getTableColumnDataIndex = function () {
      var _this$props = _this.props,
        columns = _this$props.columns,
        showNumber = _this$props.showNumber,
        operateMenus = _this$props.operateMenus;
      var sortColumn = _this.state.sortColumn;

      var tempColumns = _toConsumableArray(columns);

      if (showNumber) {
        tempColumns = [sortColumn].concat(_toConsumableArray(columns));
      }

      tempColumns = tempColumns.map(function (col) {
        return col.dataIndex;
      });
      if (operateMenus) tempColumns.unshift('operate-menus');
      return tempColumns;
    };

    _this.getHeaderSettings = /*#__PURE__*/ (function () {
      var _ref2 = _asyncToGenerator(
        /*#__PURE__*/ regeneratorRuntime.mark(function _callee(
          allColumns,
          props,
        ) {
          var _yield$_this$getTable,
            data,
            isDefault,
            target,
            currentColumns,
            newAllColumns;

          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch ((_context.prev = _context.next)) {
                case 0:
                  _context.next = 2;
                  return _this.getTableColumnsFromBackend(props);

                case 2:
                  _yield$_this$getTable = _context.sent;
                  data = _yield$_this$getTable.columns;
                  isDefault = _yield$_this$getTable.isDefault;
                  target = data.settingValue
                    ? JSON.parse(data.settingValue)
                    : data;
                  if (data.settingValue) _this.headerValues = data;
                  currentColumns = [];
                  newAllColumns = [];
                  target.forEach(function (item) {
                    var column = allColumns.find(function (col) {
                      return col.dataIndex === item.dataIndex;
                    });
                    if (column && item.isSelected)
                      currentColumns.push(
                        _objectSpread(
                          _objectSpread({}, column),
                          {},
                          {
                            fixed: item.fixed || column.fixed,
                            ellipsis: !!(item.fixed || column.fixed),
                          },
                        ),
                      );
                    newAllColumns.push(
                      _objectSpread(
                        _objectSpread({}, column),
                        {},
                        {
                          fixed: item.fixed || column.fixed,
                          ellipsis: !!(item.fixed || column.fixed),
                        },
                      ),
                    );
                  });

                  _this.setState({
                    allColumns: newAllColumns,
                    tableColumns: isDefault ? allColumns : currentColumns,
                  });

                case 11:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee);
        }),
      );

      return function (_x, _x2) {
        return _ref2.apply(this, arguments);
      };
    })();

    _this.handleResetCols = function () {
      var columns = _this.props.columns;

      _this.getTableColumns(columns, _this.props, true);
    };

    _this.setHeaderSettings = function () {
      var _this$state = _this.state,
        allColumns = _this$state.allColumns,
        tableColumns = _this$state.tableColumns;
      var headSettingKey = _this.props.headSettingKey;

      if (headSettingKey) {
        return /*#__PURE__*/ React.createElement(
          'div',
          {
            style: {
              position: 'absolute',
              top: 0,
              right: 0,
              background: '#f7f8fa',
              padding: '15px 12px 9px',
              zIndex: 900,
            },
          },
          /*#__PURE__*/ React.createElement(
            HeaderSettingsDropDown,
            _extends({}, _this.props, {
              columns: allColumns || [],
              tableColumns: tableColumns,
              onChange: function onChange(cols, results) {
                _this.setState({
                  allColumns: _toConsumableArray(cols),
                  tableColumns: _toConsumableArray(results),
                });
              },
              headerValues: _this.headerValues,
              onReset: _this.handleResetCols,
              getTableColumnDataIndex: _this.getTableColumnDataIndex,
            }),
          ),
        );
      }
    };

    _this.getSelectedKeys = function (callback) {
      var rowSelection = _this.state.rowSelection;

      if (callback) {
        callback(rowSelection.selectedRowKeys);
      } else {
        return rowSelection.selectedRowKeys;
      }
    };

    _this.searchAfterDelete = function (params, bodyParams) {
      var pagination = _this.state.pagination;
      var total = pagination.total - 1;

      if (total % pagination.pageSize === 0 && pagination.current !== 1) {
        pagination.current =
          pagination.current === 1
            ? pagination.current
            : pagination.current - 1;
      }

      _this.setState(
        {
          pagination: _objectSpread({}, pagination),
          params: params,
          bodyParams: bodyParams,
        },
        _this.getList,
      );
    };

    _this.search = function (params) {
      var flag =
        arguments.length > 1 && arguments[1] !== undefined
          ? arguments[1]
          : false;
      var bodyParams = arguments.length > 2 ? arguments[2] : undefined;
      var pagination = _this.state.pagination;
      pagination.current = flag ? pagination.current : 1;

      if (params === null || params === void 0 ? void 0 : params.lastPage) {
        // 使用lastPage用以区分正常逻辑中传入的page,size和缓存的页码
        pagination.current = params.lastPage;
      }

      if (params === null || params === void 0 ? void 0 : params.lastSize) {
        pagination.pageSize = params.lastSize;
      }

      _this.setState(
        {
          pagination: _objectSpread({}, pagination),
          params: params,
          bodyParams: bodyParams,
        },
        _this.getList,
      );
    };

    _this.reload = function () {
      var pagination = _this.state.pagination;

      _this.setState(
        {
          pagination: _objectSpread(
            _objectSpread({}, pagination),
            {},
            {
              current: 1,
            },
          ),
          params: {},
          selectedRowKeys: [],
          selectedRows: [],
        },
        _this.getList,
      );
    };

    _this.getList = function (url) {
      var _this$props2 = _this.props,
        urlFromProps = _this$props2.url,
        _this$props2$paramAsB = _this$props2.paramAsBody,
        paramAsBody =
          _this$props2$paramAsB === void 0 ? true : _this$props2$paramAsB;
      if (!urlFromProps) return;
      var _this$props3 = _this.props,
        notStartFromZero = _this$props3.notStartFromZero,
        filterData = _this$props3.filterData,
        onLoadData = _this$props3.onLoadData,
        paramsFromProps = _this$props3.params; // page从1开始分页

      _this.setState({
        loading: true,
      });

      var _this$state2 = _this.state,
        params = _this$state2.params,
        statePagination = _this$state2.pagination,
        _this$state2$paginati = _this$state2.pagination,
        current = _this$state2$paginati.current,
        pageSize = _this$state2$paginati.pageSize,
        sorters = _this$state2.sorters,
        body = _this$state2.bodyParams;
      var requestBody = [];

      var searchParams = _objectSpread(
        _objectSpread(
          {
            page: notStartFromZero ? current : current - 1,
            size: pageSize,
          },
          paramsFromProps,
        ),
        {},
        {
          sort: sorters,
        },
        params,
      );

      var _this$props4 = _this.props,
        methodType = _this$props4.methodType,
        dataKey = _this$props4.dataKey,
        getAmountInfo = _this$props4.getAmountInfo,
        bodyParams = _this$props4.bodyParams;
      var urlTemp = url || urlFromProps; // 增加数组对象判断

      if (bodyParams && Array.isArray(bodyParams) && bodyParams.length !== 0) {
        requestBody = methodType === 'post' ? bodyParams : searchParams;
      } else {
        requestBody =
          methodType === 'post'
            ? _objectSpread(
                _objectSpread(_objectSpread({}, bodyParams), body),
                paramAsBody ? searchParams : {},
              )
            : searchParams;
      }

      httpFetch[methodType || 'get'](
        urlTemp,
        requestBody,
        null,
        null,
        searchParams,
      )
        .then(function (res) {
          var pagination = _objectSpread(
            _objectSpread({}, statePagination),
            {},
            {
              total: Number(res.headers['x-total-count']) || 0,
            },
          );

          var data = dataKey
            ? typeof dataKey === 'string '
              ? res.data[dataKey]
              : res.data.dataKey
            : res.data;

          if (filterData) {
            data = filterData(data);
          }

          if (getAmountInfo) {
            getAmountInfo(res.headers['amount-info']);
          }

          _this.setState(
            {
              dataSource: data,
              loading: false,
              pagination: pagination,
            },
            function () {
              if (onLoadData) {
                onLoadData(res.data, pagination);
              }
            },
          );
        })
        .catch(function (err) {
          console.error(err);
        });
    };

    _this.tableChange = function (pagination, filters, sorter) {
      var sorters;

      if (sorter.field && sorter.order) {
        sorters = ''
          .concat(sorter.field)
          .concat(sorter.order === 'ascend' ? '' : ',desc');
      }

      var paginationFromState = _this.state.pagination;

      _this.setState(
        {
          sorters: sorters,
          pagination: _objectSpread(
            _objectSpread({}, paginationFromState),
            pagination,
          ),
        },
        function () {
          _this.getList();

          _this.pageCaching(pagination);
        },
      );
    };

    _this.pageCaching = function (pagination) {
      var _window4, _window4$g_app, _getState, _getState$search;

      if (
        !((_window4 = window) === null || _window4 === void 0
          ? void 0
          : (_window4$g_app = _window4.g_app) === null ||
            _window4$g_app === void 0
          ? void 0
          : _window4$g_app._store)
      )
        return;
      var current = pagination.current,
        pageSize = pagination.pageSize;
      var _window$g_app$_store2 = window.g_app._store,
        dispatch = _window$g_app$_store2.dispatch,
        getState = _window$g_app$_store2.getState;
      var searchCodeKey = _this.props.searchCodeKey;
      var searchData =
        ((_getState = getState()) === null || _getState === void 0
          ? void 0
          : (_getState$search = _getState.search) === null ||
            _getState$search === void 0
          ? void 0
          : _getState$search.data) || {};
      dispatch({
        type: 'search/addSearchData',
        payload: _defineProperty(
          {},
          searchCodeKey,
          _objectSpread(
            _objectSpread({}, searchData[searchCodeKey]),
            {},
            {
              lastPage: current,
              lastSize: pageSize,
            },
          ),
        ),
      });
    };

    _this.onSelect = function (record) {
      var _this$state3 = _this.state,
        selectedRows = _this$state3.selectedRows,
        selectedRowKeys = _this$state3.selectedRowKeys;
      var _this$props5 = _this.props,
        single = _this$props5.single,
        _this$props5$tableKey = _this$props5.tableKey,
        tableKey =
          _this$props5$tableKey === void 0 ? 'id' : _this$props5$tableKey,
        onSelectChange = _this$props5.onSelectChange; // 单选

      if (single) {
        _this.setState({
          selectedRows: [record],
          selectedRowKeys: [record[tableKey]],
        });
      } else {
        var index = selectedRowKeys.indexOf(record[tableKey]);

        if (index >= 0) {
          selectedRows.splice(index, 1);
          selectedRowKeys.splice(index, 1);
        } else {
          selectedRows.push(record);
          selectedRowKeys.push(record[tableKey]);
        }

        _this.setState({
          selectedRows: selectedRows,
          selectedRowKeys: _toConsumableArray(selectedRowKeys),
        });
      }

      if (onSelectChange) {
        if (single) {
          onSelectChange(record.id, record);
        } else {
          onSelectChange(
            _toConsumableArray(selectedRowKeys),
            _toConsumableArray(selectedRows),
          );
        }
      }
    };

    _this.onSelectAll = function (selected) {
      var _this$state4 = _this.state,
        dataSource = _this$state4.dataSource,
        selectedRowKeys = _this$state4.selectedRowKeys,
        selectedRows = _this$state4.selectedRows;
      var _this$props6 = _this.props,
        _this$props6$tableKey = _this$props6.tableKey,
        tableKey =
          _this$props6$tableKey === void 0 ? 'id' : _this$props6$tableKey,
        onSelectChange = _this$props6.onSelectChange;

      if (selected) {
        dataSource.forEach(function (o) {
          if (selectedRowKeys.indexOf(o[tableKey]) < 0) {
            selectedRowKeys.push(o[tableKey]);
            selectedRows.push(o);
          }
        });
      } else {
        dataSource.forEach(function (o) {
          var index = selectedRows.findIndex(function (item) {
            return item[tableKey] === o[tableKey];
          });
          selectedRowKeys.splice(index, 1);
          selectedRows.splice(index, 1);
        });
      }

      _this.setState({
        selectedRowKeys: _toConsumableArray(selectedRowKeys),
        selectedRows: selectedRows,
      });

      if (onSelectChange) {
        onSelectChange(
          _toConsumableArray(selectedRowKeys),
          _toConsumableArray(selectedRows),
        );
      }
    };

    _this.onClearSelectedRowKeys = function () {
      _this.setState({
        selectedRowKeys: [],
        selectedRows: [],
      });
    };

    _this.getValue = function (data, key) {
      var result = JSON.stringify(data); // eslint-disable-next-line no-new-func

      return new Function(
        'try {return '.concat(result, '.').concat(key, ' } catch(e) {}'),
      )();
    };

    _this.state = {
      dataSource: [],
      tableColumns: [],
      pagination: _objectSpread(
        {
          total: 0,
          showTotal: function showTotal(total, range) {
            return '\u663E\u793A'
              .concat(range[0], '-')
              .concat(range[1], ' \u5171')
              .concat(total, '\u6761');
          },
          showSizeChanger: true,
          showQuickJumper: true,
          pageSize: _props.pagination ? _props.pagination.pageSize || 10 : 10,
          current: 1,
          pageSizeOptions: _this.$pageSizeOptions,
        },
        _props.pagination,
      ),
      frontPagination: {
        total: 0,
        showTotal: function showTotal(total, range) {
          return '\u663E\u793A'
            .concat(range[0], '-')
            .concat(range[1], ' \u5171')
            .concat(total, '\u6761');
        },
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['5', '10', '20', '30', '40'],
      },
      loading: false,
      params: {},
      sortColumn: {
        title: '序号',
        dataIndex: 'sort',
        width: 90,
        align: 'left',
        render: function render(value, record, index) {
          var _this$state$paginatio = _this.state.pagination,
            current = _this$state$paginatio.current,
            pageSize = _this$state$paginatio.pageSize;
          return /*#__PURE__*/ React.createElement(
            'span',
            null,
            (current - 1) * pageSize + index + 1,
          );
        },
      },
      sorters: undefined,
      bodyParams: {},
      selectedRowKeys: [],
      selectedRows: [],
    };
    _this.headerValues = {};
    return _this;
  }

  _createClass(CustomTable, [
    {
      key: 'componentDidMount',
      value: function componentDidMount() {
        var _this2 = this;

        var _this$props7 = this.props,
          columns = _this$props7.columns,
          _this$props7$params = _this$props7.params,
          params = _this$props7$params === void 0 ? {} : _this$props7$params;
        columns.forEach(function (item) {
          if (item.fixed) {
            item.originFixed = item.fixed;
          } else {
            item.originFixed = undefined;
          }
        });
        this.getTableColumns(columns, this.props);
        this.setState(
          {
            params: params,
          },
          function () {
            var _this2$props$defaultG = _this2.props.defaultGetList,
              defaultGetList =
                _this2$props$defaultG === void 0 ? true : _this2$props$defaultG;

            if (defaultGetList) {
              _this2.getList();
            }
          },
        );
      },
    },
    {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        var _this$props8 = this.props,
          url = _this$props8.url,
          columns = _this$props8.columns,
          refreshColumns = _this$props8.refreshColumns;

        if (nextProps.url !== url) {
          this.getList(nextProps.url);
        } // 表格列有变动时

        if (
          nextProps.columns !== columns ||
          nextProps.columns.length !== columns.length ||
          nextProps.refreshColumns !== refreshColumns
        ) {
          nextProps.columns.forEach(function (item) {
            if (item.fixed) {
              item.originFixed = item.fixed;
            } else {
              item.originFixed = undefined;
            }
          });
          this.getTableColumns(nextProps.columns, nextProps);
        }
      }, // 从 后端 获取 表格列
    },
    {
      key: 'getDataLabel',
      value: function getDataLabel(data, keys) {
        var _this3 = this;

        var isMatch = false;
        keys = keys.replace(/\$\{(.*?)\}/g, function (target, value) {
          isMatch = true;
          return _this3.getValue(data, value) || '';
        });

        if (isMatch) {
          return keys;
        } else {
          return this.getValue(data, keys) || '';
        }
      },
    },
    {
      key: 'render',
      value: function render() {
        var _this4 = this;

        var _this$state5 = this.state,
          dataSource = _this$state5.dataSource,
          pagination = _this$state5.pagination,
          loading = _this$state5.loading,
          tableColumns = _this$state5.tableColumns,
          selectedRowKeys = _this$state5.selectedRowKeys,
          frontPagination = _this$state5.frontPagination;
        var _this$props9 = this.props,
          _onClick = _this$props9.onClick,
          tableKey = _this$props9.tableKey,
          tableSize = _this$props9.tableSize,
          allowChecked = _this$props9.allowChecked,
          rowSelection = _this$props9.rowSelection,
          scrollXWidth = _this$props9.scrollXWidth,
          _onRow = _this$props9.onRow,
          single = _this$props9.single,
          isFrontPage = _this$props9.isFrontPage,
          headSettingKey = _this$props9.headSettingKey;

        var customSelection = _objectSpread(
          _objectSpread({}, rowSelection),
          {},
          {
            type: single ? 'radio' : 'checkbox',
            selectedRowKeys: selectedRowKeys,
            onSelect: this.onSelect,
            onSelectAll: this.onSelectAll,
          },
        );

        return /*#__PURE__*/ React.createElement(
          'div',
          {
            style: {
              position: 'relative',
            },
            className: 'custom-table',
          },
          /*#__PURE__*/ React.createElement(
            Table,
            _extends(
              {
                tableLayout: 'fixed',
                rowKey: function rowKey(record) {
                  return _this4.getDataLabel(record, tableKey || 'id');
                },
                scroll: {
                  x: scrollXWidth || 1000,
                },
              },
              this.props,
              {
                rowSelection: allowChecked ? customSelection : rowSelection,
                loading: loading,
                dataSource: dataSource,
                columns: tableColumns || [],
                pagination: isFrontPage
                  ? frontPagination
                  : pagination.total
                  ? pagination
                  : false,
                size: tableSize || 'middle',
                bordered: !headSettingKey,
                onChange: this.tableChange,
                onRow: function onRow(record) {
                  return _objectSpread(
                    _objectSpread(
                      {},
                      typeof _onRow === 'function' ? _onRow(record) : {},
                    ),
                    {},
                    {
                      onClick: function onClick() {
                        if (_onClick) {
                          _onClick(record);
                        }
                      },
                    },
                  );
                },
              },
            ),
          ),
          this.setHeaderSettings(),
        );
      },
    },
  ]);

  return CustomTable;
})(Component);

export default CustomTable;
