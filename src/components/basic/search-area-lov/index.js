/**
 * 用于弹窗中的搜索区
 * TODO: 建议安排时间拆分当前文件, 或者与search-area组件合并，
 * 目前只发现差异在于列维可配置，而search-area组件是定义了col的常量
 */
import React from 'react';

import {
  DownOutlined,
  UpOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import {
  Row,
  Col,
  Input,
  Button,
  DatePicker,
  Radio,
  Checkbox,
  Select,
  Switch,
  Cascader,
  message,
  Spin,
  Form,
} from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { messages } from '@/components/utils';
import LocaleContext from '@/components/locale-lan-provider/context';
import httpFetch from 'share/httpFetch';
import InputNumber from '../../form/input-number';
import SelectPartLoad from '../../form/select-part-load';
import InputLanguage from '../../form/input-language';
import Lov from '../../form/lov';

import './style.less';

const Option = Select.Option;
const RadioButton = Radio.Button;
const CheckboxGroup = Checkbox.Group;
const { MonthPicker, RangePicker } = DatePicker;

let needBlurValidate = true;

/**
 * 搜索区域组件
 * @params searchForm   渲染表单所需要的配置项，见底端注释
 * @params checkboxListForm   渲染checkbox表单列表所需要的配置项，见底端注释
 * @params submitHandle  点击搜索时的回调
 * @params clearHandle  点击重置时的回调
 * @params eventHandle  表单项onChange事件，于searchForm内的event有联动，见底端注释
 * @params okText  搜索按钮的文字
 * @params clearText  重置按钮的文字
 * @params maxLength  最大项数，如果超过则隐藏支展开菜单中
 * @params loading  搜索按钮的loading状态
 * TODO: 选项render函数、searchUrl和getUrl的method区分
 */
class SearchAreaLov extends React.Component {
  formRef = React.createRef();
  static contextType = LocaleContext;
  constructor(props) {
    super(props);
    this.state = {
      expand: this.props.searchForm.expand,
      searchForm: [],
      checkboxListForm: [],
    };
    //  防抖函数   三个参数
    // leading，函数在每个等待时延的开始被调用，默认值为false
    // trailing，函数在每个等待时延的结束被调用，默认值是true
    // maxwait，最大的等待时间，因为如果debounce的函数调用时间不满足条件，可能永远都无法触发，因此增加了这个配置，保证大于一段时间后一定能执行一次函数
    this.setOptionsToFormItem = _.debounce(this.setOptionsToFormItem, 250);
  }

  componentWillMount() {
    this.props.searchForm.map((item) => {
      if (
        item.type === 'select' &&
        item.defaultValue &&
        item.defaultValue.key
      ) {
        item.options = [
          {
            label: item.defaultValue.label,
            value: item.defaultValue.key,
            temp: true,
          },
        ];
      }
    });
    this.setState({
      searchForm: this.props.searchForm,
      checkboxListForm: this.props.checkboxListForm,
    });
    this.getRangeField(this.props.searchForm);
  }

  componentDidMount() {
    if (this.props.onRef) {
      this.props.onRef(this);
    }
  }

  componentWillReceiveProps = (nextProps) => {
    let { searchForm } = this.state;
    nextProps.searchForm.map((item) => {
      if (item.type === 'select') {
        searchForm.map((form) => {
          if (form.id === item.id) {
            if (
              form.options.length === 0 &&
              item.defaultValue &&
              item.defaultValue.key
            ) {
              item.options = [
                {
                  label: item.defaultValue.label,
                  value: item.defaultValue.key,
                  temp: true,
                },
              ];
            } else {
              item.options = form.options;
            }
          }
        });
      }
    });
    this.setState(
      {
        searchForm: nextProps.searchForm,
        expand: nextProps.searchForm.expand ? true : this.state.expand,
      },
      () => {
        this.getRangeField(nextProps.searchForm);
        nextProps.searchForm.expand = false;
        let tags = document.getElementsByClassName(
          'antd-pro-tag-select-tagSelect',
        );
        for (let i = 0; i < tags.length; i++) {
          if (
            tags[i].getElementsByClassName('ant-tag')[0].innerHTML !==
            messages('common.all', { context: this.context })
          )
            tags[i].getElementsByClassName('ant-tag')[0].innerHTML = messages(
              'common.all',
              { context: this.context },
            );
        }
      },
    );
  };

  // 日期从、至禁选范围
  getDisabledDateRange = (curTime, item) => {
    const { dateRangeField } = this.state;
    if (item.dateFrom) {
      const dateToField = dateRangeField[item.dateFrom].dateTo.key;
      const dateTo = this.formRef.current.getFieldValue(dateToField);
      return dateTo ? curTime.isAfter(dateTo, 'day') : false;
    } else if (item.dateTo) {
      const dateFromField = dateRangeField[item.dateTo].dateFrom.key;
      const dateFrom = this.formRef.current.getFieldValue(dateFromField);
      return dateFrom ? curTime.isBefore(dateFrom, 'day') : false;
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
    newSearchForm.map((item) => {
      if (item.type === 'items' && Array.isArray(item.items)) {
        this.setValidateField(item);
        item.items.map((field) => {
          this.getItemField(
            amountRangeField,
            dateRangeField,
            numberField,
            field,
          );
        });
      } else {
        this.getItemField(amountRangeField, dateRangeField, numberField, item);
      }
    });
    this.setState({ amountRangeField, dateRangeField, numberField });
  };

  // 日期金额从至，有items, 具有属性，validateTime，validateAmount，进行校验
  setValidateField = (item) => {
    if (item.validateTime) {
      item.items[0].dateFrom = item.id;
      item.items[1].dateTo = item.id;
    } else if (item.validateAmount) {
      item.items[0].amountFrom = item.id;
      item.items[1].amountTo = item.id;
    }
  };

  // 判断type为items
  getItemField = (amountRangeField, dateRangeField, numberField, item) => {
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
  };
  // 校验 金额从/至, 日期从/至
  rangeValidate = (values) => {
    const { amountRangeField, numberField } = this.state;
    let result = true;
    Object.values(amountRangeField).map((item) => {
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
            }) /**不能小于 */
          }${item.amountFrom.label}`,
        );
        result = false;
      }
    });
    Object.values(numberField).map((item) => {
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
      const {
        current: { getFieldsValue },
      } = this.formRef;
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
              `${amountToField.label}不能小于${amountFromField.label}`,
            );
          } else {
            needBlurValidate = true;
          }
        }, 200);
      }
    }
  };

  //收起下拉
  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  };

  //checkbox收起下拉
  checkboxToggle = (item) => {
    let checkboxListForm = this.state.checkboxListForm;
    checkboxListForm.map((list) => {
      list.items.map((listItem) => {
        listItem.key === item.key && (listItem.expand = !listItem.expand);
      });
    });
    this.setState({ checkboxListForm });
  };

  //checkbox改变
  onCheckChange = (id, key, checked) => {
    let checkboxListForm = this.state.checkboxListForm;
    let checkedList = [];
    checkboxListForm.map((list) => {
      if (list.id === id) {
        list.items.map((item) => {
          if (item.key === key) {
            item.checked = checked;
          }
          checkedList.push(item);
        });
      }
    });
    this.props.checkboxChange(id, checkedList);
    this.setState({ checkboxListForm });
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
    if (e) e.preventDefault();
    this.formRef.current
      .validateFields()
      .then((values) => {
        if (!this.rangeValidate(values)) return; // 校验 金额从/至, 日期从/至

        let searchForm = [].concat(this.state.searchForm);
        searchForm.map((item) => {
          if (values[item.id] && item.entity) {
            if (item.type === 'value_list' || item.type === 'select') {
              values[item.id] =
                values[item.id] instanceof Object
                  ? values[item.id].key || values[item.id].value
                  : values[item.id];
            }
            if (item.type === 'combobox') {
              //解决预算日志记账类型bug添加
              values[item.id] = JSON.parse(values[item.id].title);
            } else if (item.type === 'multiple') {
              let result = [];
              values[item.id].map((value) => {
                result.push(JSON.parse(value.title));
              });
              values[item.id] = result;
            }
          }
          //把上传的图片，赋值给value
          if (
            item.type.toLowerCase() === 'img' ||
            item.type.toLowerCase() === 'image'
          ) {
            //如果有上传
            if (item._file && item._file.id) {
              values[item.id] = item._file;
            }
          }
          if (item.type === 'list' && values[item.id]) {
            if (item.entity) {
              let result = [];
              values[item.id].map((value) => {
                result.push(value);
              });
              values[item.id] = result;
            } else {
              let result = [];
              values[item.id].map((value) => {
                result.push(value[item.valueKey]);
              });
              values[item.id] = result;
            }
          }
          if (item.type === 'lov' && values[item.id]) {
            const { returnMoreData } = this.props;
            if (item.single) {
              if (!returnMoreData) {
                values[item.id] = values[item.id][item.valueKey];
              } else {
                values[item.id] = {
                  value: values[item.id][item.valueKey],
                  label: values[item.id][item.labelKey],
                };
              }
            } else {
              let result;
              if (!returnMoreData) {
                result = values[item.id].map((value) => {
                  return value[item.valueKey];
                });
              } else {
                result = values[item.id].map((value) => {
                  return {
                    value: value[item.valueKey],
                    label: value[item.labelKey],
                  };
                });
              }
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
            this.props.isReturnLabel &&
            (values[item.id] ||
              values[item.id] === false ||
              values[item.id] === 0)
          ) {
            if (
              item.type === 'combobox' ||
              item.type === 'select' ||
              item.type === 'value_list'
            ) {
              item.options.map((option) => {
                if (
                  option.value + '' == values[item.id] ||
                  option.value == values[item.id]
                ) {
                  values[`${item.id}Lable`] = option.value;
                  values[`${item.id}Option`] = [
                    { label: option.label, value: option.value },
                  ];
                }
              });
            } else if (item.type === 'multiple') {
              let result = [];
              let options = [];
              item.options.map((option) => {
                values[item.id].map((id) => {
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
          if (item.type === 'input' && item.language) {
            values.i18n = {};
            values.i18n[item.id] = values[item.id].i18n;
            values[item.id] = values[item.id].value;
          }
        });
        this.state.checkboxListForm &&
          this.state.checkboxListForm.map((list) => {
            if (!list.single) {
              values[list.id] = [];
              list.items &&
                list.items.map((item) => {
                  if (this.props.isReturnLabel) values[`${list.id}Lable`] = [];
                  if (this.props.isReturnLabel)
                    values[`${list.id}Expand`] = item.expand;
                  item.checked &&
                    item.checked.map((value) => {
                      values[list.id].push(value);
                      if (this.props.isReturnLabel)
                        values[`${list.id}Lable`].push(value);
                    });
                });
            }
          });
        if (this.props.isReturnLabel) values['expand'] = this.state.expand;
        this.props.submitHandle(values);
      })
      .catch((err) => {
        err.name && this.setState({ validateStatus: true });
      });
  };

  //点击重置的事件，清空值为初始值
  handleReset = () => {
    needBlurValidate = false;
    this.clearSearchAreaSelectData();
    this.props.clearHandle && this.props.clearHandle();
  };

  //清除searchArea选择数据
  clearSearchAreaSelectData = () => {
    this.formRef.current.resetFields();
    this.state.checkboxListForm &&
      this.state.checkboxListForm.map((list) => {
        if (!list.single) {
          list.items.map((item) => {
            item.checked = [];
          });
        }
      });
  };

  //区域点击事件，返回事件给父级进行处理
  handleEvent = (e, item) => {
    let result = null;
    if (e) {
      if (
        item.entity &&
        (item.type === 'value_list' ||
          item.type === 'select' ||
          item.type === 'combobox')
      ) {
        item.options.map((option) => {
          // 部分接口 返回参数 用的是value而不是code导致原本判断有误
          const isCode = 'code' in option.data;
          if (
            option.data[
              item.type === 'value_list'
                ? isCode
                  ? 'code'
                  : 'value'
                : item.valueKey
            ] === e.key
          )
            result = option.data;
        });
      } else if (item.entity && item.type === 'multiple') {
        result = [];
        e.map((value) => {
          item.options.map((option) => {
            if (
              option.data[
                item.type === 'value_list' ? 'code' : item.valueKey
              ] === value.key
            )
              result.push(option.data);
          });
        });
      } else {
        if (item.type === 'switch') result = e.target.checked;
        else result = e ? (e.target ? e.target.value : e) : null;
      }
    }
    let valuesTmp;

    const values = this.formRef.current.getFieldsValue();

    let searchForm = [].concat(this.state.searchForm);
    searchForm.map((item) => {
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
          let result = [];
          values[item.id].map((value) => {
            result.push(JSON.parse(value.title));
          });
          values[item.id] = result;
        }
      }
      //把上传的图片，赋值给value
      if (
        item.type.toLowerCase() === 'img' ||
        item.type.toLowerCase() === 'image'
      ) {
        //如果有上传
        if (item._file && item._file.id) {
          values[item.id] = item._file;
        }
      }
      if (item.type === 'list' && values[item.id]) {
        if (item.entity) {
          let result = [];
          values[item.id].map((value) => {
            result.push(value);
          });
          values[item.id] = result;
        } else {
          let result = [];
          values[item.id].map((value) => {
            result.push(value[item.valueKey]);
          });
          values[item.id] = result;
        }
      }

      if (values[item.id] && this.props.isReturnLabel) {
        if (
          item.type === 'combobox' ||
          item.type === 'select' ||
          item.type === 'value_list'
        ) {
          item.options.map((option) => {
            if (option.value === values[item.id]) {
              values[`${item.id}Lable`] = option.label;
            }
          });
        } else if (item.type === 'multiple') {
          let result = [];
          item.options.map((option) => {
            values[item.id].map((id) => {
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
    this.state.checkboxListForm &&
      this.state.checkboxListForm.map((list) => {
        if (!list.single) {
          values[list.id] = [];
          list.items &&
            list.items.map((item) => {
              if (this.props.isReturnLabel) values[`${list.id}Lable`] = [];
              item.checked &&
                item.checked.map((value) => {
                  values[list.id].push(value);
                  if (this.props.isReturnLabel)
                    values[`${list.id}Lable`].push(value);
                });
            });
        }
      });
    valuesTmp = values;
    this.props.eventHandle(item.event, result, valuesTmp);
  };

  getDataLabel(data, keys) {
    let isMatch = false;
    keys = keys.replace(/\$\{(.*?)\}/g, (target, value) => {
      isMatch = true;
      return this.getValue(data, value) || '';
    });

    if (isMatch) {
      return keys;
    } else {
      return this.getValue(data, keys) || '';
    }
  }

  getValue = (data, key) => {
    let result = JSON.stringify(data);
    return new Function(`try {return ${result}.${key} } catch(e) {}`)();
  };

  getLastKey(key) {
    return key.split('.')[key.split('.').length - 1];
  }

  //给select增加options
  getOptions = (item) => {
    if (
      item.options.length === 0 ||
      (item.options.length === 1 && item.options[0].temp)
    ) {
      let url = item.getUrl;
      let tempForm = this.state.searchForm;
      tempForm = tempForm.map((searchItem) => {
        if (searchItem.id === item.id) {
          searchItem.fetching = true;
          searchItem.hasGetList = true;
        }
        if (searchItem.type === 'items')
          searchItem.items.map((subItem) => {
            if (subItem.id === item.id) {
              subItem.fetching = true;
              searchItem.hasGetList = true;
            }
          });
        return searchItem;
      });
      this.setState({ searchForm: tempForm });
      httpFetch[item.method](url, item.getParams).then((res) => {
        let options = [];
        let data = res.data;
        if (item.dataKey && typeof data === 'object') {
          let result = JSON.stringify(data);
          data = new Function(
            `try {return ${result}.${item.dataKey} } catch(e) {}`,
          )();
        }

        item.listKey &&
          item.listKey.split('.').map((key) => {
            data = data[key];
          });

        data.map((data) => {
          let label = this.getDataLabel(data, item.labelKey);

          options.push({
            label: item.renderOption ? item.renderOption(data) : label,
            value: data[this.getLastKey(item.valueKey)],
            data: data,
          });
        });
        let searchForm = this.state.searchForm;
        searchForm = searchForm.map((searchItem) => {
          if (searchItem.id === item.id) {
            searchItem.options = options;
            searchItem.fetching = false;
          }
          if (searchItem.type === 'items')
            searchItem.items.map((subItem) => {
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

  //得到值列表的值增加options
  getValueListOptions = (item) => {
    if (
      item.options.length === 0 ||
      (item.options.length === 1 && item.options[0].temp)
    ) {
      this.getSystemValueList(item.valueListCode).then((res) => {
        let options = [];
        res.data.values.map((data) => {
          options.push({
            label: item.renderOption ? item.renderOption(data) : data.name,
            value: data.value || data.code,
            data: data,
          });
        });
        let searchForm = this.state.searchForm;
        searchForm = searchForm.map((searchItem) => {
          if (searchItem.id === item.id) searchItem.options = options;
          if (searchItem.type === 'items')
            searchItem.items.map((subItem) => {
              if (subItem.id === item.id) subItem.options = options;
            });
          return searchItem;
        });
        this.setState({ searchForm });
      });
    }
  };

  //根据接口返回数据重新设置options
  setOptionsToFormItem = (item, url, key) => {
    let params = item.getParams ? item.getParams : {};
    if (key) {
      params[item.searchKey] = key;
    }

    if ((key !== undefined && key !== '') || key === undefined) {
      httpFetch[item.method](url, params).then((res) => {
        let options = [];
        let dealData = (dataList) => {
          item.listKey &&
            item.listKey.split('.').map((key) => {
              dataList = dataList[key];
            });
          dataList.map((data) => {
            let label = this.getDataLabel(data, item.labelKey);
            options.push({
              label: item.renderOption ? item.renderOption(data) : label,
              value: data[this.getLastKey(item.valueKey)],
              data: data,
            });
            if (data.hasOwnProperty(item.childrenMultipleKey)) {
              dealData(data[item.childrenMultipleKey]);
            }
          });
        };
        dealData(res.data);
        let searchForm = this.state.searchForm;
        searchForm = searchForm.map((searchItem) => {
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
    if (!value.value) return;
    let valueWillSet = {};
    let searchForm = this.state.searchForm;
    if (index === undefined)
      searchForm = searchForm.map((searchItem) => {
        if (searchItem.id === item.id) {
          valueWillSet[searchItem.id] = item.entity
            ? { key: value.value, label: value.label }
            : value.value + '';
          if (
            searchItem.options.length === 0 ||
            (searchItem.options.length === 1 && searchItem.options[0].temp)
          ) {
            let dataOption = {};
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
      searchForm[index].items = searchForm[index].items.map(
        (searchItem, index) => {
          if (searchItem.id === item.id) {
            valueWillSet[searchItem.id] = searchItem.entity
              ? {
                  key: value[index].value,
                  label: value[index].label,
                }
              : value[index].value + '';
            if (
              searchItem.options.length === 0 ||
              (searchItem.options.length === 1 && searchItem.options[0].temp)
            ) {
              let dataOption = {};
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
        },
      );
    this.setState({ searchForm }, () => {
      this.formRef.current.setFieldsValue(valueWillSet);
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
    Object.keys(options).map((key) => {
      let searchForm = [].concat(this.state.searchForm);
      searchForm.map((searchItem, index) => {
        if (searchItem.id === key) {
          if (
            (searchItem.type === 'select' ||
              searchItem.type === 'value_list') &&
            (typeof options[key] === 'object' || options[key].splice)
          )
            this.onSetSelectValue(searchItem, options[key]);
          else if (searchItem.type === 'list') {
            let value = {};
            value[key] = options[key];
            this.formRef.current.setFieldsValue(value);
          } else if (searchItem.type === 'date') {
            let value = {};
            value[key] = options[key] ? moment(options[key]) : undefined;
            this.formRef.current.setFieldsValue(value);
          } else if (searchItem.type === 'switch') {
            let value = {};
            value[key] = options[key];
            this.formRef.current.setFieldsValue(value);
          } else {
            let value = {};
            value[key] = options[key] ? options[key] + '' : undefined;
            this.formRef.current.setFieldsValue(value);
          }
        } else if (searchItem.type === 'items') {
          searchItem.items.map((subItem) => {
            if (subItem.id === key) {
              if (
                (subItem.type === 'select' || subItem.type === 'value_list') &&
                typeof options[key] === 'object'
              )
                this.onSetSelectValue(subItem, options[key], index);
              else if (subItem.type === 'list') {
                let value = {};
                value[key] = options[key];
                this.formRef.current.setFieldsValue(value);
              } else if (subItem.type === 'date') {
                let value = {};
                value[key] = options[key] ? moment(options[key]) : undefined;
                this.formRef.current.setFieldsValue(value);
              } else if (subItem.type === 'switch') {
                let value = {};
                value[key] = options[key];
                this.formRef.current.setFieldsValue(value);
              } else {
                let value = {};
                value[key] = options[key] ? options[key] + '' : undefined;
                this.formRef.current.setFieldsValue(value);
              }
            }
          });
        }
      });
    });
  };

  //把上传的图片，绑定到对应的字段上
  handleUploadImageChange = (file, id) => {
    let searchForm = this.state.searchForm;
    let _file = file[0];
    for (let i = 0; i < searchForm.length; i++) {
      if (id === searchForm[i].id) {
        searchForm[i]._file = _file;
      }
    }
  };

  // 固定下拉菜单
  getParentContainer = (node) => node.parentNode;

  //渲染搜索表单组件
  renderFormItem(item) {
    let handle = item.event
      ? (event) => this.handleEvent(event, item)
      : () => {};
    if (
      item.type.toLowerCase() === 'img' ||
      item.type.toLowerCase() === 'image'
    ) {
      item.type = 'img';
    }
    switch (item.type) {
      case 'img': {
        return (
          <div>
            <ImageUpload
              pkName="INVOICE_IMAGES"
              defaultFileList={[]}
              onChange={(file) => {
                this.handleUploadImageChange(file, item.id);
              }}
              maxNum={1}
            />
          </div>
        );
      }
      //输入组件
      case 'input': {
        if (item.language)
          return (
            <InputLanguage
              name={item.name}
              disabled={item.disabled}
              onPressEnter={this.handleSearch}
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
            onPressEnter={this.handleSearch}
          />
        );
      }
      //输入金额组件组件
      case 'inputNumber': {
        let min = item.min ? {} : { min: 0 };
        return (
          <InputNumber
            style={{ width: '100%' }}
            precision={item.precision === undefined ? 2 : item.precision}
            {...min}
            step={item.step === undefined ? 0.01 : item.step}
            placeholder={
              item.placeholder ||
              messages('common.please.enter', { context: this.context })
            }
            onChange={handle}
            disabled={item.disabled}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                this.handleSearch();
              }
            }}
            onBlur={(e) => this.inputNumberBlur(e, item)}
          />
        );
      }
      //选择组件
      case 'select': {
        if (item.getUrl && item.defaultGetList && !item.hasGetList) {
          this.getOptions(item);
        }
        return (
          <Select
            placeholder={
              item.placeholder ||
              messages('common.please.select', { context: this.context })
            }
            onChange={handle}
            allowClear={item.allowClear == undefined ? true : item.allowClear}
            disabled={item.disabled}
            labelInValue={!!item.entity}
            onDropdownVisibleChange={
              item.getUrl ? (open) => open && this.getOptions(item) : () => {}
            }
            notFoundContent={
              item.fetching ? (
                <Spin size="small" />
              ) : (
                messages('common.no.matching.result', { context: this.context })
              )
            }
            getPopupContainer={this.getParentContainer}
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
      //级联选择
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
            disabled={item.disabled === undefined ? false : item.disabled}
            lazyLoad
            showPagination={false} // 分页并且每次都加载下一页都数据补充到原本到option中
            onChange={handle}
          />
        );
      }
      //值列表选择组件
      case 'value_list': {
        return (
          <Select
            placeholder={
              item.placeholder ||
              messages('common.please.select', { context: this.context })
            }
            onChange={handle}
            allowClear={!item.clear}
            disabled={item.disabled}
            labelInValue={!!item.entity}
            onDropdownVisibleChange={(open) =>
              open && this.getValueListOptions(item)
            }
            getPopupContainer={this.getParentContainer}
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
      //月份组件
      case 'month': {
        let monthFormat = 'YYYY/MM';
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
          />
        );
      }
      //日期组件
      case 'date': {
        let formatValue = item.showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD';
        return (
          <DatePicker
            disabledDate={(cur) => this.getDisabledDateRange(cur, item)}
            format={formatValue}
            onChange={handle}
            disabled={item.disabled}
            showTime={item.showTime}
            placeholder={
              item.placeholder ||
              messages('common.please.select', { context: this.context })
            }
            getCalendarContainer={this.getParentContainer}
          />
        );
      }
      //日期
      case 'datePicker': {
        return (
          <RangePicker
            format="YYYY-MM-DD"
            onChange={handle}
            disabled={item.disabled}
            // disabledDate={date => { return date && date.valueOf() > new Date().getTime()}}
            getCalendarContainer={this.getParentContainer}
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
            getCalendarContainer={this.getParentContainer}
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
            getCalendarContainer={this.getParentContainer}
          />
        );
      }
      //单选组件
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
      //单选组件（大）
      case 'big_radio': {
        return (
          <Radio.Group size="large" onChange={handle} disabled={item.disabled}>
            {item.options.map((option) => {
              return (
                <RadioButton value={option.value} key={option.value}>
                  {option.label}
                </RadioButton>
              );
            })}
          </Radio.Group>
        );
      }
      //选择框
      case 'checkbox': {
        return (
          <CheckboxGroup
            options={item.options}
            onChange={handle}
            disabled={item.disabled}
          />
        );
      }
      //带搜索的选择组件
      case 'combobox': {
        return (
          <Select
            labelInValue={!!item.entity}
            showSearch
            allowClear
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
      //带搜索的多选组件
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
      //弹出框列表选择组件
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
            showClear={item.clear}
            onChange={handle}
            labelKey={this.getLastKey(item.labelKey)}
            valueKey={this.getLastKey(item.valueKey)}
            listExtraParams={item.listExtraParams}
            selectorItem={item.selectorItem}
            method={item.method}
            single={item.single}
            lovType="chooser"
          />
        );
      }
      //弹出框列表选择组件
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
            paramAsBody={item.paramAsBody}
            single={item.single}
            allowClear={item.allowClear || !item.isRequired}
          />
        );
      }
      //switch状态切换组件
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
      case 'selput': {
        return (
          <Selput
            onChange={handle}
            placeholder={item.placeholder}
            type={item.listType}
            listExtraParams={item.listExtraParams}
            selectorItem={item.selectorItem}
            valueKey={item.valueKey}
            disabled={item.disabled}
          />
        );
      }
      //同一单元格下多个表单项组件
      case 'items': {
        let colSpan = this.getItemCol(item);
        return (
          <Row gutter={10} key={item.id}>
            {item.label ? (
              <Col span={item.labelCol || 4}>
                <label className="item-label">{item.label}</label>
              </Col>
            ) : (
              ''
            )}
            {item.items.map((searchItem, index, arr) => {
              return (
                <Col
                  span={colSpan}
                  key={searchItem.id}
                  style={
                    index === 0
                      ? { paddingRight: 20 }
                      : index === arr.length - 1
                      ? { paddingLeft: 20 }
                      : undefined
                  }
                >
                  <Form.Item
                    label={searchItem.label}
                    colon={false}
                    initialValue={this.getDefaultValue(searchItem)}
                    name={searchItem.id}
                    rules={[
                      {
                        required: searchItem.isRequired,
                        message: messages('common.can.not.be.empty', {
                          params: { name: searchItem.label },
                          context: this.context,
                        }), //name 不可为空
                      },
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
    }
  }

  getItemCol = (item) => {
    let length = +item.items.length;
    return item.label
      ? parseInt(`${(24 - item.labelCol) / length}`)
      : parseInt(`${24 / length}`);
  };

  getFields() {
    const count = this.state.expand
      ? this.state.searchForm.length
      : this.props.maxLength;

    const { getFieldValue } = this.formRef?.current || {};
    const formLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 17 },
    };
    const formItemLayout = this.props.formItemLayout
      ? this.props.formItemLayout
      : formLayout;

    const children = [];
    this.state.searchForm.map((item, i) => {
      children.push(
        <Col
          span={item.span ? item.span : 8}
          key={item.id}
          style={{ display: i < count ? 'block' : 'none' }}
        >
          {item.type === 'items' ? (
            this.renderFormItem(item)
          ) : (
            <Form.Item
              {...formItemLayout}
              label={item.label}
              name={item.id}
              valuePropName={item.type === 'switch' ? 'checked' : 'value'}
              initialValue={this.getDefaultValue(item)}
              rules={
                item.rules
                  ? item.rules
                  : [
                      {
                        required: item.isRequired,
                        message: messages('common.can.not.be.empty', {
                          params: { name: item.label },
                          context: this.context,
                        }), //name 不可为空
                      },
                    ]
              }
            >
              {this.renderFormItem(item)}
              {item.type === 'switch' && item.linkageText ? (
                <span style={{ marginLeft: 8 }}>
                  {item.linkageText[String(!!getFieldValue(item.id))]}
                </span>
              ) : null}
            </Form.Item>
          )}
        </Col>,
      );
    });
    children.push(this.getExtraFields());

    children.push(
      <Col
        span={
          this.state.expand
            ? 24
            : this.props.btnCol ?? (this.props.maxLength > 2 ? 6 : 8)
        }
        key={-1}
        style={{ textAlign: 'right', marginBottom: 24 }}
      >
        {this.state.searchForm.length > this.props.maxLength ? (
          <a className="toggle-button" onClick={this.toggle}>
            {this.state.expand
              ? messages('common.fold', { context: this.context })
              : messages('common.expand', { context: this.context })}
            {this.state.expand ? <UpOutlined /> : <DownOutlined />}
          </a>
        ) : null}
        {this.props.isHideOkTextText ? (
          ''
        ) : (
          <Button
            type="primary"
            onClick={this.handleSearch}
            loading={this.props.loading}
          >
            {messages(this.props.okText, { context: this.context })}
          </Button>
        )}

        {this.props.isHideClearText ? (
          ''
        ) : (
          <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
            {messages(this.props.clearText, { context: this.context })}
          </Button>
        )}
      </Col>,
    );
    return children;
  }

  getDefaultValue = (item) => {
    if (
      item.type === 'select' &&
      item.defaultValue &&
      !item.entity &&
      item.defaultValue.key
    )
      return item.defaultValue.key;
    else return item.defaultValue;
  };

  getExtraFields() {
    //要使用extraFields，<Col span={8}设置为8,不然无法对齐
    const children = [];
    if (
      this.props.isExtraFields &&
      this.props.extraFields &&
      this.props.extraFields.length > 0
    ) {
      this.props.extraFields.map((item, i) => {
        children.push(
          <Col span={8} key={i + 'extraFields'}>
            {this.props.extraFields[i]}
          </Col>,
        );
      });
      return children;
    } else {
      return <div key="extraFields" />;
    }
  }

  render() {
    return (
      <div
        style={{ position: 'relative', clear: 'both', width: '100%' }}
        id="search-area-lov"
      >
        <Form
          className="ant-advanced-search-form search-area"
          ref={this.formRef}
        >
          <div>
            <Row gutter={40} type="flex" align="top">
              {this.getFields()}
            </Row>
          </div>
        </Form>
      </div>
    );
  }
}

/**
 *
 * @type searchForm 表单列表，如果项数 > maxLength 则自动隐藏多余选项到下拉部分，每一项的格式如下：
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

/**
 *
 * @type checkboxListForm checkbox表单列表，每一项的格式如下：
 * {
      id: '',     //必填，表单id，搜索后返回的数据key
      single: false,  //可选，是否单选
      items: [{label: '', key: '', options: [{label: '',  value: '', disabled: false}]}], //必填，详见下
   }
 *
 * @param items
 * {
      label: '',   //必填，每行列表的label显示
      key: '',    //必填，唯一，每行的标识
      checked: [],    //可选，默认选中的value值
      options: [{label: '',  value: '', disabled: false}]  //必填，checkbox可选项
   }
 */
SearchAreaLov.defaultProps = {
  maxLength: 2,
  eventHandle: () => {},
  okText: 'common.search', //搜索
  clearText: 'common.reset', //重置
  loading: false,
  isHideClearText: false,
  isHideOkTextText: false,
  checkboxChange: () => {},
};

export default SearchAreaLov;
