/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-09-22 10:23:48
 * @LastEditors: binfeng.long@hand-china.com
 * @LastEditTime: 2021-11-22 10:37:28
 * @Version: 1.0.0
 * @Description: 弹窗 树形展示 公司数据，
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */

import React, { useRef, useState, useEffect } from 'react';
import { Input, Modal, Tree, Spin, message, Pagination } from 'antd';
import httpFetch from 'share/httpFetch';
import config from 'config';
import { CloseOutlined, CaretDownOutlined } from '@ant-design/icons';
import { messages } from '../../../../utils';
import SearchAreaLov from '../../../../basic/search-area-lov';
// import useWidthAdaptation from '../../useWidth';
import './style.less';

const ALL = 'all';
const SELECT = 'selected';
const NOT_SELECT = 'not_select';
let first = true;

function TreeSelectModel(props) {
  const { formItem, value, onChange } = props;
  const {
    label,
    disabled,
    modalTitle,
    getUrl = `${config.mdataUrl}/api/company/tree`,
    options = [],
    method = 'get',
    extraParams,
    paramAsBody,
    requestBody,
    labelKey = 'name',
    valueKey = 'id',
    parentValueKey = 'parentCompanyId',
    childrenKey = 'children',
    extraLabelKey = 'companyLevelName',
    titleRender,
  } = formItem;
  const inputRef = useRef();
  const [visible, setVisible] = useState(false);
  const [spinning, setSpinning] = useState(true);
  const [selectedList, setSelectedList] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);

  const searchForm = [
    {
      id: 'keywords',
      label: messages('pay.company' /* 公司 */),
      placeholder: messages('common.input.name.or.code' /* 请输入代码或名称 */),
      type: 'input',
      allowClear: true,
      span: 12,
    },
    {
      id: 'companyLevelId',
      label: messages(
        'company.maintain.company.companyLevelName' /* 公司级别 */,
      ),
      type: 'select_part_load',
      getUrl: `${config.mdataUrl}/api/companyLevel/selectByInput`,
      labelInValue: false,
      getParams: { enabled: true },
      labelKey: 'description',
      valueKey: 'id',
      allowClear: true,
      placeholder: messages('common.please.select'),
      span: 12,
    },
    {
      id: 'checkType',
      label: messages('common.view' /* 查看 */),
      type: 'select',
      options: [
        { value: ALL, label: messages('common.all' /* 全部 */) },
        { value: SELECT, label: messages('common.has.selected' /* 已选 */) },
        {
          value: NOT_SELECT,
          label: messages('common.not.selected' /* 未选 */),
        },
      ],
      allowClear: true,
      span: 12,
    },
    {
      id: 'withChildren',
      type: 'checkbox',
      options: [
        {
          label: messages('base.sync.check.subsidiary' /* 同时勾选下属公司 */),
          value: true,
        },
      ],
      event: 'WITHCHILDREN',
      label: ' ',
      span: 12,
      defaultValue: [false],
    },
  ];

  const [optionList, setOptionList] = useState([]);

  const [searchParam, setSearchParams] = useState({ withChildren: false });

  const [newConfig, setNewConfig] = useState({});
  const [valueText, setValueText] = useState('');
  // 当存在父级节点时，记录父级的子级个数，与当前勾选情况，从而方便自定义check方法时能联动
  const parentValueKeyMap = useRef({});
  const spanRef = useRef();

  const [pageInfo, setPageInfo] = useState({
    size: 10,
    total: 0,
    current: 1,
  });

  useEffect(() => {
    const temp = Array.isArray(value) ? [...value] : [];
    const checkedList = !searchParam.withChildren
      ? { checked: temp, halfChecked: [] }
      : temp;
    const string = Array.isArray(value)
      ? messages('base.has.choose.count', { params: { count: value.length } })
      : undefined;
    setValueText(string);
    spanRef.current.innerText = string || '全部';
    setSelectedList(checkedList);
  }, [value]);

  useEffect(() => {
    if (visible) {
      // 避免每次弹窗的时候，都调用接口或者重设 optionsList,仅当options，getUrl变动的时候
      const noRefresh =
        options?.length > 1
          ? false
          : newConfig.getUrl !== getUrl &&
            newConfig.extraParams !== extraParams &&
            newConfig.requestBody !== requestBody;
      getTreeData(noRefresh);
    }
  }, [options, getUrl, visible]);

  useEffect(() => {
    // 关闭弹窗，还原部分数据
    if (!visible) {
      setPageInfo({
        size: 10,
        total: 0,
        current: 1,
      });
      searchParam.withChildren = false;
      setSearchParams(searchParam);
    }
  }, [visible]);

  // useWidthAdaptation(30, valueText || "全部", 0, null, spanRef);
  /**
   * 控制弹窗显隐
   * @returns
   */
  function onInputFocus() {
    const { onFocus } = props;
    if (disabled) {
      return;
    }
    inputRef.current.blur();
    if (onFocus) onFocus();
    setVisible(true);
  }

  /**
   * 获取树结构数据
   * @param {boolean} noRefresh 是否需要执行当前方法
   * @returns
   */
  function getTreeData(noRefresh, searchParams = {}) {
    if (noRefresh) return;
    if (Array.isArray(options) && options.length) {
      const temp = {};
      const expandKeyList = [];
      formatValue(options, null, temp, expandKeyList);
      setExpandedKeys(expandKeyList);
      if (first) {
        parentValueKeyMap.current = { ...parentValueKeyMap.current, ...temp };
        first = true;
      }
      const { checkType } = searchParams;
      setOptionList(filterByCheckType(checkType, options));
      setSpinning(false);
    } else {
      if (!method || !getUrl) return;
      // withChildren,checkType 由前端执行过滤
      const { withChildren, checkType, current, size, ...others } =
        searchParams;
      const { current: curFromState, size: curSizeFromState } = pageInfo;
      const params = {
        ...extraParams,
        ...others,
        page: (current ?? curFromState) - 1,
        size: size ?? curSizeFromState,
      };
      let newRequestBody = requestBody;
      let flag = false;
      if (paramAsBody) {
        // post方法下，将params拼接到请求体中而非下面【flag = true】这种情况
        newRequestBody = { ...requestBody, ...params };
      } else if (method === 'get') {
        // params在请求头，不存在requestBody
        newRequestBody = params;
      } else if (method === 'post') {
        // params在请求头, requestBody在请求体
        flag = true;
      }
      setSpinning(true);
      httpFetch[method](getUrl, newRequestBody, null, null, flag ? params : {})
        .then((res) => {
          const temp = {};
          const expandKeyList = [];
          formatValue(res.data, null, temp, expandKeyList);
          setExpandedKeys(expandKeyList);
          if (first) {
            parentValueKeyMap.current = {
              ...parentValueKeyMap.current,
              ...temp,
            };
            first = true;
          }
          pageInfo.total = Number(res.headers['x-total-count']) || 0;
          setPageInfo(pageInfo);
          setOptionList(filterByCheckType(checkType, res.data));
          setSpinning(false);
          setNewConfig({ getUrl, extraParams, requestBody });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  function cascadingChild(list, targets) {
    if (Array.isArray(list)) {
      list.forEach((key) => {
        if (parentValueKeyMap.current?.[key]) {
          const temps = parentValueKeyMap.current?.[key]?.children || [];
          temps.forEach((tempKey) => {
            targets.push(tempKey);
          });
          cascadingChild(temps, targets);
        }
      });
    }
  }

  /**
   * 树选择结构
   * @param {Array<string>} checkedKeys
   */
  function handleCheck(checkedKeys, event) {
    const { node, checked } = event;
    const { withChildren } = searchParam;

    let checkedList = Array.isArray(selectedList) ? selectedList : [];
    // 假设当前节点有子级节点，选中的同时将子级推入到勾选数组中，反选则删除
    let children = [];
    if (withChildren) {
      if (parentValueKeyMap.current?.[node[valueKey]]) {
        // 不能直接解构，需要拷贝一次
        const curChildren = parentValueKeyMap.current[node[valueKey]].children;
        children = [...curChildren];
      } else if (node[childrenKey] || node.tempChildren) {
        children = (node[childrenKey] || node.tempChildren).map(
          (leafNode) => leafNode[valueKey],
        );
      } else children = [];
      const tempChildren = [...children];
      cascadingChild(tempChildren, children);
    }

    if (checked) {
      checkedList.push(node[valueKey]);
      checkedList = checkedList.concat(children);

      const parentKey = node[parentValueKey];
      if (parentKey && parentValueKeyMap.current[parentKey]) {
        // 如果存在[parentValueKey]，表示当前节点是子级,同时需要记录一次当前子级选中个数
        /**
         * TODO: 需要判空，接口搜索时，因为牵扯到分页，这里会查出不在map中维护的数据,
         * 另，如果父子有关联且在搜索下，如果勾选了父级，是没法同步勾选子级的，因为此时后端不会返回它的children，
         * 前端无法得知其存在children，这是不可避免的一个bug
         */
        // 子级反向联动父级的逻辑不必再有（需求：父级可以联动子级，但子级不影响父级）
        // parentValueKeyMap.current[parentKey].checked += 1;
        // const { all, checked: num } = parentValueKeyMap.current[parentKey];
        // if (all === num && withChildren) { // 如果子级全部勾选了，则需要将父级推入
        //   checkedList.push(parentKey);
        // }
      }
    } else {
      const filterChildren = [...children];
      filterChildren.push(node[valueKey]);
      checkedList = checkedList.filter(
        (checkedKey) => !filterChildren.includes(checkedKey),
      );
      // const parentKey = node[parentValueKey];
      // if (parentKey && withChildren) {
      //   parentValueKeyMap.current[parentKey].checked -= 1;
      //   // 如果子级有一个反选，则同步将父级删除
      //   checkedList = checkedList.filter(checkedKey => checkedKey !== parentKey);
      // }
    }
    setSelectedList([...checkedList]);
  }

  function handleEvent(event, searchValue) {
    switch (event) {
      // 根据 ”是否同时勾选子级“ 字段动态决定树形组件 联动效果
      case 'WITHCHILDREN':
        setSearchParams({ ...searchParam, withChildren: searchValue?.[0] });
        break;
      default:
        break;
    }
  }

  function handleSearch(params) {
    setSearchParams(params);
    getTreeData(false, params);
  }

  function formatValue(treeData, parent, map, keys) {
    treeData.forEach((data) => {
      data.key = data[valueKey];
      data.title = data[labelKey];
      keys.push(data.key);
      if (parent) map[parent].children.push(data.key);
      if (Array.isArray(data[childrenKey])) {
        map[data.key] = {
          all: data[childrenKey].length,
          checked: 0,
          children: [],
        };
        formatValue(data[childrenKey], data.key, map, keys);
      }
    });
  }

  function handleSubmit() {
    let checkedList = selectedList;
    checkedList = Array.isArray(checkedList)
      ? Array.from(new Set(checkedList))
      : undefined;
    if (checkedList?.length > 1000) {
      message.error(
        messages(
          'base.selected.limit.warning',
          { params: { count: 1000 } } /* 所选公司不能超过1000 */,
        ),
      );
      return;
    }
    onChange(checkedList);
    setVisible(false);
  }

  function handleClose() {
    setVisible(false);
    setSelectedList(Array.isArray(value) ? [...value] : []);
  }

  /**
   * 过滤查询出的条件数据
   * @param {*} checkType
   */
  function filterByCheckType(checkType = ALL, dataList) {
    const treeList = [];
    const newCheckedList = Array.isArray(selectedList) ? selectedList : [];
    if (checkType === ALL) return dataList;
    else if (checkType === SELECT) {
      recurseTree(dataList, (data) => {
        if (newCheckedList.includes(data[valueKey])) {
          const temp = data;
          temp.tempChildren = data[childrenKey];
          delete data[childrenKey];
          treeList.push(temp);
        }
      });
    } else if (checkType === NOT_SELECT) {
      recurseTree(dataList, (data) => {
        if (!newCheckedList.includes(data[valueKey])) {
          const temp = data;
          temp.tempChildren = data[childrenKey];
          delete data[childrenKey];
          treeList.push(data);
        }
      });
    }
    return treeList;
  }

  function recurseTree(dataList, callback) {
    dataList.forEach((data) => {
      callback(data);
      if (Array.isArray(data[childrenKey]) || data.tempChildren) {
        recurseTree(data[childrenKey] || data.tempChildren, callback);
      }
    });
  }

  function handleClear(e) {
    stopPropagation(e);
    setSelectedList([]);
    onChange(undefined);
  }

  function stopPropagation(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function customRenderTitle(node) {
    if (extraLabelKey) {
      return (
        <>
          <span>{node.code ? `${node.code}-` : ''}</span>
          <span>{node.title}</span>
          <span style={{ marginLeft: 8 }}>{node[extraLabelKey]}</span>
        </>
      );
    } else if (titleRender) {
      return titleRender(node);
    } else return node.title;
  }

  function onPaginationChange(page, size) {
    getTreeData(false, { ...searchParam, current: page, size });
    pageInfo.current = page;
    pageInfo.size = size;
    setPageInfo(pageInfo);
  }

  function handleClearSearchParams() {
    setSearchParams({ withChildren: false });
  }

  return (
    <div className="tree-select-model">
      <span className="label">{label}</span>
      <span className="value inputValue position-relative">
        <span
          className="inputSpanText"
          ref={spanRef}
          style={{ padding: 0, minWidth: 30 }}
        />
        <Input
          placeholder={messages('common.all')}
          disabled={disabled}
          autoComplete="off"
          ref={inputRef}
          onFocus={onInputFocus}
          className="position-absolute"
          style={{ left: 10 }}
          value={valueText}
          bordered={false}
        />
        <span>
          {value?.length ? (
            <CloseOutlined
              onClick={handleClear}
              onFocus={stopPropagation}
              style={{
                position: 'relative',
                verticalAlign: 'middle',
                marginLeft: 8,
                color: 'rgba(0, 0, 0, 0.25)',
              }}
            />
          ) : (
            ''
          )}
        </span>
      </span>
      <CaretDownOutlined
        style={{
          fontSize: 10,
          color: 'rgb(51, 51, 51)',
          verticalAlign: 'middle',
        }}
        onClick={onInputFocus}
      />
      <Modal
        visible={visible}
        title={messages(modalTitle || 'chooser.data.company')}
        width={580}
        onOk={handleSubmit}
        onCancel={handleClose}
        wrapClassName="ts-model"
        destroyOnClose
        bodyStyle={{ maxHeight: 545 }}
      >
        <div className="ts-model-search-area">
          <SearchAreaLov
            searchForm={searchForm}
            eventHandle={handleEvent}
            submitHandle={handleSearch}
            clearHandle={handleClearSearchParams}
            maxLength={1}
            btnCol={12}
          />
        </div>
        <Spin spinning={spinning}>
          <div className="tree-select-model-container">
            <Tree
              checkable
              blockNode
              selectable={false}
              treeData={optionList}
              onCheck={handleCheck}
              checkedKeys={selectedList}
              checkStrictly
              titleRender={customRenderTitle}
              expandedKeys={expandedKeys}
              onExpand={setExpandedKeys}
            />
          </div>
        </Spin>
        <Pagination
          showLessItems
          size="small"
          total={pageInfo.total}
          current={pageInfo.current}
          onChange={onPaginationChange}
          style={{ margin: 10 }}
          showTotal={(total, range) =>
            messages('common.show.total', {
              range0: `${range[0]}`,
              range1: `${range[1]}`,
              total,
            })
          }
          pageSizeOptions={['5', '10', '20', '50', '100', '200', '500']}
        />
      </Modal>
    </div>
  );
}

export default TreeSelectModel;
