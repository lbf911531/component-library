import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { messages, formatMoney } from '../utils';
//@ts-ignore
import config from 'config';
//@ts-ignore
import httpFetch from 'share/httpFetch';
import { Popover } from 'antd';
import WrapperConnect from '../custom-connect';
import SelectPartLoad from '../select-part-load';
import { IProps, AlignType, ILov } from './interface';
import OriginLov from './entry';

/**
 * TODO:
 * 1. 将内部获取lov配置信息提取到当前页面
 * 2. 根据lov配置信息，选择渲染lov、selectPartLoad
 */

function CompatibleLov(props: IProps) {
  const { code, selectorItem, isRenderSelect = true } = props;
  const [lov, setLov] = useState<ILov>({ columns: [], url: '' });
  const renderMap = {
    time: {
      align: 'center',
      render: (value: any) =>
        value ? moment(value).format('YYYY-MM-DD') : '-',
    },
    amount: {
      align: 'right',
      render: (value: string | number) => formatMoney(value, 2, true),
    },
    default: {
      align: 'left',
      render: (value: string | number) => (
        <Popover content={value}>{value}</Popover>
      ),
    },
  };

  useEffect(() => {
    if (isRenderSelect) {
      getLovByCode(props);
    }
  }, [code, selectorItem]);

  // 获取lov详情
  function getLovByCode(nextProps: IProps): void {
    const { lovData = {}, columnsList = [] } = nextProps;
    const columnsMap: any = {};

    if (Array.isArray(columnsList) && columnsList.length) {
      columnsList.forEach((column) => {
        if (column.dataIndex) {
          columnsMap[column.dataIndex] = column;
        }
      });
    }
    // selectorItem，code共存时，优先使用 selectorItem
    if (selectorItem && selectorItem.constructor === Object) {
      setLovIfHasSelectorItem(columnsMap);
    } else if (code) {
      if (code in lovData) {
        setLov({ ...lovData[code], key: nextProps.valueKey });
        return;
      }
      setLovDataFromBackend(columnsMap, nextProps);
    }
  }

  function setLovIfHasSelectorItem(columnsMap: any) {
    const { searchList, searchListIndex } = props;
    const columnsFlag = !!Object.keys(columnsMap).length;

    selectorItem.columns = (selectorItem?.columns || []).map((item: any) => {
      let tempItem = item;
      tempItem.title = messages(item.title);
      if (item.tooltips) {
        tempItem.render = (value: string | number) => (
          <Popover content={value}>{value}</Popover>
        );
      }
      if (columnsFlag && columnsMap[item.dataIndex]) {
        tempItem = { ...tempItem, ...columnsMap[item.dataIndex] };
      }
      return tempItem;
    });

    if (Array.isArray(searchList)) {
      const exitIds = (selectorItem?.searchForm || []).map(
        (item: any) => item.id,
      );
      const tempSearchList = searchList.filter(
        (item) => !exitIds.includes(item.id),
      );
      if (searchListIndex || searchListIndex === 0) {
        selectorItem.searchForm.splice(searchListIndex, 0, ...tempSearchList);
      } else {
        selectorItem.searchForm = (selectorItem?.searchForm || []).concat(
          tempSearchList,
        );
      }
    }
    const { paramAsBody = false } = props;
    const tempLov = { method: 'get', paramAsBody, ...selectorItem };
    setLov(tempLov);
  }

  function setLovDataFromBackend(columnsMap: any, nextProps: IProps) {
    if (!code) return;
    const {
      columnsList = [],
      searchList = [],
      searchListIndex,
      dispatch,
      needCache = true,
    } = nextProps;

    httpFetch
      .get(`${config.baseUrl}/api/lov/detail/${code}`)
      .then(({ data }: any) => {
        if (data) {
          const tempData = data;
          const {
            hideColumns = [],
            hideSearchList = [],
            paramAsBody = false,
          } = props;

          tempData.columns = data.columns
            .reduce((pre: any[], cur: any) => {
              if (!cur) {
                return pre;
              }
              if (hideColumns.includes(cur.dataIndex)) {
                return pre;
              }
              if (cur.dataIndex in columnsMap) {
                return pre;
              }

              const temp = {
                ...cur,
                title: messages(cur.title),
                width: cur.width || 200,
              };
              pre.push(addRenderFnc(temp));
              return pre;
            }, [])
            .concat(columnsList);

          const tempSearchMap: any = {};
          searchList.forEach((item) => {
            if (item.id) {
              tempSearchMap[item.id] = item;
            }
          });

          tempData.searchForm = [
            ...data.searchForm.reduce((pre: any[], cur: any) => {
              if (hideSearchList.includes(cur.id)) {
                return pre;
              }
              if (cur.id in tempSearchMap) {
                return pre;
              }
              pre.push({ ...cur, label: messages(cur.label) });
              return pre;
            }, []),
          ];

          if (searchListIndex || searchListIndex === 0) {
            tempData.searchForm.splice(searchListIndex, 0, ...searchList);
          } else {
            tempData.searchForm = tempData.searchForm.concat(searchList);
          }
          const tempLov = { ...tempData, key: nextProps.valueKey, paramAsBody };
          setLov(tempLov);
          if (needCache && dispatch) {
            dispatch({
              type: 'lov/addLovData',
              payload: { [code]: tempLov },
            });
          }
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  // 为columns的每个成员添加一个render函数
  function addRenderFnc(column: any) {
    const temp = column;
    const { fieldType } = temp;
    const type: AlignType = fieldType;
    if (fieldType) {
      const { align, render } = renderMap[type] || renderMap.default;
      temp.align = align;
      temp.render = render;
    }
    return temp;
  }

  function formatSelectValue() {
    // @ts-ignore
    const {
      value,
      single,
      valueKey,
      labelKey,
      labelInValue = true,
      lovType,
      optionLabelProp,
    } = props;
    if (!value) return undefined;
    if (single) {
      let temp = value;
      if (lovType !== 'lov') {
        temp = Array.isArray(value) && value[0] ? value[0] : value;
      }
      const final = labelInValue
        ? {
            ...temp,
            label: getLabelWhenIsSelect(labelKey, temp, optionLabelProp),
            value: temp[valueKey],
            key: temp[valueKey],
          }
        : temp[valueKey];
      return final;
    } else if (Array.isArray(value)) {
      return value.map((option: any) => ({
        ...option,
        label: option[optionLabelProp || labelKey],
        value: option[valueKey],
        key: option[valueKey],
      }));
    }
  }

  function getLabelWhenIsSelect(
    label: string,
    record: any,
    optionLabelProp: string,
  ) {
    if (optionLabelProp) return record[optionLabelProp];
    if (String(label).includes('-')) {
      return String(label)
        .split('-')
        .map(
          (field) =>
            record[field.replace('{', '').replace('}', '').replace('$', '')],
        )
        .filter((value) => value)
        .join('-');
    } else return record[label];
  }

  function handleChangeSelectValue(selected: any) {
    const { onChange, lovType, single } = props;
    if (onChange) {
      // lovType ===
      // 单选： lovType === "lov" 或者 undefined下： values是对象， 其他情况是数组
      // 多选： 是数组
      let values;
      if (selected) {
        if (single) {
          if (lovType && lovType !== 'lov') {
            values = [selected];
          } else {
            values = selected;
          }
        } else values = selected;
      }
      onChange(values);
    }
  }

  if (isRenderSelect && Array.isArray(lov.columns) && lov.columns.length <= 2) {
    return (
      <SelectPartLoad
        {...props}
        method={lov.method}
        url={lov.url}
        params={props.extraParams || props.listExtraParams}
        componentType="select"
        mode={props.single ? undefined : 'multiple'}
        value={formatSelectValue()}
        onChange={handleChangeSelectValue}
        searchKey={props.searchKey || 'keywords'}
        placeholder={
          props.placeholder
            ? messages('common.all')
            : messages('common.please.select')
        }
        allowClear={props.allowClear ?? true}
      />
    );
  }

  // @ts-ignore
  return <OriginLov {...props} lov={lov} />;
}

function mapStateToProps(state: any) {
  return {
    lovData: state?.lov?.data,
  };
}
export default WrapperConnect(mapStateToProps)(CompatibleLov);
