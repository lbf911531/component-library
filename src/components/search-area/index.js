/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';

import moment from 'moment';
import { debounce } from 'lodash';
import httpFetch from 'share/httpFetch';

import {
  CheckOutlined,
  CloseOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons';
import {
  Row,
  Col,
  Popconfirm,
  Input,
  Button,
  DatePicker,
  Radio,
  Checkbox,
  Select,
  Switch,
  Cascader,
  Tooltip,
  TreeSelect,
  message,
  Spin,
  Form,
} from 'antd';
import Lov from '../lov';
import SelectPartLoad from '../select-part-load';
import InputNumber from '../input-number';
import LanguageInput from '../input-language';
import { messages } from '../utils';
import WrappedForm from '../wrapped-form';
import LocaleContext from '../locale-lan-provider/context';
import './style.less';

const { Option } = Select;
const { MonthPicker, RangePicker } = DatePicker;

let unique = new Date().getTime();
let needBlurValidate = true; // 是否需要在blur时校验，点击搜索、清空的同时不要校验
/**
 * 搜索区域组件
 * @params searchForm   渲染表单所需要的配置项，见底端注释
 * @params submitHandle  点击搜索时的回调
 * @params clearHandle  点击重置时的回调
 * @params eventHandle  表单项onChange事件，于searchForm内的event有联动，见底端注释
 * @params okText  搜索按钮的文字
 * @params clearText  重置按钮的文字
 * @params defaultLength  最大项数，如果超过则隐藏支展开菜单中
 * @params loading  搜索按钮的loading状态
 * TODO: 选项render函数、searchUrl和getUrl的method区分
 */
class SearchArea extends React.Component {
  formRef = null;
  static contextType = LocaleContext;
  constructor(props) {
    super(props);
    unique = new Date().getTime();
    this.state = {
      expand: props.searchForm.expand,
      searchForm: [],
      searchCodeKey: '',
      isopen: false,
      amountRangeField: {},
      dateRangeField: {},
      numberField: {},
      time: null,
    };
    //  防抖函数   三个参数
    // leading，函数在每个等待时延的开始被调用，默认值为false
    // trailing，函数在每个等待时延的结束被调用，默认值是true
    // maxwait，最大的等待时间，因为如果debounce的函数调用时间不满足条件，可能永远都无法触发，因此增加了这个配置，保证大于一段时间后一定能执行一次函数
    this.setOptionsToFormItem = debounce(this.setOptionsToFormItem, 250);
    this.cacheLock = false;
  }

  componentWillMount() {
    const { searchCodeKey = '' } = this.props;
    this.setState({ searchCodeKey });
  }

  componentDidMount() {
    const searchData =
      window.g_app && window.g_app._store && window.g_app._store.getState
        ? window.g_app._store.getState().search.data
        : {};

    const { searchForm, isNeedSearched, onRef } = this.props;
    const newSearchForm = [];
    const { searchCodeKey, expand } = this.state;

    const { defaultSearchValue, expand: tempExpend } = searchCodeKey
      ? searchData[searchCodeKey] || {}
      : {};
    const defaultFlag =
      defaultSearchValue && !!Object.keys(defaultSearchValue).length;
    const initValueToRedux = {};

    this.setState({
      expand: [true, false].includes(tempExpend) ? tempExpend : expand,
    });
    searchForm.forEach((items) => {
      const item = items;
      if (
        item.type === 'select' &&
        item.options.length === 0 &&
        item.defaultValue &&
        item.defaultValue.key
      ) {
        item.options = [];
      }

      if (searchCodeKey && item.defaultValue) {
        initValueToRedux[item.id] = item.defaultValue;
      }
      if (defaultFlag) {
        const cacheValue = defaultSearchValue[item.id];
        if (item.type === 'items') {
          item.items.forEach((ops) => {
            const op = ops;
            if (defaultSearchValue[op.id]) {
              op.defaultValue = defaultSearchValue[op.id];
            }
          });
        } else if (
          (item.type === 'select' || item.type === 'value_list') &&
          !!cacheValue
        ) {
          item.defaultValue = item.entity
            ? cacheValue
            : String(
                [true, false].includes(cacheValue.key)
                  ? cacheValue.key
                  : cacheValue.key || '',
              ) || cacheValue;
          if (item.options.length === 0 && cacheValue.key) {
            item.options = [
              {
                label: cacheValue.label,
                value: cacheValue.key,
                temp: true,
              },
            ];
          }
        } else if (cacheValue) {
          item.defaultValue = cacheValue;
        }
      }
      if (item.items) {
        this.setValidateField(item);
        newSearchForm.push(...item.items);
      } else {
        newSearchForm.push(item);
      }
    });
    this.setState(
      {
        searchForm: newSearchForm,
      },
      () => {
        if (searchCodeKey) {
          const { dispatch } = window.g_app._store;
          // 留存一次最初的初始值，以便清空搜索区时能够还原
          dispatch({
            type: 'search/setInitSearchData',
            payload: { [`init-${searchCodeKey}`]: initValueToRedux },
          });
          // 当存在必填项搜索但此项缓存没有值的情况，不能执行搜索
          // 即每一项都“不是必填项或其缓存有值”的情况下，才执行搜索
          const searchRequired = searchForm.every((item) => {
            return (
              !item.isRequired ||
              (defaultSearchValue && defaultSearchValue[item.id]) ||
              (item.isRequired && item.defaultValue)
            );
          });
          if (!isNeedSearched && searchRequired) this.handleSearch();
        }
        this.getRangeField(newSearchForm);
      },
    );
    if (onRef) {
      onRef(this);
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const { expand } = this.state;
    const { searchCodeKey } = nextProps; // redux取
    const searchData =
      window.g_app && window.g_app._store && window.g_app._store.getState
        ? window.g_app._store.getState().search.data
        : {};
    const { defaultSearchValue } = searchCodeKey
      ? searchData[searchCodeKey] || {}
      : {};
    const defaultFlag =
      defaultSearchValue && !!Object.keys(defaultSearchValue).length;

    const newSearchForm = [];
    nextProps.searchForm.forEach((items) => {
      const item = items;
      if (
        item.type === 'select' &&
        item.options.length === 0 &&
        item.defaultValue &&
        item.defaultValue.key
      ) {
        item.options = [];
      }

      if (defaultFlag) {
        const cacheValue = defaultSearchValue[item.id];
        if (item.type === 'items') {
          item.items.forEach((ops) => {
            const op = ops;
            if (defaultSearchValue[op.id]) {
              op.defaultValue = defaultSearchValue[op.id];
            }
          });
        } else if (
          (item.type === 'select' || item.type === 'value_list') &&
          !!cacheValue
        ) {
          item.defaultValue = item.entity
            ? cacheValue
            : String(
                [true, false].includes(cacheValue.key)
                  ? cacheValue.key
                  : cacheValue.key || '',
              ) || cacheValue;
          if (item.options.length === 0 && cacheValue.key) {
            item.options = [
              {
                label: cacheValue.label,
                value: cacheValue.key,
                temp: true,
              },
            ];
          }
        } else if (cacheValue) {
          item.defaultValue = cacheValue;
        }
      }
      if (item.items) {
        this.setValidateField(item);
        newSearchForm.push(...item.items);
      } else {
        newSearchForm.push(item);
      }
    });
    this.setState(
      {
        searchForm: newSearchForm,
        expand: nextProps.searchForm.expand ? true : expand,
        searchCodeKey,
      },
      () => {
        const { searchForm } = nextProps;
        searchForm.expand = false;
        const tags = document.getElementsByClassName(
          'antd-pro-tag-select-tagSelect',
        );
        for (let i = 0; i < tags.length; i += 1) {
          if (
            tags[i].getElementsByClassName('ant-tag')[0].innerHTML !==
            messages('common.all', { context: this.context })
          )
            tags[i].getElementsByClassName('ant-tag')[0].innerHTML = messages(
              'common.all',
              { context: this.context },
            );
        }
        this.getRangeField(newSearchForm);
      },
    );
  };

  componentWillUnmount() {
    if (!this.cacheLock) {
      this.clearSearchAreaSelectData();
    }
  }

  // 收起下拉
  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  };

  /**
   * 搜索区域点击确认时的事件
   * 返回为form包装形成的格式，
   * 其中如果type为 combobox、multiple、list时返回的单项格式为
   * {
   *   label: '',  //数据显示值，与传入的labelKey挂钩
   *   key: '',    //数据需要值，与传入的valueKey挂钩
   *   value: {}   //数据整体值
   * }
   * @param e
   */
  handleSearch = (e) => {
    needBlurValidate = false;
    const { isReturnLabel, submitHandle } = this.props;
    const { validateFields } = this.formRef;
    // eslint-disable-next-line no-unused-vars
    const { expand, searchForm } = this.state;

    if (e) e.preventDefault();
    validateFields()
      .then((values) => {
        if (!this.rangeValidate(values)) return; // 校验 金额从/至, 日期从/至
        const searchFormTemp = [].concat(searchForm);
        searchFormTemp.forEach((item) => {
          if (item.type === 'yearPicker') {
            if (values[item.id]) {
              values[item.id] = moment(values[item.id]).format('YYYY');
            } else {
              values[item.id] = undefined;
            }
          }
          if (values[item.id] && item.entity) {
            if (item.type === 'value_list') {
              values[item.id] =
                values[item.id] instanceof Object
                  ? values[item.id].key || values[item.id].value
                  : values[item.id];
            }
            if (item.type === 'combobox' || item.type === 'select') {
              // 解决预算日志记账类型bug添加
              if (values[item.id].title) {
                values[item.id] = JSON.parse(values[item.id].title);
              }
            } else if (item.type === 'multiple') {
              const result = [];
              values[item.id].forEach((value) => {
                result.push(JSON.parse(value.title));
              });
              values[item.id] = result;
            }
          }
          // 把上传的图片，赋值给value
          if (
            item.type.toLowerCase() === 'img' ||
            item.type.toLowerCase() === 'image'
          ) {
            // 如果有上传
            if (item._file && item._file.id) {
              values[item.id] = item._file;
            }
          }
          if (item.type === 'list' && values[item.id]) {
            if (item.entity) {
              const result = [];
              values[item.id].forEach((value) => {
                result.push(value);
              });
              values[item.id] = result;
            } else {
              const result = [];
              values[item.id].forEach((value) => {
                result.push(value[item.valueKey]);
              });
              values[item.id] = result;
            }
          }
          if (item.type === 'lov' && values[item.id]) {
            if (item.single) {
              values[item.id] = values[item.id][item.valueKey];
            } else {
              const result = values[item.id].map((value) => {
                return value[item.valueKey];
              });
              values[item.id] = result;
            }
          }
          if (
            item.type === 'select_part_load' &&
            values[item.id] &&
            item.labelInValue !== false
          ) {
            values[item.id] = values[item.id].key;
          }
          if (
            isReturnLabel &&
            (values[item.id] ||
              values[item.id] === false ||
              values[item.id] === 0)
          ) {
            if (
              item.type === 'combobox' ||
              item.type === 'select' ||
              item.type === 'value_list'
            ) {
              item.options.forEach((option) => {
                // eslint-disable-next-line eqeqeq
                if (
                  `${option.value}` == values[item.id] ||
                  option.value == values[item.id]
                ) {
                  values[`${item.id}Lable`] = option.value;
                  values[`${item.id}Option`] = [
                    { label: option.label, value: option.value },
                  ];
                }
              });
            } else if (item.type === 'multiple') {
              const result = [];
              const options = [];
              item.options.forEach((option) => {
                values[item.id].forEach((id) => {
                  if (option.value === id) {
                    result.push(option.value);
                    options.push({ label: option.label, value: option.value });
                  }
                });
              });
              values[`${item.id}Lable`] = result;
              values[`${item.id}Option`] = options;
            } else {
              values[`${item.id}Lable`] = values[item.id];
            }
          }
        });

        if (isReturnLabel) values.expand = expand;

        // 补充字段进入value中
        const { implementFields } = this.props;
        if (implementFields) {
          values = { ...values, ...implementFields };
        }

        this.saveSearchValue(values);
        submitHandle(values);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 日期金额从至，有items, 具有属性，validateTime，validateAmount，进行校验
  setValidateField = (items) => {
    const item = items;
    if (item.validateTime) {
      item.items[0].dateFrom = item.id;
      item.items[1].dateTo = item.id;
    } else if (item.validateAmount) {
      item.items[0].amountFrom = item.id;
      item.items[1].amountTo = item.id;
    }
  };

  // 日期从、至禁选范围
  getDisabledDateRange = (curTime, item) => {
    const { getFieldValue } = this.formRef;
    const { dateRangeField } = this.state;
    const fineness = item.showTime ? null : 'day';
    if (item.dateFrom) {
      const dateToField = dateRangeField[item.dateFrom].dateTo.key;
      const dateTo = getFieldValue(dateToField);
      return dateTo ? curTime.isAfter(dateTo, fineness) : false;
    } else if (item.dateTo) {
      const dateFromField = dateRangeField[item.dateTo].dateFrom.key;
      const dateFrom = getFieldValue(dateFromField);
      return dateFrom ? curTime.isBefore(dateFrom, fineness) : false;
    }
    return false;
  };

  /**
   * 获取需要校验的字段， 金额从/至, 日期从/至
   * 属性：amountTo/amountFrom, 金额校验，同一个金额从/至的 值要相等，不同的金额从/至的 值不同
   * 属性：dateTo/dateFrom, 日期校验，同一个日期从/至的 值要相等，不同的金额从/至的 值不同
   */
  getRangeField = (newSearchForm) => {
    const amountRangeField = {};
    const dateRangeField = {};
    const numberField = {};
    newSearchForm.forEach((item) => {
      const amount = item.amountTo || item.amountFrom;
      const date = item.dateTo || item.dateFrom;
      if (amount) {
        amountRangeField[amount] = amountRangeField[amount] || {};
        amountRangeField[amount][item.amountTo ? 'amountTo' : 'amountFrom'] = {
          key: item.id,
          label: item.label,
        };
      } else if (date) {
        dateRangeField[date] = dateRangeField[date] || {};
        dateRangeField[date][item.dateTo ? 'dateTo' : 'dateFrom'] = {
          key: item.id,
          label: item.label,
        };
      }
      if (item.type === 'inputNumber') {
        numberField[item.id] = { key: item.id, label: item.label };
      }
    });
    this.setState({ amountRangeField, dateRangeField, numberField });
  };

  // 校验 金额从/至
  rangeValidate = (values) => {
    const { amountRangeField, numberField } = this.state;
    let result = true;
    Object.values(amountRangeField).forEach((item) => {
      if (!item.amountFrom || !item.amountTo) return;
      const amountFrom = values[item.amountFrom.key];
      const amountTo = values[item.amountTo.key];
      if (
        this.isNumber(amountTo) &&
        this.isNumber(amountFrom) &&
        Number(amountTo) < Number(amountFrom)
      ) {
        message.error(
          `${item.amountTo.label}${
            messages('common.cannot.be.less.than', {
              context: this.context,
            }) /** 不能小于 */
          }${item.amountFrom.label}`,
        );
        result = false;
      }
    });
    Object.values(numberField).forEach((item) => {
      if (!values[item.key]) return;
      if (!this.isNumber(values[item.key])) {
        message.error(
          messages('common.Illegal.digital', {
            context: this.context,
            params: { label: item.label },
          }),
        ); // `${item.label}为非法数字`
        result = false;
      }
    });
    return result;
  };

  // 检验是否是数字
  isNumber = (value) => /^-?[0-9]+(\.[0-9]+)?$/.test(value);

  // inputNumber失去焦点,校验金额从至
  inputNumberBlur = (e, item) => {
    const flag = item.amountFrom || item.amountTo;
    if (flag) {
      const { amountRangeField } = this.state;
      const { getFieldsValue } = this.formRef;
      const amountFromField = amountRangeField[flag].amountFrom;
      const amountToField = amountRangeField[flag].amountTo;
      const values = getFieldsValue([amountFromField.key, amountToField.key]);
      const amountFrom = values[amountFromField.key];
      const amountTo = values[amountToField.key];
      if (
        this.isNumber(amountTo) &&
        this.isNumber(amountFrom) &&
        Number(amountTo) < Number(amountFrom)
      ) {
        setTimeout(() => {
          // 让blur的校验在点击搜索、清空的click之后执行
          if (needBlurValidate) {
            message.error(
              `${amountToField.label}${messages('base.cannot.be.less.than', {
                context: this.context,
              })}${amountFromField.label}`,
            );
          } else {
            needBlurValidate = true;
          }
        }, 200);
      }
    }
  };

  saveSearchValue = (params) => {
    const { searchCodeKey } = this.state;
    const { validateFields } = this.formRef;
    validateFields()
      .then((values) => {
        if (searchCodeKey) {
          this.handleTempSaveSearchValueToRedux(values, params);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 过滤空值
  filterNullValue = (values) => {
    if (values) {
      const temp = {};
      Object.keys(values).forEach((key) => {
        if (values[key]) {
          temp[key] = values[key];
        }
      });
      return temp;
    }
    return values;
  };

  handleTempSaveSearchValueToRedux = (values, params) => {
    const defaultSearchValue = this.filterNullValue(values);
    const { searchForm, searchCodeKey } = this.state;

    searchForm.forEach((item) => {
      if (item.type === 'select' || item.type === 'value_list') {
        // 遍历两遍 一个是searchForm，一个是options，取搜索时select的值的labelKey的值
        const option = item.options.find(
          (op) => String(op.value) === String(values[item.id]),
        );
        if (option) {
          defaultSearchValue[item.id] = {
            label: (item.labelKey && option[item.labelKey]) || option.label,
            key: option[item.valueKey] || option.key || option.value,
          };
        }
      }
    });

    const { dispatch } = window.g_app._store;
    const { expand } = this.state;

    dispatch({
      type: 'search/addSearchData',
      payload: {
        [searchCodeKey]: {
          defaultSearchValue,
          expand,
          searchParams: params,
        },
      },
    });
  };

  customSetCacheValue = ({ searchParams = {}, defaultSearchValue = {} }) => {
    const { searchCodeKey } = this.state;
    const { dispatch, getState } = window.g_app._store;
    const searchData = getState()?.search?.data || {};
    const others = searchCodeKey ? searchData[searchCodeKey] || {} : {};
    dispatch({
      type: 'search/addSearchData',
      payload: {
        [searchCodeKey]: {
          ...others,
          searchParams: {
            ...(others.searchParams || {}),
            ...searchParams,
          },
          defaultSearchValue: {
            ...(others.defaultSearchValue || {}),
            ...defaultSearchValue,
          },
        },
      },
    });
  };

  getCacheValue = () => {
    const { searchCodeKey } = this.state;
    const { getState } = window.g_app._store;
    const searchData = getState()?.search?.data || {};
    const others = searchCodeKey ? searchData[searchCodeKey] || {} : {};
    return others;
  };

  handleCache = () => {
    this.cacheLock = true;
  };

  // 点击重置的事件，清空值为初始值
  handleReset = () => {
    const { clearHandle } = this.props;
    needBlurValidate = false;
    this.clearSearchAreaSelectData();
    if (clearHandle) {
      clearHandle();
    }
  };

  // 清除searchArea选择数据
  clearSearchAreaSelectData = () => {
    this.setState({ time: null });
    const { searchCodeKey } = this.state;
    const { resetFields } = this.formRef;

    if (searchCodeKey) {
      const { dispatch } = window.g_app._store;
      const searchData = window.g_app._store.getState().search.data || {};
      const initPageCode = searchData[`init-${searchCodeKey}`];
      dispatch({
        type: 'search/addSearchData',
        payload: { [searchCodeKey]: null },
      });
      if (initPageCode) {
        const { searchForm } = this.state;
        searchForm.forEach((item) => {
          item.defaultValue = initPageCode[item.id];
        });
        this.setState({ searchForm, time: null });
      }
    }
    resetFields();
  };

  // 区域点击事件，返回事件给父级进行处理
  handleEvent = (e, items) => {
    const { isReturnLabel, eventHandle } = this.props;
    const { getFieldsValue } = this.formRef;
    const { searchForm } = this.state;
    let result = null;
    const item = items;
    if (e) {
      if (
        item.entity &&
        (item.type === 'value_list' ||
          item.type === 'select' ||
          item.type === 'combobox')
      ) {
        item.options.forEach((options) => {
          const option = options;
          if (
            option.data[item.type === 'value_list' ? 'code' : item.valueKey] ===
            e.key
          )
            result = option.data;
        });
      } else if (item.entity && item.type === 'multiple') {
        result = [];
        e.forEach((value) => {
          item.options.forEach((option) => {
            if (
              option.data[
                item.type === 'value_list' ? 'code' : item.valueKey
              ] === value.key
            )
              result.push(option.data);
          });
        });
      } else if (item.type === 'switch') result = e;
      else result = e ? (e.target ? e.target.value : e) : null;
    }
    let valuesTmp;

    const values = getFieldsValue();

    const searchFormTemp = [].concat(searchForm);
    searchFormTemp.forEach((formItem) => {
      const item = formItem;
      if (values[item.id] && item.entity) {
        if (
          item.type === 'combobox' ||
          item.type === 'select' ||
          item.type === 'value_list'
        ) {
          if (values[item.id].title) {
            values[item.id] = JSON.parse(values[item.id].title);
          }
        } else if (item.type === 'multiple') {
          const result = [];
          values[item.id].forEach((value) => {
            result.push(JSON.parse(value.title));
          });
          values[item.id] = result;
        }
      }
      // 把上传的图片，赋值给value
      if (
        item.type.toLowerCase() === 'img' ||
        item.type.toLowerCase() === 'image'
      ) {
        // 如果有上传
        if (item._file && item._file.id) {
          values[item.id] = item._file;
        }
      }
      if (item.type === 'list' && values[item.id]) {
        if (item.entity) {
          const result = [];
          values[item.id].forEach((value) => {
            result.push(value);
          });
          values[item.id] = result;
        } else {
          const result = [];
          values[item.id].forEach((value) => {
            result.push(value[item.valueKey]);
          });
          values[item.id] = result;
        }
      }

      if (values[item.id] && isReturnLabel) {
        if (
          item.type === 'combobox' ||
          item.type === 'select' ||
          item.type === 'value_list'
        ) {
          item.options.forEach((option) => {
            if (option.value === values[item.id]) {
              values[`${item.id}Lable`] = option.label;
            }
          });
        } else if (item.type === 'multiple') {
          const result = [];
          item.options.forEach((option) => {
            values[item.id].forEach((id) => {
              if (option.value === id) {
                result.push(option.label);
              }
            });
          });
          values[`${item.id}Lable`] = result;
        } else {
          values[`${item.id}Lable`] = values[item.id];
        }
      }
    });

    // eslint-disable-next-line prefer-const
    valuesTmp = values;
    eventHandle(item.event, result, valuesTmp);
  };

  getDataLabel = (data, keys) => {
    let keyTemp = keys;
    let isMatch = false;
    keyTemp = keyTemp.replace(/\$\{(.*?)\}/g, (target, value) => {
      isMatch = true;
      return this.getValue(data, value) || '';
    });

    if (isMatch) {
      return keyTemp;
    } else {
      return this.getValue(data, keyTemp) || '';
    }
  };

  getValue = (data, key) => {
    const result = JSON.stringify(data);
    // eslint-disable-next-line no-new-func
    return new Function(`try {return ${result}.${key} } catch(e) {}`)();
  };

  getLastKey = (key) => {
    return key.split('.')[key.split('.').length - 1];
  };

  // 给select增加options
  getOptions = (item) => {
    let { searchForm } = this.state;
    if (
      item.options.length === 0 ||
      (item.options.length === 1 && item.options[0].temp)
    ) {
      const url = item.getUrl;
      let tempForm = searchForm;
      tempForm = tempForm.map((searchItems) => {
        const searchItem = searchItems;
        if (searchItem.id === item.id) {
          searchItem.fetching = true;
          searchItem.hasGetList = true;
        }
        if (searchItem.type === 'items')
          searchItem.items.forEach((subItems) => {
            const subItem = subItems;
            if (subItem.id === item.id) {
              subItem.fetching = true;
              searchItem.hasGetList = true;
            }
          });
        return searchItem;
      });
      this.setState({ searchForm: tempForm });
      httpFetch[item.method](url, item.getParams).then((res) => {
        const options = [];
        let { data } = res;
        if (item.dataKey && typeof data === 'object') {
          const result = JSON.stringify(data);
          data = (() => {
            try {
              return `${result}.${item.dataKey}`;
            } catch (e) {
              console.log(e);
            }
          })();
          // new Function(`try {return ${result}.${item.dataKey} } catch(e) {}`)();
        }

        if (item.listKey) {
          item.listKey.split('.').forEach((key) => {
            data = data[key];
          });
        }

        data.forEach((data) => {
          const label = this.getDataLabel(data, item.labelKey);

          options.push({
            label: item.renderOption ? item.renderOption(data) : label,
            value: data[this.getLastKey(item.valueKey)],
            data,
          });
        });
        searchForm = searchForm.map((searchItems) => {
          const searchItem = searchItems;
          if (searchItem.id === item.id) {
            searchItem.options = options;
            searchItem.fetching = false;
          }
          if (searchItem.type === 'items')
            searchItem.items.forEach((subItems) => {
              const subItem = subItems;
              if (subItem.id === item.id) {
                subItem.fetching = false;
                subItem.options = options;
              }
            });
          return searchItem;
        });

        this.setState({ searchForm });
      });
    }
  };

  // 得到值列表的值增加options
  getValueListOptions = (item) => {
    if (
      item.options.length === 0 ||
      (item.options.length === 1 && item.options[0].temp)
    ) {
      this.getSystemValueList(item.valueListCode, item.all).then((res) => {
        const options = [];
        res.data.values.forEach((data) => {
          options.push({
            label: item.renderOption ? item.renderOption(data) : data.name,
            value: data.value || data.code,
            data,
          });
        });
        let { searchForm } = this.state;
        searchForm = searchForm.map((searchItems) => {
          const searchItem = searchItems;
          if (searchItem.id === item.id) searchItem.options = options;
          if (searchItem.type === 'items')
            searchItem.items.forEach((subItems) => {
              const subItem = subItems;
              if (subItem.id === item.id) subItem.options = options;
            });
          return searchItem;
        });
        this.setState({ searchForm });
      });
    }
  };

  // 根据接口返回数据重新设置options
  setOptionsToFormItem = (item, url, key) => {
    const params = item.getParams ? item.getParams : {};
    if (key) {
      params[item.searchKey] = key;
    }

    if ((key !== undefined && key !== '') || key === undefined) {
      httpFetch[item.method](url, params).then((res) => {
        const options = [];
        const dealData = (dls) => {
          let dataList = dls;
          if (item.listKey) {
            item.listKey.split('.').forEach((key) => {
              dataList = dataList[key];
            });
          }
          dataList.forEach((data) => {
            const label = this.getDataLabel(data, item.labelKey);
            options.push({
              label: item.renderOption ? item.renderOption(data) : label,
              value: data[this.getLastKey(item.valueKey)],
              data,
            });
            // eslint-disable-next-line no-prototype-builtins
            if (data.hasOwnProperty(item.childrenMultipleKey)) {
              dealData(data[item.childrenMultipleKey]);
            }
          });
        };
        dealData(res.data);
        let { searchForm } = this.state;
        searchForm = searchForm.map((searchItems) => {
          const searchItem = searchItems;
          if (searchItem.id === item.id) searchItem.options = options;
          return searchItem;
        });
        this.setState({ searchForm });
      });
    }
  };

  /**
   * 如果是select的设置值，如果options内没有值时应先增加一个默认的对应option
   * @param item  对应searchForm的表单项
   * @param value 需要设置的值 {label: '', value: ''}
   * @param index 当type为items时的序列
   */
  onSetSelectValue = (item, value, index) => {
    if (!value?.value) return;
    const valueWillSet = {};
    let { searchForm } = this.state;

    if (index === undefined)
      searchForm = searchForm.map((searchItems) => {
        const searchItem = searchItems;
        if (searchItem.id === item.id) {
          valueWillSet[searchItem.id] = item.entity
            ? { key: value.value, label: value.label }
            : `${value.value}`;
          if (
            searchItem.options.length === 0 ||
            (searchItem.options.length === 1 && searchItem.options[0].temp)
          ) {
            const dataOption = {};
            searchItem.options = [];
            dataOption[
              item.type === 'value_list'
                ? 'code'
                : this.getLastKey(item.valueKey)
            ] = value.value;
            dataOption[
              item.type === 'value_list'
                ? 'messageKey'
                : this.getLastKey(item.labelKey)
            ] = value.label;
            searchItem.options.push({
              label: value.label,
              value: value.value,
              data: dataOption,
              temp: true,
            });
          }
        }
        return searchItem;
      });
    else
      searchForm[index].items = searchForm[index].items.map((searchItems) => {
        const searchItem = searchItems;
        if (searchItem.id === item.id) {
          valueWillSet[searchItem.id] = searchItem.entity
            ? {
                key: value[index].value,
                label: value[index].label,
              }
            : `${value[index].value}`;
          if (
            searchItem.options.length === 0 ||
            (searchItem.options.length === 1 && searchItem.options[0].temp)
          ) {
            const dataOption = {};
            searchItem.options = [];
            dataOption[
              item.type === 'value_list'
                ? 'code'
                : this.getLastKey(searchItem.valueKey)
            ] = value[index].value;
            dataOption[
              item.type === 'value_list'
                ? 'messageKey'
                : this.getLastKey(searchItem.labelKey)
            ] = value[index].label;
            searchItem.options.push({
              label: value[index].label,
              value: value[index].value,
              data: dataOption,
              temp: true,
            });
          }
        }
        return searchItem;
      });
    this.setState({ searchForm }, () => {
      const { setFieldsValue } = this.formRef;
      setFieldsValue(valueWillSet);
    });
  };

  /**
   * 设置searchForm的值
   * @param options 需要设置的值，与form.setFieldsValue值格式一致
   * input、switch、data、radio、big_radio、checkbox直接传入对应字符串value即可
   * select、value_list 所需的默认值需要哦为 {label: '', value: ''}
   * list 所需格式为包含显示值与数据值的对象数组，根据valueKey与labelKey对应
   * TODO: combobox 与 multiple 模式待开发
   *
   * @example：
   *
   * <SearchArea wrappedComponentRef={(inst) => this.formRef = inst} {...props} />
   *
   * this.formRef.setValues({
      listId: [{user: '', userOid: ''}, ...],
      selectId: {label: '', value: ''},
      inputId: 'value',
      value_listId: {label: '', value: ''}
    });
   *
   */
  setValues = (options) => {
    const { setFieldsValue } = this.formRef;
    const { searchForm } = this.state;
    Object.keys(options).forEach((key) => {
      const searchFormTemp = [].concat(searchForm);
      searchFormTemp.forEach((searchItem, index) => {
        if (searchItem.id === key) {
          if (
            (searchItem.type === 'select' ||
              searchItem.type === 'value_list') &&
            (typeof options[key] === 'object' || options[key]?.splice)
          )
            this.onSetSelectValue(searchItem, options[key]);
          else if (searchItem.type === 'list') {
            const value = {};
            value[key] = options[key];
            setFieldsValue(value);
          } else if (searchItem.type === 'date') {
            const value = {};
            value[key] = options[key] ? moment(options[key]) : undefined;
            setFieldsValue(value);
          } else if (searchItem.type === 'month') {
            const value = {};
            value[key] = options[key] ? moment(options[key]) : undefined;
            setFieldsValue(value);
          } else if (searchItem.type === 'switch') {
            const value = {};
            value[key] = options[key];
            setFieldsValue(value);
          } else if (searchItem.type === 'input') {
            const value = {};
            value[key] = options[key];
            setFieldsValue(value);
          } else {
            const value = {};
            value[key] = options[key] ? `${options[key]}` : undefined;
            setFieldsValue(value);
          }
        } else if (searchItem.type === 'items') {
          searchItem.items.forEach((subItem) => {
            if (subItem.id === key) {
              if (
                (subItem.type === 'select' || subItem.type === 'value_list') &&
                typeof options[key] === 'object'
              )
                this.onSetSelectValue(subItem, options[key], index);
              else if (subItem.type === 'list') {
                const value = {};
                value[key] = options[key];
                setFieldsValue(value);
              } else if (subItem.type === 'date') {
                const value = {};
                value[key] = options[key] ? moment(options[key]) : undefined;
                setFieldsValue(value);
              } else if (searchItem.type === 'month') {
                const value = {};
                value[key] = options[key] ? moment(options[key]) : undefined;
                setFieldsValue(value);
              } else if (subItem.type === 'switch') {
                const value = {};
                value[key] = options[key];
                setFieldsValue(value);
              } else {
                const value = {};
                value[key] = options[key] ? `${options[key]}` : undefined;
                setFieldsValue(value);
              }
            }
          });
        }
      });
    });
  };

  // 把上传的图片，绑定到对应的字段上
  handleUploadImageChange = (file, id) => {
    const { searchForm } = this.state;
    const _file = file[0];
    for (let i = 0; i < searchForm.length; i += 1) {
      if (id === searchForm[i].id) {
        searchForm[i]._file = _file;
      }
    }
  };

  // 固定下拉菜单
  getParentContainer = (node) => node.parentNode;

  // 渲染搜索表单组件
  renderFormItem = (item) => {
    const { isPopconfirmFlag, eventHandle } = this.props;
    const { getFieldValue } = this.formRef;
    const { isopen } = this.state;
    const handle = item.event
      ? (event) => this.handleEvent(event, item)
      : () => {};
    if (
      item.type.toLowerCase() === 'img' ||
      item.type.toLowerCase() === 'image'
    ) {
      item.type = 'img';
    }
    switch (item.type) {
      // 输入组件
      case 'input': {
        if (item.language)
          return (
            <LanguageInput
              name={item.name}
              i18nName={item.nameI18n}
              nameChange={(name, i18nName) =>
                eventHandle(item.event, { name, i18nName })
              }
              disabled={item.disabled}
              onPressEnter={isPopconfirmFlag ? undefined : this.handleSearch}
            />
          );

        return (
          <Input
            placeholder={
              item.placeholder ||
              messages('common.please.enter', { context: this.context })
            }
            onChange={handle}
            disabled={item.disabled}
            autoComplete="off"
            onPressEnter={isPopconfirmFlag ? undefined : this.handleSearch}
            style={{ width: '100%' }}
            title={getFieldValue(item.id)}
          />
        );
      }
      // 输入金额组件组件
      case 'inputNumber': {
        const min = item.min ? {} : { min: 0 };
        return (
          <InputNumber
            style={{ width: '100%' }}
            precision={
              item.precision === undefined
                ? 2
                : [null, false].includes(item.precision)
                ? undefined
                : item.precision
            }
            {...min}
            step={item.step || 0.01}
            formatter={item.formatter || undefined}
            parser={item.parser || undefined}
            placeholder={
              item.placeholder ||
              messages('common.please.enter', { context: this.context })
            }
            onChange={handle}
            disabled={item.disabled}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                if (!isPopconfirmFlag) this.handleSearch();
              }
            }}
            title={getFieldValue(item.id)}
            onBlur={(e) => this.inputNumberBlur(e, item)}
          />
        );
      }
      // 选择组件
      case 'select': {
        if (item.getUrl && item.defaultGetList && !item.hasGetList) {
          this.getOptions(item);
        }
        return (
          <Select
            mode={item.multiple && 'multiple'} // 支持多选，默认单选
            showArrow
            placeholder={
              item.placeholder ||
              messages('common.please.select', { context: this.context })
            }
            onChange={handle}
            allowClear={item.allowClear === undefined ? true : item.allowClear}
            disabled={item.disabled}
            labelInValue={!!item.entity}
            onDropdownVisibleChange={
              item.getUrl ? (open) => open && this.getOptions(item) : undefined
            }
            notFoundContent={
              item.fetching ? (
                <Spin size="small" />
              ) : (
                messages('common.no.matching.result', { context: this.context })
              )
            }
            getPopupContainer={this.getParentContainer}
            style={{ width: '100%' }}
            showSearch={item.showSearch}
            filterOption={
              item.showSearch
                ? (input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                : null
            }
            dropdownMatchSelectWidth={false}
            dropdownStyle={{ maxWidth: '20vw' }}
            dropdownClassName="wrap-select-option"
          >
            {item.options.map((option) => {
              return (
                <Option
                  key={option.value}
                  title={
                    option.data && !!item.entity
                      ? JSON.stringify(option.data)
                      : option.label
                  }
                >
                  {option.label}
                </Option>
              );
            })}
          </Select>
        );
      }
      // 级联选择
      case 'cascader': {
        return (
          <Cascader
            placeholder={
              item.placeholder ||
              messages('common.please.select', { context: this.context })
            }
            getPopupContainer={this.getParentContainer}
            onChange={handle}
            options={item.options}
            allowClear
            showSearch
            disabled={item.disabled}
          />
        );
      }
      // 值列表选择组件
      case 'value_list': {
        return (
          <Select
            placeholder={
              item.placeholder ||
              messages('common.please.select', { context: this.context })
            }
            onChange={handle}
            allowClear={item.clear}
            disabled={item.disabled}
            labelInValue={!!item.entity}
            onDropdownVisibleChange={(open) =>
              open && this.getValueListOptions(item)
            }
            getPopupContainer={this.getParentContainer}
            dropdownMatchSelectWidth={false}
            dropdownStyle={{ maxWidth: '20vw' }}
            dropdownClassName="wrap-select-option"
            showSearch={item.showSearch}
            filterOption={
              item.showSearch
                ? (input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                : null
            }
          >
            {item.options.map((option) => {
              return (
                <Option
                  key={option.value}
                  title={
                    option.data && !!item.entity
                      ? JSON.stringify(option.data)
                      : ''
                  }
                >
                  <Tooltip placement="topLeft" title={option.label}>
                    {option.label}
                  </Tooltip>
                </Option>
              );
            })}
          </Select>
        );
      }
      // 月份组件
      case 'month': {
        const monthFormat = item.format === 'YYYY/MM' ? item.format : 'YYYY-MM';
        return (
          <MonthPicker
            format={monthFormat}
            onChange={handle}
            disabled={item.disabled}
            showTime={item.showTime}
            placeholder={
              item.placeholder ||
              messages('common.please.select', { context: this.context })
            }
            getCalendarContainer={this.getParentContainer}
            disabledDate={(cur) => {
              const lowerLimit =
                cur.isBefore(moment('1970-01-01 00:00:00')) ||
                cur.isAfter(moment('2038-01-01 00:00:01'));
              if (lowerLimit) return true;
              return Object.prototype.toString.call(item.disabledDate) ===
                '[object Function]'
                ? item.disabledDate(cur)
                : this.getDisabledDateRange(cur, item);
            }}
          />
        );
      }
      // 日期组件
      case 'date': {
        const formatValue = item.showTime
          ? 'YYYY-MM-DD HH:mm:ss'
          : 'YYYY-MM-DD';
        return (
          <DatePicker
            disabledDate={(cur) => {
              const lowerLimit =
                cur.isBefore(moment('1970-01-01 00:00:00')) ||
                cur.isAfter(moment('2038-01-01 00:00:01'));
              if (lowerLimit) return true;
              return Object.prototype.toString.call(item.disabledDate) ===
                '[object Function]'
                ? item.disabledDate(cur)
                : this.getDisabledDateRange(cur, item);
            }}
            format={item.format || formatValue}
            disabled={item.disabled}
            showTime={item.showTime}
            placeholder={
              item.placeholder ||
              messages('common.please.select', { context: this.context })
            }
            getPopupContainer={this.getParentContainer}
            className={`item${unique}-${item.id}`}
            allowClear={item.allowClear === undefined ? true : item.allowClear}
            onChange={(value, ...rest) => {
              handle(value, ...rest);
              document
                .querySelector(`.item${unique}-${item.id}`)
                .setAttribute('title', value ? value.format(formatValue) : '');
            }}
            onBlur={(e) => {
              if (!item.showTime || !item.dateFrom || !item.dateTo) {
                return;
              }
              const key = item.id;
              const val = e.target.value;
              const { getFieldValue, setFieldsValue } = this.formRef;
              const { dateRangeField } = this.state;
              const startKey =
                dateRangeField[item.dateFrom || item.dateTo].dateFrom.key;
              const endKey =
                dateRangeField[item.dateFrom || item.dateTo].dateTo.key;
              const startDate =
                startKey === item.id
                  ? val
                    ? moment(val)
                    : undefined
                  : getFieldValue(startKey);
              const endDate =
                endKey === item.id
                  ? val
                    ? moment(val)
                    : undefined
                  : getFieldValue(endKey);
              if (startDate && endDate) {
                if (!startDate.isSameOrBefore(endDate)) {
                  const fields = {};
                  fields[key] = undefined;
                  setFieldsValue({ ...fields });
                }
              }
            }}
            style={item.showTime ? { minWidth: '100%' } : {}}
            onFocus={() => {
              if (
                item.showTime &&
                document.querySelector(`.item${unique}-${item.id} input`)
              ) {
                document
                  .querySelector(`.item${unique}-${item.id} input`)
                  .setAttribute(
                    'style',
                    'text-overflow: ellipsis;white-space: nowrap;overflow: hidden;',
                  );
              }
            }}
            picker={item.picker}
          />
        );
      }
      // 日期
      case 'datePicker': {
        return (
          <RangePicker
            format="YYYY-MM-DD"
            onChange={handle}
            disabled={item.disabled}
            getPopupContainer={this.getParentContainer}
          />
        );
      }
      // 年度
      case 'yearPicker': {
        return (
          <DatePicker
            format="YYYY"
            picker="year"
            onChange={() => {
              this.setState({ time: null });
            }}
            open={isopen}
            disabled={item.disabled}
            showTime={item.showTime}
            allowClear
            onOpenChange={(status) => {
              if (status) {
                this.setState({ isopen: true });
              } else {
                this.setState({ isopen: false });
              }
            }}
            onPanelChange={(value) => {
              this.setState({
                time: value,
                isopen: false,
              });
            }}
            placeholder={
              item.placeholder ||
              messages('common.please.select', { context: this.context })
            }
            getPopupContainer={this.getParentContainer}
            disabledDate={(cur) => {
              const lowerLimit =
                cur.isBefore(moment('1970-01-01 00:00:00')) ||
                cur.isAfter(moment('2038-01-01 00:00:01'));
              if (lowerLimit) return true;
              return false;
            }}
          />
        );
      }
      // 日期范围选择
      // noRange 是否有范围限制
      case 'rangePicker': {
        return (
          <RangePicker
            format="YYYY-MM-DD"
            onChange={handle}
            disabled={item.disabled}
            disabledDate={(date) => {
              return (
                !item.noRange && date && date.valueOf() > new Date().getTime()
              );
            }}
            getPopupContainer={this.getParentContainer}
          />
        );
      }
      // 单日期组成的日期选择框
      case 'rangePickerInput': {
        return null;
      }
      // 日期范围组件，可选时分秒
      case 'rangeDateTimePicker': {
        return (
          <RangePicker
            showTime={{
              hideDisabledOptions: true,
              defaultValue: [
                moment('00:00:00', 'HH:mm:ss'),
                moment('11:59:59', 'HH:mm:ss'),
              ],
            }}
            format="YYYY-MM-DD HH:mm:ss"
            onChange={handle}
            disabled={item.disabled}
            getPopupContainer={this.getParentContainer}
            style={{ width: '100%' }}
          />
        );
      }
      // 单选组件
      case 'radio': {
        return (
          <Radio.Group onChange={handle} disabled={item.disabled}>
            {item.options.map((option) => {
              return (
                <Radio value={option.value} key={option.value}>
                  {option.label}
                </Radio>
              );
            })}
          </Radio.Group>
        );
      }
      // 单选组件（大）
      case 'big_radio': {
        return (
          <Radio.Group size="large" onChange={handle} disabled={item.disabled}>
            {item.options.map((option) => {
              return (
                <Radio.Button value={option.value} key={option.value}>
                  {option.label}
                </Radio.Button>
              );
            })}
          </Radio.Group>
        );
      }
      // 选择框
      case 'checkbox': {
        return (
          <Checkbox.Group
            options={item.options}
            onChange={handle}
            disabled={item.disabled}
          />
        );
      }
      // 带搜索的选择组件
      case 'combobox': {
        return (
          <Select
            labelInValue={!!item.entity}
            showSearch
            allowClear={item.allowClear !== false}
            placeholder={
              item.placeholder ||
              messages('common.please.enter', { context: this.context })
            }
            onChange={handle}
            onDropdownVisibleChange={
              item.getUrl
                ? (open) => open && this.setOptionsToFormItem(item, item.getUrl)
                : () => {}
            }
            onSearch={
              item.searchUrl
                ? (key) => this.setOptionsToFormItem(item, item.searchUrl, key)
                : () => {}
            }
            disabled={item.disabled}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
            getPopupContainer={this.getParentContainer}
          >
            {item.options.map((option) => {
              return (
                <Option
                  key={option.value}
                  title={
                    option.data && !!item.entity
                      ? JSON.stringify(option.data)
                      : ''
                  }
                >
                  {option.label}
                </Option>
              );
            })}
          </Select>
        );
      }
      // 使用selectPartLoad组件 分页下拉框
      case 'select_part_load': {
        return (
          <SelectPartLoad
            labelInValue={item.labelInValue}
            allowClear={item.allowClear === undefined ? true : item.allowClear}
            placeholder={
              item.placeholder ||
              messages('common.please.enter', { context: this.context })
            }
            url={item.getUrl}
            params={item.getParams}
            renderOptions={item.renderOptions}
            labelKey={item.labelKey}
            valueKey={item.valueKey}
            searchKey={item.searchKey}
            defaultGetList={item.defaultGetList}
            forceGetList={item.forceGetList}
            mode={item.mode}
            extraOptionList={item.extraOptionList}
            disabled={item.disabled === undefined ? false : item.disabled}
            lazyLoad
            showPagination={false} // 分页并且每次都加载下一页都数据补充到原本到option中
            onChange={handle}
            getPopupContainer={this.getParentContainer}
          />
        );
      }
      // 带搜索的多选组件
      case 'multiple': {
        return (
          <Select
            mode="multiple"
            labelInValue={!!item.entity}
            placeholder={
              item.placeholder ||
              messages('common.please.select', { context: this.context })
            }
            filterOption={!item.searchUrl}
            optionFilterProp="children"
            onChange={handle}
            onDropdownVisibleChange={
              item.getUrl
                ? (open) => open && this.setOptionsToFormItem(item, item.getUrl)
                : () => {}
            }
            onSearch={
              item.searchUrl
                ? (key) => this.setOptionsToFormItem(item, item.searchUrl, key)
                : () => {}
            }
            disabled={item.disabled}
            getPopupContainer={this.getParentContainer}
          >
            {item.options.map((option) => {
              return (
                <Option
                  key={option.value}
                  title={
                    option.data && !!item.entity
                      ? JSON.stringify(option.data)
                      : ''
                  }
                >
                  {option.label}
                </Option>
              );
            })}
          </Select>
        );
      }
      // 弹出框列表选择组件
      case 'list': {
        return (
          <Lov
            placeholder={
              item.placeholder ||
              messages('common.please.select', { context: this.context })
            }
            disabled={item.disabled}
            code={item.listType}
            listTitle={item.listTitle}
            requestBody={item.requestBody}
            showClear={item.clear}
            onChange={handle}
            labelKey={this.getLastKey(item.labelKey)}
            valueKey={this.getLastKey(item.valueKey)}
            listExtraParams={item.listExtraParams}
            selectorItem={item.selectorItem}
            single={item.single}
            method={item.method}
            lovType="chooser"
            searchList={item.searchList}
            searchListIndex={item.searchListIndex}
            needCache={item.needCache}
            showLabel={item.showLabel}
            renderLabel={item.renderLabel}
            allowClear={item.allowClear}
            getPopupContainer={this.getParentContainer}
          />
        );
      }
      // 弹出框列表选择组件
      case 'lov': {
        return (
          <Lov
            placeholder={
              item.placeholder ||
              messages('common.please.select', { context: this.context })
            }
            disabled={item.disabled}
            code={item.code}
            onChange={handle}
            labelKey={this.getLastKey(item.labelKey)}
            valueKey={this.getLastKey(item.valueKey)}
            extraParams={item.extraParams}
            selectorItem={item.selectorItem}
            single={item.single}
            hideSearchList={item.hideSearchList}
            searchList={item.searchList}
            columnsList={item.columnsList}
            searchListIndex={item.searchListIndex}
            allowClear={item.allowClear === undefined ? true : item.allowClear}
            needCache={item.needCache}
            showLabel={item.showLabel}
            renderLabel={item.renderLabel}
            getPopupContainer={this.getParentContainer}
          />
        );
      }
      // 树下拉列表选择组件
      case 'treeSelect': {
        return (
          <TreeSelect
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={item.treeData}
            onChange={handle}
            placeholder={
              item.placeholder ||
              messages('common.please.select', { context: this.context })
            }
            allowClear={item.allowClear === undefined ? true : item.allowClear}
            disabled={item.disabled}
          />
        );
      }
      // switch状态切换组件
      case 'switch': {
        return (
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            onChange={handle}
            disabled={item.disabled}
          />
        );
      }
      // 同一单元格下多个表单项组件
      case 'items': {
        const colSpan = this.getItemCol(item);
        return (
          <Row gutter={10} key={item.id}>
            {item.label ? (
              <Col span={item.labelCol || 4}>
                <label className="item-label">{item.label}</label>
              </Col>
            ) : (
              ''
            )}
            {item.items.map((searchItem) => {
              return (
                <Col span={colSpan} key={searchItem.id}>
                  <Form.Item
                    label={searchItem.label}
                    colon={false}
                    name={searchItem.id}
                    initialValue={this.getDefaultValue(searchItem)}
                    rules={[
                      {
                        required: searchItem.isRequired,
                        message: messages('common.no.empty', {
                          params: { name: searchItem.label },
                          context: this.context,
                        }), // name 不可为空
                      },
                      ...(item.validator
                        ? [
                            {
                              validator: (...rest) =>
                                item.validator(this.formRef, item, ...rest),
                            },
                          ]
                        : []),
                    ]}
                  >
                    {this.renderFormItem(searchItem)}
                  </Form.Item>
                </Col>
              );
            })}
          </Row>
        );
      }
      default:
        break;
    }
  };

  getItemCol = (item) => {
    const length = +item.items.length;
    return item.label
      ? parseInt(`${(24 - item.labelCol) / length}`, 10)
      : parseInt(`${24 / length}`, 10);
  };

  /**
   * 渲染所有配置的搜索区表单组件，通过display : none控制部分控件是否隐藏（即展开和收起效果）
   */
  renderAllFormItem = () => {
    const {
      isHideOkTextText,
      isHideClearText,
      clearText,
      extraFields,
      loading,
      okText,
      isPopconfirmFlag,
      title,
      defaultSpan,
      defaultLength,
      formLayout: propsFormLayout,
      btnCol,
    } = this.props;
    const { searchForm, expand } = this.state;

    const children = [];

    const formLayout = propsFormLayout || {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
    };
    searchForm.forEach((item, i) => {
      children.push(
        <Col
          span={item.span || defaultSpan}
          key={item.id}
          style={
            i >= defaultLength ? { display: expand ? 'block' : 'none' } : {}
          }
        >
          {item.type === 'items' ? (
            this.renderFormItem(item)
          ) : (
            <Form.Item
              label={item.label}
              {...formLayout}
              name={item.id}
              valuePropName={item.type === 'switch' ? 'checked' : 'value'}
              initialValue={this.getDefaultValue(item)}
              rules={[
                {
                  required: item.isRequired,
                  message: messages('common.no.empty', {
                    params: { name: item.label },
                    context: this.context,
                  }), // name 不可为空
                },
                ...(item.validator
                  ? [
                      {
                        validator: (...rest) =>
                          item.validator(this.formRef, item, ...rest),
                      },
                    ]
                  : []),
              ]}
            >
              {this.renderFormItem(item)}
            </Form.Item>
          )}
        </Col>,
      );
    });

    children.push(this.getExtraFields());

    children.push(
      <Col
        span={expand ? 24 : btnCol ?? defaultSpan}
        key={-1}
        style={{ textAlign: 'right', marginBottom: 24 }}
      >
        {searchForm.length + (extraFields ? extraFields.length : 0) >
        defaultLength ? (
          <a className="toggle-button" onClick={this.toggle}>
            {expand
              ? messages('common.fold', { context: this.context })
              : messages('common.expand', { context: this.context })}
            {expand ? <UpOutlined /> : <DownOutlined />}
          </a>
        ) : null}
        {isHideOkTextText ? (
          ''
        ) : isPopconfirmFlag ? (
          <Popconfirm onConfirm={this.handleSearch} title={title}>
            <Button type="primary" loading={loading}>
              {messages(okText, { context: this.context })}
            </Button>
          </Popconfirm>
        ) : (
          <Button type="primary" onClick={this.handleSearch} loading={loading}>
            {messages(okText, { context: this.context })}
          </Button>
        )}

        {isHideClearText ? (
          ''
        ) : (
          <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
            {messages(clearText, { context: this.context })}
          </Button>
        )}
      </Col>,
    );
    return children;
  };

  getFields = () => {
    const { defaultLength, defaultSpan } = this.props;
    const { searchForm } = this.state;

    const children = [];
    searchForm.forEach((item, i) => {
      children.push(
        <Col
          span={item.span || defaultSpan}
          key={item.id}
          style={{ display: i < defaultLength ? 'block' : 'none' }}
        >
          {item.type === 'items' ? (
            this.renderFormItem(item)
          ) : (
            <Form.Item
              label={item.label}
              name={item.id}
              valuePropName={item.type === 'switch' ? 'checked' : 'value'}
              initialValue={this.getDefaultValue(item)}
              rules={[
                {
                  required: item.isRequired,
                  message: messages('common.no.empty', {
                    params: { name: item.label },
                    context: this.context,
                  }), // name 不可为空
                },
              ]}
            >
              {this.renderFormItem(item)}
            </Form.Item>
          )}
        </Col>,
      );
    });
    children.push(this.getExtraFields());
    return children;
  };

  getDefaultValue = (item) => {
    const { time } = this.state;
    if (item.type === 'yearPicker' && time) return time;
    if (
      item.type === 'select' &&
      item.defaultValue &&
      !item.entity &&
      ![null, undefined].includes(item.defaultValue.key)
    )
      return item.defaultValue.key;
    else return item.defaultValue;
  };

  getExtraFields = () => {
    const { expand, searchForm } = this.state;
    const { colSpan, extraFields, defaultLength, isExtraFields, defaultSpan } =
      this.props;

    // 要使用extraFields，<Col span={8}设置为8,不然无法对齐
    const count = expand
      ? searchForm.length + (extraFields && extraFields.length)
      : defaultLength;
    const children = [];
    if (isExtraFields && extraFields && extraFields.length > 0) {
      extraFields.forEach((item, i) => {
        children.push(
          // eslint-disable-next-line react/no-array-index-key
          <Col
            span={colSpan || defaultSpan}
            key={`${i}extraFields`}
            style={{
              display: i + searchForm.length < count ? 'block' : 'none',
            }}
          >
            {extraFields[i]}
          </Col>,
        );
      });
      return children;
    } else {
      return <div key="extraFields" />;
    }
  };

  render() {
    return (
      <div
        style={{ position: 'relative', clear: 'both', width: '100%' }}
        id="search-area"
      >
        <Form
          className="ant-advanced-search-form search-area"
          // layout="inline"
          labelAlign="right"
          ref={(ref) => {
            this.formRef = ref;
          }}
        >
          <div>
            <Row gutter={12} type="flex" align="top">
              {this.renderAllFormItem()}
            </Row>
          </div>
        </Form>
      </div>
    );
  }
}

/**
 *
 * @type searchForm 表单列表，如果项数 > defaultLength 则自动隐藏多余选项到下拉部分，每一项的格式如下：
 * {
          type: '',  //必填，类型,为input、inputNumber、select、cascader、 date、radio、big_radio、checkbox、combobox、multiple、 list、 items、 value_list、 selput中的一种
          id: '',  //必填，表单id，搜索后返回的数据key
          placeholder: '',  //可选，表单placeholder
          label: '',  //必填，界面显示名称label
          listType: '',  //可选，当type为list、selput，listSelector的type类型
          listExtraParams: '',  //可选，当type为list、selput时有效，listSelector的extraParams
          disabled: false  //可选，是否可用
          isRequired: false,  //可选，是否必填
          options: [{label: '',  value: ''}],  //可选，如果不为input、date时必填，为该表单选项数组，因为不能下拉刷新，所以如果可以搜索type请选择combobox或multiple，否则一次性传入所有值
          selectorItem: {},  //可选，当type为list、selput时有效，当listType满足不了一些需求时，可以使用次参数传入listSelector的配置项
          event: '',   //可选，自定的onChange事件ID，将会在eventHandle回调内返回
          defaultValue: '',  //可选，默认值，如果type为select且options为空时，可传入string或object({label, key})的初始值
          searchUrl: '',  //可选，当类型为combobox和multiple有效，搜索需要的接口，
          getUrl: '',  //可选，初始显示的值需要的接口,适用与select、multiple、combobox
          method: '',   //可选，getUrl接口所需要的接口类型get/post
          searchKey: '',  //可选，搜索参数名
          labelKey: '',  //可选，接口返回或list返回的数据内所需要页面options显示名称label的参数名，
          valueKey: '',  //可选，接口返回或list返回的数据内所需要options值key的参数名, 或selput内回填的参数名
          items: [],  //可选，当type为items时必填，type为items时代表在一个单元格内显示多个表单项，数组元素属性与以上一致
          entity: false,  //已禁用，select、combobox、multiple、list选项下是否返回实体类，如果为true则返回整个选项的对象，否则返回valueKey对应的值
          getParams: {},  //可选,getUrl所需要的参数
          single: false,  //可选,当type为list时是否为单选
          valueListCode: '',  //可选，当type为value_list时的值列表code
          colSpan: '',  //可选，自定义搜索项的宽度
          renderOption: (option) => {},  //可选，当类型为select、coombobox、multiple、value_list时选项option的渲染规则
          listKey: '',  //可选，getUrl接口返回值内的变量名，如果接口直接返回数组则置空
          childrenMultipleKey: '' //可选，是否递归遍历子对象
          showTime: false, //可选，当type为date时，控制是否需要选择时间
          allowClear: true //可选，是否允许清除
        }
 */

// SearchArea.propTypes = {
//   searchForm: PropTypes.array.isRequired, // 传入的表单列表
//   submitHandle: PropTypes.func.isRequired, // 搜索事件
//   eventHandle: PropTypes.func, // 表单项点击事件
//   clearHandle: PropTypes.func, // 重置事件
//   okText: PropTypes.oneOfType([PropTypes.string, PropTypes.object]), // 左侧ok按钮的文本
//   clearText: PropTypes.oneOfType([PropTypes.string, PropTypes.object]), // 右侧重置按钮的文本
//   defaultLength: PropTypes.number, // 搜索区域最大表单数量
//   loading: PropTypes.bool, // 用于base-info组件的保存按钮
//   checkboxChange: PropTypes.func, // checkbox表单列表修改时返回选中value事件
//   isExtraFields: PropTypes.bool, // 是否添加额外的自定义搜索参数
//   extraFields: PropTypes.array, // 额外的搜索配置:自己传入节点，不过加了额外的搜索，主要在外面的submitHandle函数里面进行接收
//   isHideClearText: PropTypes.bool, // 是否隐藏清空按钮
//   isHideOkTextText: PropTypes.bool, // 是否隐藏搜索按钮
//   onRef: PropTypes.func, // ref调用子组件函数或者值
//   isReturnLabel: PropTypes.bool, // 用于数据缓存
//   searchCodeKey: PropTypes.string, // 搜索区数据以对象形式存放到redux中,codeKey表示对象的属性,建议用pageCode，具唯一性
// };

SearchArea.defaultProps = {
  defaultLength: 3,
  defaultSpan: 6,
  eventHandle: () => {},
  okText: 'common.search', // 搜索
  clearText: 'common.reset', // 重置
  loading: false,
  isHideClearText: false,
  isHideOkTextText: false,
  extraFields: [],
  checkboxChange: () => {},
  clearHandle: () => {},
  onRef: () => {},
  isExtraFields: false,
  isReturnLabel: false,
  searchCodeKey: '',
};

const WrappedSearchArea = SearchArea;

export const SearchAreaLov = (props) => (
  <SearchArea
    defaultSpan={8}
    defaultLength={props.maxLength || 2}
    formLayout={{ labelCol: { span: 5 }, wrapperCol: { span: 17 } }}
    {...props}
  />
);

export default WrappedForm(WrappedSearchArea);
