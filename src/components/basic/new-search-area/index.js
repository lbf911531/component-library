/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-05-18 14:34:39
 * @LastEditors: binfeng.long@hand-china.com
 * @LastEditTime: 2021-11-29 18:01:42
 * @Version: 1.0.0
 * @Description:
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */
import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
} from 'react';
import {
  SearchOutlined,
  CloseCircleFilled,
  EllipsisOutlined,
  CaretDownOutlined,
} from '@ant-design/icons';
import {
  Select,
  Divider,
  Row,
  Col,
  message,
  Button,
  Menu,
  Dropdown,
  Modal,
  Tag,
  Tooltip,
  Form,
} from 'antd';
import moment from 'moment';
import { useDebounceFn } from 'ahooks';
import { messages } from '../../utils';
import WrapperForm from '../../wrapped-form';
import SearchFormItem from './search-form-item';
import {
  getLastKey,
  haveAValue,
  isNumber,
  getCacheValueFromRedux,
  customStringify,
} from './utils';
import AllIcon from './images/all.js';
import Service from './service';
import NewSolutionBubble from './save-solution-bubble';
import DynamicSelFieldBtn from './dynamic-select-field';
import NewFilterConditions from './new-filter-condition';
import RefreshSvg from './images/refresh';
import DoubleArrowSvg from './images/doubleArrow';
import ResetSvg from './images/reset';
import CircleCloseSvg from './images/circleClose';
import { cloneDeep } from 'lodash';

import './style.less';

let needBlurValidate = true; // 是否需要在blur时校验，点击搜索、清空的同时不要校验

function SearchArea(props) {
  const formRef = useRef({});
  const {
    style,
    searchForm,
    extraSearch,
    isReturnLabel,
    refInstance,
    uniqueKey,
    selectAll = true,
    hideDynamicSelFieldBtn = false,
  } = props;

  // 切换与旋转的参数
  const [expand, setExpand] = useState(true);
  const [rotate, setRotate] = useState(0);
  // searchForm 需要固定的字段
  const [fixedSearchForm, setFixedSearchForm] = useState([]);
  // searchForm 其他字段
  const [dySearchForm, setDySearchForm] = useState([]);
  const [time, setTime] = useState(null);
  // 收集设定了金额从至校验的字段
  const [amountRangeField, setAmountRangeField] = useState({});
  // 收集日期从至校验的字段
  const [dateRangeField, setDateRangeField] = useState({});
  const [numberField, setNumberField] = useState({});

  // 记录搜索后拥有了值的搜索字段
  const [defaultFields, setDefaultFields] = useState([]);
  // 记录配置的搜索区数据，在这里会将内部维护的下拉框等类型的options设置到这里，方便搜索，联动事件使用
  const [_searchForm, setSearchForm] = useState([...searchForm]);

  const cacheLock = useRef(false);
  // 保存当前筛选条件 modal 显隐
  const [formValue, setFormValue] = useState({});
  // select 组件的值
  const [solution, setCurSolution] = useState('all');
  // 内置一个全量查找的选项， conditions由预置的与用户自定义保存的数据组成
  const defaultConditionList = [
    { label: messages('common.all' /* 全部 */), value: 'all' },
  ];
  const [conditions, setConditions] = useState(defaultConditionList);
  const [editInfo, setEditInfo] = useState({
    visible: false,
    info: [],
    value: {},
  });
  const [changeFlag, setChangeFlag] = useState(false);
  const filterBtn = useRef();
  // 用来保存 fixed 固定字段的值
  const fixedFieldIdList = useRef();
  // 收集 表单控件对应类型的失焦事件
  const blurEventMap = {
    inputNumber: handleInputNumberBlurEvent,
    date: handleDateBlurEvent,
  };
  const originSearchForm = useRef();
  const isRefresh = useRef(false); // 是否重新改变 searchForm

  useEffect(() => {
    // 从redux中取全量方案，如果没有，就执行接口调用
    originSearchForm.current = cloneDeep(searchForm);
    Promise.resolve()
      .then(() => {
        handleFormatSearchForm(searchForm);
      })
      .then(() => {
        handleGetAllConditions(true);
      });
    return () => {
      setChangeFlag(false);
    };
  }, []);

  useEffect(() => {
    // 根据props.searchForm中成员是否有默认值分类为固定字段，动态字段
    handleSetDefaultValue(searchForm);
  }, [searchForm]);

  useEffect(() => {
    return () => {
      if (!cacheLock.current) {
        handleClearSearchAreaData();
      }
    };
  }, []);

  useImperativeHandle(refInstance, () => ({
    setValues,
    handleCache,
    handleClear,
    clearSearchAreaData: handleClearSearchAreaData,
    clearSearchAreaSelectData: handleClearSearchAreaData,
    form: formRef.current,
    handleSearch,
    clearHandle,
    resetSearchForm,
    getCacheListValue,
    getFieldListValue,
  }));

  /**
   * 获取当前页面的搜索区缓存值
   * @param {string} field 指定获取缓存中的某个字段值，如不传则取整个缓存对象
   * @returns
   */
  function getCacheListValue(field) {
    const { cacheLock: tempCacheLock, defaultSearchValue } =
      getCacheValueFromRedux(props.searchCodeKey);

    if (tempCacheLock) {
      if (field) return defaultSearchValue[field];
      return defaultSearchValue;
    }
    return undefined;
  }

  /**
   * 取当前表单的值
   * @param {*} params
   * @returns
   */
  function getFieldListValue(params) {
    return formRef.current.getFieldsValue(params);
  }

  /**
   * 根据props.searchForm 进行分类处理，必输且有默认值的作为固定字段渲染
   * 其他的作为动态字段，选取
   * @param {array} searchFormList
   */
  function handleFormatSearchForm(searchFormList) {
    if (Array.isArray(searchFormList)) {
      const fixedFormItems = [];
      const tempFixedFormIds = [];
      let dynamicFormItems = [];
      const tempFormItems = flattenArray(searchFormList);
      tempFormItems.forEach((formItem) => {
        // 存在默认值，或默认值为false,0之流，或设定isFixed === true, 如果isFixed为false则一定不是
        if (
          (formItem.isRequired &&
            formItem.isFixed !== false &&
            haveAValue(formItem.defaultValue)) ||
          formItem.isFixed
        ) {
          fixedFormItems.push(formItem);
          tempFixedFormIds.push(formItem.id);
        } else if (formItem.type === 'items') {
          dynamicFormItems = dynamicFormItems.concat(formItem.items);
        } else dynamicFormItems.push(formItem);
      });
      setFixedSearchForm(fixedFormItems);
      fixedFieldIdList.current = tempFixedFormIds;
      setDySearchForm(dynamicFormItems);
      // 收集 需要级联校验的字段
      handleGetRangeField();
    }
  }

  /**
   * 控制展开，收缩
   */
  function handleExpand() {
    setExpand((pre) => !pre);
  }

  /**
   * 控制刷新旋转
   */
  function handleRotate() {
    let nextNum = rotate;
    setRotate((nextNum += 360));

    handleSearch();
  }

  /**
   * 清空 搜索区条件
   */
  function clearHandle() {
    const originSearchFormValue = extraSearch
      ? {
          [extraSearch.id]: undefined,
        }
      : {};
    if (originSearchForm.current.length === searchForm.length) {
      // originSearchForm 如果与 searchForm 的长度一样，代表没有动态新添加字段
      flattenArray(originSearchForm.current).forEach((item) => {
        originSearchFormValue[item.id] = item.defaultValue?.key
          ? item.defaultValue.key
          : item.defaultValue?.value
          ? item.defaultValue.value
          : item.defaultValue;
      });
    } else {
      // 如果不一样长，则代表新添加了字段，这里只能将新添加字段的值直接清空，不能像原本就有的字段那样能回到初始默认值
      flattenArray(searchForm).forEach((item) => {
        flattenArray(originSearchForm.current).forEach((curr) => {
          if (curr.id === item.id) {
            originSearchFormValue[curr.id] = curr.defaultValue;
          } else {
            originSearchFormValue[item.id] = undefined;
          }
        });
      });
    }
    formRef.current.setFieldsValue(originSearchFormValue);
    const { clearHandle: clearHandleFromProps } = props;
    if (clearHandleFromProps) {
      clearHandleFromProps();
    }
    handleSearch();
  }

  /**
   * 渲染固定字段
   * 目前为了兼容历史情况，将外传的searchForm中，一开始就需要设置默认值的数据作为固定字段
   */
  function handleRenderFixedFields() {
    return fixedSearchForm.map((formItem) => {
      return (
        <span
          key={formItem.id}
          className="fixed-field"
          style={{ marginTop: 3 }}
        >
          {handleRenderFormItem(formItem)}
        </span>
      );
    });
  }

  function handleListenChange(value, formItem) {
    setChangeFlag(true);
    setEditInfo({ visible: true, info: [], value: {} });
    useDebounceSearch();
    if (formItem.event) {
      return handleEvent(value, formItem);
    }
  }

  const { run: useDebounceSearch } = useDebounceFn(handleSearch, { wait: 500 });

  /**
   * 渲染formItem
   * @param {object} formItem searchForm[0,1...]
   * @param {boolean} notFixed 是否是固定字段
   * @returns reactDom
   */
  function handleRenderFormItem(formItem) {
    const onChange = (value) => handleListenChange(value, formItem);
    return (
      <span
        key={formItem.id}
        className={`${
          formItem.isRequired
            ? 'field-value-required ant-legacy-form-item'
            : 'ant-legacy-form-item'
        } ${formItem.className || ''}`}
      >
        <Form.Item
          key={formItem.id}
          name={formItem.id}
          initialValue={getDefaultValue(formItem)}
          rules={[
            {
              required: formItem.isRequired,
              message: messages('common.no.empty', {
                params: {
                  name: formItem.label,
                },
              }), // name 不可为空
            },
            ...(formItem.validator
              ? [
                  {
                    validator: (...rest) =>
                      formItem.validator(formRef.current, formItem, ...rest),
                  },
                ]
              : []),
          ]}
        >
          <SearchFormItem
            formItem={formItem}
            onSearch={handleSearch}
            onChange={onChange}
            onChangeTime={handleChangeTime}
            onBlur={blurEventMap[formItem.type]}
            onSetDisabledDate={handleGetDisabledDateRange}
            /**
             * 仅用于type: ["select","value_list","multiple","combobox"]
             * TODO: 存在这个函数的意义是为了获取组件内部维护的下拉数据，
             * 反射到父组件在handleSearch中遍历用的，其目的是为了获取label
             * 后续可以考虑在onChange等设置值时，看能不能直接在内部同时返回label，
             * 即那时 onResetOptions可以去除
             */
            onResetOptions={handleGetOptions}
          />
        </Form.Item>
      </span>
    );
  }

  /**
   * 获取默认值
   * @param {object} item searchForm成员
   * @param {any} value,如果有value就用value，没有就用item内部的值
   * @returns any
   */
  function getDefaultValue(item, value) {
    if (item.type === 'yearPicker' && time) return time;
    const target = value || item.defaultValue;
    if (
      item.type === 'select' &&
      target &&
      !item.entity &&
      ![null, undefined].includes(target.key)
    )
      return target.key;
    else return target;
  }

  function handleChangeTime(value) {
    setTime(value);
  }

  /**
   * inputNumber失去焦点,校验金额从至
   * @param {object} e 组件封装的event
   * @param {object} item searchForm[0,1....]
   */
  function handleInputNumberBlurEvent(e, item) {
    const flag = item.amountFrom || item.amountTo;
    if (flag) {
      const amountFromField = amountRangeField[flag].amountFrom;
      const amountToField = amountRangeField[flag].amountTo;
      const values = formRef.current.getFieldsValue([
        amountFromField.key,
        amountToField.key,
      ]);
      const amountFrom = values[amountFromField.key];
      const amountTo = values[amountToField.key];
      if (
        isNumber(amountTo) &&
        isNumber(amountFrom) &&
        Number(amountTo) < Number(amountFrom)
      ) {
        setTimeout(() => {
          // 让blur的校验在点击搜索、清空的click之后执行
          if (needBlurValidate) {
            message.error(
              `${amountToField.label}${messages('base.cannot.be.less.than')}${
                amountFromField.label
              }`,
            );
          } else {
            needBlurValidate = true;
          }
        }, 200);
      }
    }
  }

  // 日期从、至禁选范围
  function handleGetDisabledDateRange(curTime, item) {
    const fineness = item.showTime ? null : 'day';
    if (item.dateFrom) {
      const dateToField = dateRangeField[item.dateFrom].dateTo.key;
      const dateTo = formRef.current.getFieldValue(dateToField);
      return dateTo ? curTime.isAfter(dateTo, fineness) : false;
    } else if (item.dateTo) {
      const dateFromField = dateRangeField[item.dateTo].dateFrom.key;
      const dateFrom = formRef.current.getFieldValue(dateFromField);
      return dateFrom ? curTime.isBefore(dateFrom, fineness) : false;
    }
    return false;
  }

  /**
   * 日期组件的失焦事件
   * @param {object} e 组件封装的event
   * @param {object} item searchForm[0,1....]
   * @returns
   */
  function handleDateBlurEvent(e, item) {
    if (!item.showTime) return;
    if (!dateRangeField[item.dateFrom || item.dateTo]) return;
    const key = item.id;
    const val = e.target.value;
    const startKey = dateRangeField[item.dateFrom || item.dateTo].dateFrom.key;
    const endKey = dateRangeField[item.dateFrom || item.dateTo].dateTo.key;
    const startDate =
      startKey === item.id
        ? val
          ? moment(val)
          : undefined
        : formRef.current.getFieldValue(startKey);
    const endDate =
      endKey === item.id
        ? val
          ? moment(val)
          : undefined
        : formRef.current.getFieldValue(endKey);
    if (startDate && endDate) {
      if (!startDate.isSameOrBefore(endDate)) {
        const fields = {};
        fields[key] = undefined;
        formRef.current.setFieldsValue({ ...fields });
      }
    }
  }

  /**
   * 搜索
   * @param {*} e
   * @param {boolean} isSearch true 则调用搜索列表的接口
   * @param {string} curSolution 传递最新的solution，避免因setState获取不到最新的值
   * @param {object} mixParams 兼容：初始时，走到handleSetDefaultValue的搜索方法，
   * 如果外界用submitHandle向外传递的值覆盖了customTable的params的
   * 值导致第一次调用接口时缺少必要的字段，致接口报错。
   */
  function handleSearch(
    e,
    isSearch = true,
    curSolution,
    mixParams = { lastSize: undefined, lastPage: undefined },
    noCache = false,
  ) {
    if (e) e.preventDefault();
    needBlurValidate = false;
    formRef.current
      .validateFields()
      .then((values) => {
        if (!handleCheckRangeValidate(values)) return; // 校验 金额从/至, 日期从/至
        const { params } = handleFormatSearchValues(values);
        if (!noCache) handleSaveSearchValueToRedux(values, params, curSolution);
        const { submitHandle } = props;
        if (isSearch) submitHandle({ ...params, ...mixParams });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  /**
   * 将两份表单数据存放到redux中 之前，格式化处理好需要存储的数据
   * @param {object} values : 格式化前的数据
   * @returns object
   */
  function handleFormatBeforeSaveToRedux(values) {
    const defaultSearchValue = values;
    const tempSearchForm = flattenArray(_searchForm);

    tempSearchForm.forEach((item) => {
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
    return defaultSearchValue;
  }

  /**
   * 将两份表单数据存放到redux中
   * @param {object} values : 格式化前的数据
   * @param {object} params : 格式化处理后向外抛出的数据
   * @param {string} curSolution: 当前所处的筛选方案,state中的solution不一定是最新值，因此传参
   * @returns
   */
  function handleSaveSearchValueToRedux(values, params, curSolution) {
    if (!props.searchCodeKey) return;
    const { dispatch } = window.g_app?._store || {};
    if (!dispatch) return;
    const defaultSearchValue = handleFormatBeforeSaveToRedux(values, params);
    dispatch({
      type: 'search/addSearchData',
      payload: {
        [props.searchCodeKey]: {
          defaultSearchValue,
          searchParams: params,
          fixedFieldIds: fixedFieldIdList.current || [],
          // 这行可以删除，如果其他地方用的是缓存的，可能会因外界延迟或者切换等特殊情况对某些字段设置成了固定字段，这里或许取不到最新的
          solution: curSolution || solution,
        },
      },
    });
  }

  /**
   * 开启缓存
   */
  function handleCache() {
    const { dispatch } = window.g_app?._store || {};
    if (!dispatch) return;
    dispatch({
      type: 'search/addSearchData',
      payload: {
        [props.searchCodeKey]: {
          ...getCacheValueFromRedux(props.searchCodeKey),
          cacheLock: true,
          // 增加cacheLock判断，确保setDefaultValue搜索时，是因为缓存的原因搜索，而非searchForm的变动
        },
      },
    });
    cacheLock.current = true;
  }

  /**
   * 提供方法，供外界动态设置searchForm时，内部可以追踪到searchForm的变化
   * @param {*} newSearchForm
   */
  function resetSearchForm(newSearchForm, callback) {
    originSearchForm.current = cloneDeep(newSearchForm);
    isRefresh.current = true;
    if (callback) callback();
  }

  function replaceDefaultFields(nextFields, nextSearchForm) {
    if (nextFields?.length === 0 && selectAll)
      return flattenArray(nextSearchForm);
    if (isRefresh.current) {
      isRefresh.current = false;
      return flattenArray(nextSearchForm);
    }
    const originFieldIds = nextFields.map(
      (field) => field?.item?.id || field.id,
    );
    return nextSearchForm.filter((formItem) =>
      originFieldIds.includes(formItem.id),
    );
  }

  /**
   * 设定默认值，将默认值同时设置到searchForm和defaultFields中
   * @returns 新 searchForm
   */
  function handleSetDefaultValue(nextSearchForm) {
    const { searchCodeKey, isNeedSearched } = props;
    if (!searchCodeKey) {
      handleFormatSearchForm(searchForm);
      if (selectAll && solution === 'all') {
        const tempDefaultFields = [];
        flattenArray(searchForm).forEach((item) => {
          tempDefaultFields.push({ item, value: undefined });
        });
        setDefaultFields(tempDefaultFields);
      }
      return props.searchForm;
    }
    const {
      defaultSearchValue,
      solution: cacheSolution,
      searchParams = {},
      lastSize,
      lastPage,
      defaultFlag,
      cacheLock: cacheLockFormRedux,
    } = getCacheValueFromRedux(searchCodeKey);
    const fixedFieldIds = getFixedFieldIds();
    fixedFieldIdList.current = fixedFieldIds;
    const tempDefaultFields = [];
    const initValueToRedux = {};
    // searchForm变动：外界初始化，以及联动重设，联动情况需要考虑当前方案以及searchForm交集
    let curCondition = conditions.find((con) => con.value === solution);
    // let newSearchForm = flattenArray(searchForm);

    if (curCondition && solution !== 'all') {
      curCondition = Object.keys(curCondition.settingValue);
      // newSearchForm = newSearchForm.filter(item => curCondition.includes(item.id));
    }
    // 取上一次的 展示的动态字段和当前外传的搜索数组 交际合并，确保内部能同步外界修改的搜索区参数，
    replaceDefaultFields(defaultFields, nextSearchForm).forEach((item) => {
      if (item.defaultValue) initValueToRedux[item.id] = item.defaultValue;
      // 如果有缓存值，则根据缓存值重设searchForm的每一个成员，否则依据searchForm的配置，渲染动态字段
      if (defaultFlag) {
        const cacheValue = defaultSearchValue[item.id];
        if (!fixedFieldIds.includes(item.id)) {
          item.isFixed = false;
        } else item.isFixed = true;

        if (item.type === 'items') {
          item.items.forEach((ops) => {
            const op = ops;
            if (defaultSearchValue[op.id]) {
              op.defaultValue = defaultSearchValue[op.id];
              // if (!item.isFixed) tempDefaultFields.push({ item: ops, value: op.defaultValue });
              tempDefaultFields.push({ item: ops, value: op.defaultValue });
            }
          });
        } else if (
          (item.type === 'select' || item.type === 'value_list') &&
          !!cacheValue
        ) {
          if (cacheValue.key || [0, false].includes(cacheValue.key))
            cacheValue.key = String(cacheValue.key);
          // (String(cacheValue.key || cacheValue)) 兼容情况：恰好options为空数组时，将值设置到了缓存
          item.defaultValue = item.entity
            ? cacheValue
            : String(cacheValue.key || cacheValue);
          if (item.options.length === 0 && cacheValue.key) {
            item.options = [
              {
                label: cacheValue.label,
                value: cacheValue.key,
                temp: true,
              },
            ];
          }
          // if (!item.isFixed) tempDefaultFields.push({ item, value: item.defaultValue });
          tempDefaultFields.push({ item, value: item.defaultValue });
        } else if (item.id in defaultSearchValue) {
          item.defaultValue = cacheValue;
          // if (!item.isFixed) tempDefaultFields.push({ item, value: cacheValue });
          tempDefaultFields.push({ item, value: cacheValue });
        } else tempDefaultFields.push({ item, value: cacheValue });
      } else if (curCondition && solution !== 'all') {
        tempDefaultFields.push({ item, value: item.defaultValue });
      } else if (solution === 'all') {
        tempDefaultFields.push({ item, value: undefined });
      }
    });
    setDefaultFields(tempDefaultFields);

    if (defaultFlag && cacheSolution) {
      setCurSolution(cacheSolution);
    }
    // 当存在必填项搜索但此项缓存没有值的情况，不能执行搜索
    const searchRequired = searchForm.every((item) => {
      return (
        !item.isRequired ||
        (defaultSearchValue && defaultSearchValue[item.id]) ||
        (item.isRequired && item.defaultValue)
      );
    });
    const { dispatch } = window.g_app?._store || {};
    if (dispatch) {
      // 留存一次最初的初始值，以便清空搜索区时能够还原
      dispatch({
        type: 'search/setInitSearchData',
        payload: { [`init-${searchCodeKey}`]: initValueToRedux },
      });
    }
    /**
     * 判断： (defaultFlag || searchCodeKey)
     * 1. 当表格设置了defaultGetList为false时，表格不会自动调用url,组件刚渲染时，
     *    理想情况下 设置了 defaultFlag = false, 是在searchCodeKey有值的情况下，
     *    为避免初始列表不调用接口，需要这里执行一次
     *    如果不存在 searchCodeKey， defaultFlag则表示由外界控制，这里就不用执行了
     * 2. 当执行了搜索且有了缓存值时，这里需要执行
     */
    Promise.resolve()
      .then(() => {
        handleFormatSearchForm(searchForm);
      })
      .then(() => {
        if (
          !isNeedSearched &&
          searchRequired &&
          cacheLockFormRedux &&
          (defaultFlag ?? lastPage ?? lastSize)
        ) {
          // 搜索完了以后且 跳转了下一个页面，且跳转的时候调用了handleCache，这个时候，再回来的时候，会调用一次
          handleSearch(null, undefined, null, {
            ...searchParams,
            lastPage,
            lastSize,
          });
        }
      });

    return searchForm;
  }

  /**
   * 处理 搜索区字段
   * @param {object} values 格式化前的values
   * @returns object 格式化后的values
   */
  function handleFormatSearchValues(params) {
    const tempSearchForm = flattenArray(_searchForm);
    // const defaultSearchForm = [];

    const values = { ...params };
    tempSearchForm.forEach((item) => {
      if (!values[item.id]) return;
      // defaultSearchForm.push({ item, value: values[item.id] });
      if (item.type === 'yearPicker') {
        values[item.id] = moment(values[item.id]).format('YYYY');
      } else if (item.entity) {
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
          values[item.id] = values[item.id].map((value) =>
            JSON.parse(value.title),
          );
        }
      } else if (item.type === 'list') {
        values[item.id] = values[item.id].map((value) =>
          item.entity ? value : value[item.valueKey],
        );
      } else if (item.type === 'lov') {
        values[item.id] = item.single
          ? values[item.id][item.valueKey]
          : values[item.id]?.map?.((value) => value[item.valueKey]);
      } else if (
        item.type === 'select_part_load' &&
        item.labelInValue !== false
      ) {
        values[item.id] = values[item.id].key;
      } else if (
        isReturnLabel &&
        (values[item.id] || values[item.id] === false || values[item.id] === 0)
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
    return { params: values };
  }

  /**
   * 处理搜索区表单的联动
   * @param {string} event 表单onChange传出的event对象 : event.target.value...
   * @param {object} formItem searchForm各成员
   */
  function handleEvent(event, formItem) {
    const { eventHandle } = props;
    if (!(eventHandle instanceof Function)) return;
    // 当前表单修改的数据
    const result = event ? handleFormatSomeSearchValue(event, formItem) : null;
    // 表单全量数据
    const values = formRef.current.getFieldsValue();
    const { params } = handleFormatSearchValues(values);
    eventHandle(formItem.event, result, params);
  }

  /**
   * 联动时，处理form表单中类型特殊的值
   * @param {string} event
   * @param {object} formItem
   * @returns
   */
  function handleFormatSomeSearchValue(event, item) {
    let result = null;
    const formItem = flattenArray(_searchForm).find(
      (_formItem) => _formItem.id === item.id,
    );
    if (formItem.entity) {
      if (
        formItem.type === 'value_list' ||
        formItem.type === 'select' ||
        formItem.type === 'combobox'
      ) {
        const key = formItem.type === 'value_list' ? 'code' : formItem.valueKey;
        const option = formItem.options.find(
          (op) => op.data[key] === event.key,
        );
        result = option?.data;
      } else if (formItem.type === 'multiple') {
        result = [];
        event.forEach((value) => {
          formItem.options.forEach((option) => {
            if (option.data[formItem.valueKey] === value.key) {
              result.push(option.data);
            }
          });
        });
      }
    } else if (formItem.type === 'switch') result = event;
    else result = event?.target?.value || event || null;
    return result;
  }

  /**
   * 重置表单数据
   */
  function handleClear(needClear) {
    needBlurValidate = false;
    setTime(null);
    handleClearSearchAreaData();
    if (needClear) {
      setDefaultFields([]);
    }
  }

  /**
   * 清除searchArea选择数据
   */
  function handleClearSearchAreaData() {
    const { searchCodeKey } = props;
    if (searchCodeKey) {
      const { dispatch, getState } = window.g_app?._store || {};
      if (dispatch) {
        const searchData = getState()?.search?.data || {};
        const initPageCode = searchData[`init-${searchCodeKey}`];
        dispatch({
          type: 'search/addSearchData',
          payload: { [searchCodeKey]: null },
        });
        if (initPageCode) {
          searchForm.forEach((item) => {
            if (!item.isRequired) {
              item.defaultValue = initPageCode[item.id];
            }
          });
          handleFormatSearchForm(searchForm);
        }
      }
    }
    formRef.current?.resetFields();
  }

  /**
   * 校验金额从至
   * @param {object} values
   * @returns boolean
   */
  function handleCheckRangeValidate(values) {
    let result = true;
    Object.values(amountRangeField).forEach((item) => {
      if (!item.amountFrom || !item.amountTo) return;
      const amountFrom = values[item.amountFrom.key];
      const amountTo = values[item.amountTo.key];
      if (
        isNumber(amountTo) &&
        isNumber(amountFrom) &&
        Number(amountTo) < Number(amountFrom)
      ) {
        /** 不能小于 */
        message.error(
          `${item.amountTo.label}${messages('base.cannot.be.less.than')}${
            item.amountFrom.label
          }`,
        );
        result = false;
      }
    });
    Object.values(numberField).forEach((item) => {
      if (!values[item.key]) return;
      if (!isNumber(values[item.key])) {
        message.error(
          messages('common.Illegal.digital', { label: item.label }),
        ); // `${item.label}为非法数字`
        result = false;
      }
    });
    return result;
  }

  /**
   * 渲染： 搜索之后设置了值的字段
   * @returns
   */
  function handleRenderDefaultFields() {
    if (Array.isArray(defaultFields) && defaultFields.length) {
      const fixedFieldIds = fixedSearchForm.map((formItem) => formItem.id);
      return defaultFields.map((field) => {
        if (field?.item?.id && fixedFieldIds.includes(field.item.id))
          return null;
        return renderDefaultField(field);
      });
    }
  }

  function renderDefaultField(field) {
    return (
      <span
        key={field.item.id}
        className="default-field"
        style={{ marginTop: 3 }}
      >
        {handleRenderFormItem(field.item)}
        {hideDynamicSelFieldBtn || field.extraSearch ? null : (
          <CircleCloseSvg
            className="delete-icon"
            onClick={() => {
              handleDeleteDefaultField(field.item.id);
            }}
          />
        )}
      </span>
    );
  }

  /**
   * 删除（取消渲染） 搜索后设置了值的字段，同时置空该字段在form中的值
   * @param {string} fieldId
   */
  function handleDeleteDefaultField(fieldId) {
    if (fieldId) {
      const index = defaultFields.findIndex(
        (field) => field?.item?.id === fieldId,
      );
      if (~index) {
        Promise.resolve()
          .then(() => {
            defaultFields.splice(index, 1);
            setDefaultFields([...defaultFields]);
            formRef.current.setFieldsValue({ [fieldId]: undefined });
            setEditInfo({ visible: true, info: [...defaultFields], value: {} });
            setChangeFlag(true);
            filterBtn.current?.setSelectedFields?.(
              [...defaultFields].map((field) => field.item.id),
            );
          })
          .then(() => {
            handleSearch();
          });
      }
    }
  }

  /**
   * 获取 下拉数据源，并重设到formItem中
   * @param {array} options
   * @param {string} formItemId
   */
  function handleGetOptions(options, formItemId) {
    if (!formItemId) return;
    if (!options || (Array.isArray(options) && !options.length)) return;
    const index = searchForm.findIndex(
      (formItem) => formItem.id === formItemId,
    );
    if (~index) {
      searchForm[index].options = options;
      setSearchForm(searchForm);
    }
  }

  /**
   * 获取需要校验的字段， 金额从/至, 日期从/至
   * 属性：amountTo/amountFrom, 金额校验，同一个金额从/至的 值要相等，不同的金额从/至的 值不同
   * 属性：dateTo/dateFrom, 日期校验，同一个日期从/至的 值要相等，不同的金额从/至的 值不同
   */
  function handleGetRangeField() {
    const amountRangeFieldMap = {};
    const dateRangeFieldMap = {};
    const numberFieldMap = {};
    let newSearchForm = [];
    searchForm.forEach((formItem) => {
      if (formItem.type === 'items') {
        setValidateField(formItem);
        newSearchForm = newSearchForm.concat(formItem.items);
      } else newSearchForm.push(formItem);
    });
    newSearchForm.forEach((item) => {
      const amount = item.amountTo || item.amountFrom;
      const date = item.dateTo || item.dateFrom;
      if (amount) {
        amountRangeFieldMap[amount] = amountRangeFieldMap[amount] || {};
        amountRangeFieldMap[amount][item.amountTo ? 'amountTo' : 'amountFrom'] =
          {
            key: item.id,
            label: item.label,
          };
      } else if (date) {
        dateRangeFieldMap[date] = dateRangeFieldMap[date] || {};
        dateRangeFieldMap[date][item.dateTo ? 'dateTo' : 'dateFrom'] = {
          key: item.id,
          label: item.label,
        };
      }
      if (item.type === 'inputNumber') {
        numberFieldMap[item.id] = { key: item.id, label: item.label };
      }
    });
    setAmountRangeField(amountRangeFieldMap);
    setDateRangeField(dateRangeFieldMap);
    setNumberField(numberFieldMap);
  }

  // 日期金额从至，有items, 具有属性，validateTime，validateAmount，进行校验
  function setValidateField(items) {
    const item = items;
    if (item.validateTime) {
      item.items[0].dateFrom = item.id;
      item.items[1].dateTo = item.id;
    } else if (item.validateAmount) {
      item.items[0].amountFrom = item.id;
      item.items[1].amountTo = item.id;
    }
  }

  /**
  * 设置searchForm的值
  * @param options 需要设置的值，与form.setFieldsValue值格式一致
  * input、switch、data、radio、big_radio、checkbox直接传入对应字符串value即可
  * select、value_list 所需的默认值需要哦为 {label: '', value: ''}
  * list 所需格式为包含显示值与数据值的对象数组，根据valueKey与labelKey对应
  * TODO: combobox 与 multiple 模式待开发
  * @param isReset: 是否需要重置searchForm相关数据，从而重渲染搜索区，默认是
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
  function setValues(options, isReset = true) {
    const values = handleFormatValuesWhenSetting(options);
    if (isReset) handleFormatSearchForm(_searchForm);
    formRef.current.setFieldsValue(values);
  }

  /**
   * 处理成 各表单组件实际能接受的值
   * @param {*} options
   * @returns
   */
  function handleFormatValuesWhenSetting(options) {
    const values = {};
    Object.keys(options).forEach((key) => {
      _searchForm.forEach((formItem) => {
        if (formItem.type === 'items') {
          formItem.items.forEach((item) => {
            handleSetValueByType(
              { formItem: item, value: options[key], key },
              values,
            );
          });
        } else {
          handleSetValueByType({ formItem, value: options[key], key }, values);
        }
      });
    });
    return values;
  }

  /**
   * 处理 setValue中外传的options的每一条属性
   * @param {object} formItem
   * @param {any} value options[key]
   * @param {string} key formItem.id
   * @param {number} index formItem所在searchForm中的索引
   * @param {object} values 对象，用于存放处理后的options[key]
   * @returns
   */
  function handleSetValueByType({ formItem, value, key }, values) {
    if (formItem.id !== key) return;
    if (
      (formItem.type === 'select' || formItem.type === 'value_list') &&
      (value instanceof Object || value?.splice)
    ) {
      values[formItem.id] = formItem.entity
        ? { key: value.value, label: value.label }
        : `${value.value || value.key}`;
      onSetSelectValue(formItem, value, values);
    } else if (['date', 'month', 'yearPicker'].includes(formItem.type)) {
      values[key] = value ? moment(value) : undefined;
    } else if (
      ['rangePicker', 'rangeDateTimePicker', 'datePicker'].includes(
        formItem.type,
      )
    ) {
      // 这三个是原有的，但貌似没用到过，临时兼容
      values[key] = value;
    } else if (
      ['input', 'switch', 'list', 'lov', 'select_part_load'].includes(
        formItem.type,
      )
    ) {
      values[key] = value;
    } else {
      // 这里转字符串是继承以前search-area的逻辑，但可能存在风险，理论上最好不用转化
      values[key] = value ? `${value}` : undefined;
    }
  }

  /**
   * 如果是select的设置值，如果options内没有值时应先增加一个默认的对应option
   * @param item  对应searchForm的表单项
   * @param value 需要设置的值 {label: '', value: ''}
   */
  function onSetSelectValue(item, value) {
    let target = item.options;
    if (target.length === 0 || (target.length === 1 && target[0].temp)) {
      const valueKey =
        item.type === 'value_list'
          ? 'code'
          : getLastKey(item.valueKey || 'value');
      const labelKey =
        item.type === 'value_list'
          ? 'messageKey'
          : getLastKey(item.labelKey || 'label');
      target = [
        {
          label: value.label,
          value: value.value,
          data: { [valueKey]: value.value, [labelKey]: value.label },
          temp: true,
        },
      ];
      setSearchForm(_searchForm);
    }
  }

  /**
   * 展平数组
   * (存在type === "items"时)
   * @returns array
   */

  function flattenArray(searchList) {
    let temp = [];
    searchList.forEach((item) => {
      if (item.type === 'items') temp = temp.concat(item.items);
      else temp.push(item);
    });
    return temp;
  }

  /**
   * 筛选条件中 各option hover icon的下拉菜单可点击事件
   * @param {*} param
   */
  function handleMenuClick({ key, domEvent }, condition) {
    if (domEvent.stopPropagation) {
      domEvent.preventDefault();
      domEvent.stopPropagation();
    }
    if (key === '0') {
      handleSetDefaultCondition(condition);
    } else if (key === '1') {
      handleOpenConditionModal(true, condition);
    } else if (key === '2') {
      handleDeleteCondition(condition);
    }
  }

  /**
   * 展开 保存筛选条件 弹窗
   * @param {Boolean} isEdit:是否是编辑状态
   * @param {object} target: 当前操作的下拉数据（重命名时） target:{label,value,params}
   */
  function handleOpenConditionModal(isEdit, target) {
    new Promise((resolved, rejected) => {
      /**
       * 1. 如果是编辑状态下需要带上target;target包含了所有需要的数据
       * 2. 如果不是编辑状态：
       *  2.1 如果 isStretching为true，通过form获取值，如果为false需要从defaultFields里取值
       *  2.2 如果 isStretching为true时，form需要校验一次置入的数据是否符合校验规则
       */
      if (isEdit) {
        resolved();
        return;
      }
      formRef.current
        .validateFields()
        .then((values) => {
          if (!handleCheckRangeValidate(values)) {
            rejected();
            return;
          }
          resolved(values);
        })
        .catch((err) => {
          rejected();
          return;
        });
    })
      .then((filterCondition) => {
        let initialValue = { visible: isEdit };
        if (isEdit) {
          initialValue = { ...initialValue, ...target };
        } else {
          initialValue.params = handleFormatBeforeSaveToRedux(filterCondition);
        }
        setFormValue(initialValue);
      })
      .catch((err) => {
        message.error(
          messages(
            'common.checking.search.field.warning' /* 存在搜索字段未符合校验逻辑... */,
          ),
        );
        console.log(err);
      });
  }

  // 根据获取的所有筛选方案，1.设置默认方案； 2. 判断调用列表接口
  function handleGetAllConditions(flag) {
    if (!uniqueKey) return;
    beforeGetAllCons(flag)
      .then((res) => {
        const { searchCodeKey } = props;
        const { defaultFlag } = searchCodeKey
          ? getCacheValueFromRedux(searchCodeKey)
          : {};
        if (Array.isArray(res.data) && res.data.length) {
          let temp = res.data
            .filter((item) => item.settingType === 'SEARCH')
            .map((item) => ({
              ...item,
              label: item.settingName,
              value: item.id,
              settingValue:
                typeof item.settingValue === 'string'
                  ? JSON.parse(item.settingValue)
                  : {},
            }));
          temp = defaultConditionList.concat(temp);
          setConditions(temp);
          const defaultCondition = temp.find((item) => item.defaultFlag);
          // 如果table禁用了getList,同时没有配置默认搜索条件，没有缓存值，就会出现，列表数据为空（不调接口）
          if (!defaultFlag) {
            // 如果有默认方案且没有缓存的搜索条件，则根据默认的方案设定
            if (defaultCondition) {
              handleChangeSolution({
                value: defaultCondition?.value,
                conditionList: temp,
                needSearch: true,
                noCache: true,
              });
              return;
            }
            handleSearch(undefined, undefined, undefined, undefined, true);
          }
        } else if (!defaultFlag) {
          // 如果没有配置方案，没有缓存值，且外界给了searchCodeKey，同时表格关闭了默认搜索时，
          // 一般给了searchCodeKey，表格就是设置了defaultGetList={false}
          handleSearch(undefined, undefined, undefined, undefined, true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // 获取所有的筛选方案
  function beforeGetAllCons(flag) {
    const search = window.g_app?._store?.getState()?.search;
    return new Promise((resolve, reject) => {
      if (flag && search?.all && search.all[uniqueKey]) {
        resolve({ data: search.all[uniqueKey] });
      } else {
        Service.onGetAllConditions(uniqueKey)
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      }
    });
  }

  // 设置默认的筛选方案
  function handleSetDefaultCondition(condition) {
    if (!uniqueKey) return;
    Service.onSaveCondition({
      ...condition,
      defaultFlag: true,
      settingValue: JSON.stringify(condition.settingValue),
    })
      .then((res) => {
        message.success(messages('common.set.successfully' /* 设置成功 */));
        resetGlobalConditions(res.data);
        if (Array.isArray(res.data)) {
          let temp = res.data.map((item) => ({
            ...item,
            label: item.settingName,
            value: item.id,
            settingValue:
              typeof item.settingValue === 'string'
                ? JSON.parse(item.settingValue)
                : {},
          }));
          temp = defaultConditionList.concat(temp);
          setConditions(temp);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  /**
   * 删除筛选条件
   * @returns
   */
  function handleDeleteCondition(condition) {
    if (!uniqueKey) return;
    Modal.confirm({
      icon: <CloseCircleFilled style={{ color: '#ff4d4f' }} />,
      title: messages('common.delete.filter' /* 删除筛选条件 */),
      content: messages(
        'common.delete.confirm' /* 确认删除此条件吗？删除后，以后将无法继续使用此筛选 */,
      ),
      okButtonProps: { danger: true },
      onOk: () => {
        Service.onDeleteCondition(condition.value)
          .then(() => {
            const index = conditions.findIndex(
              (con) => con.value === condition.value,
            );
            conditions.splice(index, 1);
            setConditions([...conditions]);
            message.success(messages('common.delete.success' /* 删除成功 */));
            resetGlobalConditions([...conditions]);
            if (solution === condition.value) {
              handleChangeSolution({ value: 'all', needSearch: true });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
    });
  }

  function resetGlobalConditions(list) {
    const { getState } = window.g_app._store || {};
    if (!getState) return;
    const search = getState()?.search;
    if (search && search?.all) {
      const { dispatch } = window.g_app._store;
      const temp = [...list];
      const index = temp.findIndex((con) => con.value === 'all');
      if (~index) temp.splice(index, 1);
      search.all[uniqueKey] = temp;
      dispatch({
        type: 'search/saveAllSearchData',
        payload: { ...search.all },
      });
    }
  }

  /**
   * 筛选条件修改后，重设conditions，重渲染下拉框
   */
  function handleResetConditionAfterSave(list) {
    handleGetAllConditions();
    resetGlobalConditions(list);
    setChangeFlag(false);
  }

  /**
   * 实时存储下拉选择的数据
   * @param {string} value
   * @param {array} conditionList 如果有conditionList就用conditionList，避免setState的异步问题
   */
  function handleChangeSolution({ value, conditionList, needSearch, noCache }) {
    setCurSolution(value);
    const condition = (conditionList || conditions).find(
      (con) => con.value === value,
    );
    if (!condition) return;
    formRef.current.resetFields();
    if (condition.value === 'all') {
      handleFormatSearchForm(searchForm);
      const tempDefaultFields = [];
      flattenArray(searchForm).forEach((item) => {
        tempDefaultFields.push({ item, value: 'all' });
      });
      setDefaultFields(tempDefaultFields);
      if (needSearch) handleSearch(null, undefined, value);
    } else if (condition.settingValue) {
      const newDefaultFields = resetDefaultValue(condition.settingValue);
      Promise.resolve()
        .then(() => {
          setDefaultFields(newDefaultFields);
        })
        .then(() => {
          // 模拟联动事件
          compulsoryTreatmentCascadeLogic(condition.settingValue);
          setValues(condition.settingValue, false);
          setEditInfo({
            visible: false,
            info: newDefaultFields || [],
            value: condition.settingValue,
          });
          const defaultFixedFieldValue = {};

          getFixedFieldIds(true).forEach((item) => {
            if (condition?.settingValue?.[item.id]) {
              defaultFixedFieldValue[item.id] = getDefaultValue(
                item,
                condition?.settingValue?.[item.id],
              );
            }
          });
          if (Object.values(defaultFixedFieldValue).length) {
            formRef.current.setFieldsValue(defaultFixedFieldValue);
          }
          if (needSearch)
            handleSearch(null, undefined, value, undefined, noCache);
        });
    }
  }

  // 根据最新的searchForm取出固定字段组成的id数组，避免外界因异步操作导致内部渲染固定字段相关数据有误
  function getFixedFieldIds(needAll = false) {
    const idList = [];
    searchForm.forEach((field) => {
      if (field.isFixed || (field.isRequired && field.defaultValue)) {
        if (needAll) idList.push(field);
        else idList.push(field.id);
      }
    });
    return idList;
  }

  /**
   * 遍历，
   * 强制触发搜索区配置的联动事件逻辑
   * @param {*} values
   */
  function compulsoryTreatmentCascadeLogic(values) {
    const valueMap = handleFormatValuesWhenSetting(values);
    searchForm.forEach((formItem) => {
      const value = valueMap[formItem.id];
      if (formItem.event && value) {
        handleEvent(value, formItem);
      }
    });
  }

  /**
   * 下拉框切换筛选方案后，
   *  1. 重设重渲染defaultField,
   *  2. 重设searchForm中关于select的options，重渲染，
   *     保证options设定通过getUrl获取数据之前能根据value正常展示label
   * @param {*} params
   * @returns
   */
  function resetDefaultValue(params) {
    const tempDefaultFields = [];
    flattenArray(searchForm).forEach((formItem) => {
      if (formItem.type === 'items') {
        // 使用了flattenArray以后，type为item的这段逻辑就不会再执行了
        // items类型已经完全不考虑 items[0].type 会是select之类的了，正常不会给items成员配置select类型
        formItem.items.forEach((ops) => {
          const op = ops;
          if (params[op.id]) {
            tempDefaultFields.push({ item: ops, value: params[op.id] });
          }
        });
      } else if (
        (formItem.type === 'select' || formItem.type === 'value_list') &&
        !!params[formItem.id]
      ) {
        const defaultValue = formItem.entity
          ? params[formItem.id]
          : String(params[formItem.id].key);
        if (formItem.options.length === 0 && params[formItem.id].key) {
          formItem.options = [
            {
              label: params[formItem.id].label,
              value: params[formItem.id].key,
              temp: true,
            },
          ];
        }
        tempDefaultFields.push({ item: formItem, value: defaultValue });
      } else if (formItem.id in params) {
        tempDefaultFields.push({ item: formItem, value: params[formItem.id] });
      }
    });
    handleFormatSearchForm(searchForm);
    return tempDefaultFields;
  }

  function handleResetDefaultField() {
    setDefaultFields([...editInfo.info]);
    /**
     * 重置，回到最开始选择的方案，defaultFields需要重定，form的值也需要回滚
     * 先resetField再执行handleChange是为了避免change中直接调用setValues导致新修改的数据
     * 不会被回滚
     */
    formRef.current.resetFields();
    handleChangeSolution({ value: solution });
    setEditInfo({ visible: false, info: [], value: {} });
    setChangeFlag(false);
    if (selectAll && solution === 'all') {
      const tempDefaultFields = [];
      const settingValue = {};
      flattenArray(searchForm).forEach((item) => {
        settingValue[item.id] = item.defaultValue;
        tempDefaultFields.push({ item, value: undefined });
      });
      compulsoryTreatmentCascadeLogic(settingValue);
      setDefaultFields(tempDefaultFields);
    }
  }

  function renderSaveBtnGroup() {
    if (!changeFlag) return;
    return (
      <>
        {solution !== 'all' && (
          <Button className="edit-btn" onClick={handleEditCondition}>
            {messages('common.save')}
          </Button>
        )}
        <NewSolutionBubble
          isNew={!(solution === 'all')}
          onGetCondition={handleOpenConditionModal}
          formValue={formValue}
          conditions={conditions}
          uniqueKey={uniqueKey} // 外传的key，由开发人员自定义，用于确保当前页面和筛选方案一一对应
          onAfterSave={handleResetConditionAfterSave}
        />
      </>
    );
  }

  function handleEditCondition() {
    if (!uniqueKey) return;
    formRef.current
      .validateFields()
      .then((values) => {
        // 校验 金额从/至, 日期从/至
        if (!handleCheckRangeValidate(values)) {
          return;
        }
        const params = handleFormatBeforeSaveToRedux(values);
        const curCondition = conditions.find((con) => con.value === solution);
        Service.onSaveCondition({
          ...curCondition,
          settingValue: customStringify(params),
        })
          .then((res) => {
            message.success(messages('common.save.success' /* 保存成功 */));
            handleResetConditionAfterSave(res.data);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((err) => {
        return;
      });
  }

  /**
   * 动态筛选 搜索条件
   * @param {array} selectedList
   * @param {boolean} refresh 是否要执行刷新数据，true则调用
   */
  function resetDynamicCols(selectedList, refresh) {
    const defaultValues = [];
    flattenArray(searchForm).forEach((col) => {
      if (selectedList.includes(col.id)) {
        defaultValues.push({ item: col, value: 'all' });
      }
    });
    setChangeFlag(true);
    setEditInfo({ visible: true, info: [], value: {} });
    setDefaultFields(defaultValues);
    if (refresh) {
      // 清空
      Promise.resolve().then(() => {
        handleSearch();
      });
    }
  }

  /**
   * 因defaultFields在通过后端查询后，将可能是固定字段的值一起混入了defaultFields中，
   * 因此这里过滤掉固定字段，或者后期在设置的时候提前过滤一次，以下逻辑即可不必
   */
  function getDefaultFieldsWhenInSet() {
    return Array.isArray(defaultFields)
      ? defaultFields.filter(
          ({ item }) => !(fixedFieldIdList.current || []).includes(item.id),
        )
      : undefined;
  }

  function handleRenderExtraSearch() {
    const field = { item: { ...extraSearch }, value: undefined };
    field.item.type = 'input';
    field.item.col = 6;
    field.extraSearch = true;
    return (
      <div className="default-field-form-items">
        {renderDefaultField(field)}
      </div>
    );
  }

  return (
    <div
      className={expand ? 'search-area expand' : 'search-area'}
      id="new-search-area"
      style={style}
    >
      <Form layout="inline" ref={formRef}>
        <Row style={{ marginBottom: 12 }} className="first-row">
          <Col span={24} style={{ paddingLeft: 10 }}>
            <AllIcon style={{ verticalAlign: 'unset' }} />
            {/* 渲染可用的筛选方案，数据来自接口返回 */}
            <Select
              value={solution}
              style={{
                width: 'unset',
                height: 28,
                fontSize: 16,
                marginRight: 6,
              }}
              dropdownMatchSelectWidth={206}
              getPopupContainer={(node) => node.parentNode}
              onChange={(value) => {
                handleChangeSolution({ value, needSearch: true });
              }}
              className="select-solution"
              suffixIcon={
                <CaretDownOutlined
                  style={{
                    fontSize: 10,
                    pointerEvents: 'unset',
                    marginLeft: 4,
                    marginTop: 1,
                    color: '#333333',
                  }}
                />
              }
            >
              {Array.isArray(conditions) &&
                conditions.map((condition) => {
                  return (
                    <Select.Option key={condition.value}>
                      <div className="filter-condition">
                        <span
                          className="margin-right-8"
                          style={{ marginRight: 8 }}
                        >
                          {condition.label}
                        </span>
                        {condition.defaultFlag && (
                          <Tag className="custom-default-tag-color">
                            {messages('common.default')}
                          </Tag>
                        )}
                        {changeFlag &&
                          editInfo?.visible &&
                          solution === condition.value && (
                            <Tag
                              className="custom-edit-tag"
                              style={{ marginRight: 6 }}
                            >
                              {messages('common.modified' /* 已修改 */)}
                            </Tag>
                          )}
                        {condition.value !== 'all' && (
                          <Dropdown
                            overlay={
                              <Menu
                                onClick={(e) => {
                                  handleMenuClick(e, condition);
                                }}
                              >
                                <Menu.Item key="0">
                                  {messages(
                                    'common.set.default' /* 设置默认 */,
                                  )}
                                </Menu.Item>
                                <Menu.Item key="1">
                                  {messages('common.rename' /* 重命名 */)}
                                </Menu.Item>
                                <Menu.Divider />
                                <Menu.Item key="2" style={{ color: '#F5222D' }}>
                                  {messages('common.delete' /* 删除 */)}
                                </Menu.Item>
                              </Menu>
                            }
                            overlayStyle={{ width: 130 }}
                          >
                            <EllipsisOutlined className="filter-condition-icon" />
                          </Dropdown>
                        )}
                      </div>
                    </Select.Option>
                  );
                })}
            </Select>
            <div className="btnBox" style={{ display: 'inline-block' }}>
              {renderSaveBtnGroup()}
              {changeFlag && editInfo?.visible && (
                <>
                  <Button
                    className="edit-btn"
                    onClick={handleResetDefaultField}
                  >
                    {messages('common.reset' /* 重置 */)}
                  </Button>
                </>
              )}
            </div>
            <Divider type="vertical" style={{ margin: '0 12px 0 -2px' }} />
            <div
              style={{
                display: 'inline-flex',
                width: 88,
                height: 24,
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'relative',
                top: -2,
              }}
            >
              <div className="btnBG">
                <div className="themeBG" />
                <Tooltip title={expand ? '收起' : '展开'}>
                  <DoubleArrowSvg
                    className={expand ? 'expand-icon expand' : 'expand-icon'}
                    onClick={handleExpand}
                    style={{ marginLeft: 1 }}
                  />
                </Tooltip>
              </div>
              <div className="btnBG" style={{ marginLeft: 8 }}>
                <div className="themeBG" />
                <Tooltip title="刷新">
                  <RefreshSvg
                    id="refreshBtn"
                    className="rotate-icon"
                    onClick={handleRotate}
                    style={{ transform: `rotate(${rotate}deg)` }}
                  />
                </Tooltip>
              </div>
              <div className="btnBG" style={{ marginLeft: 8 }}>
                <div className="themeBG" />
                <Tooltip title="清空搜索条件">
                  <ResetSvg className="reset-icon" onClick={clearHandle} />
                </Tooltip>
              </div>
            </div>
          </Col>
        </Row>
        <Row style={{ display: expand ? 'flex' : 'none', marginTop: -3 }}>
          {/* 渲染额外输入搜索框 */}
          {extraSearch && handleRenderExtraSearch()}
          {/* 渲染固定字段 */}
          <div className="fixed-field-form-items">
            {handleRenderFixedFields()}
          </div>
          <div className="default-field-form-items">
            {handleRenderDefaultFields()}
          </div>
          {hideDynamicSelFieldBtn ? null : (
            <DynamicSelFieldBtn
              columns={dySearchForm}
              onResetDynamicCols={resetDynamicCols}
              defaultSelected={getDefaultFieldsWhenInSet()}
              ref={filterBtn}
            />
          )}
        </Row>
      </Form>
      <NewFilterConditions
        onCancel={() => {
          setFormValue({});
        }}
        formValue={formValue}
        conditions={conditions}
        uniqueKey={uniqueKey} // 外传的key，由开发人员自定义，用于确保当前页面和筛选方案一一对应
        onAfterSave={handleResetConditionAfterSave}
      />
    </div>
  );
}

export default WrapperForm(SearchArea);
