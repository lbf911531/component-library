/*
 * @Author: cong.guo@hand-china.com
 * @Date: 2021-09-10 13:11:16
 * @LastEditors: Please set LastEditors
 * @Version: 1.0.0
 * @Description: 下拉选择 展示2个字段以上
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Select, Space, Tooltip, Tag } from 'antd';
import httpFetch from 'share/httpFetch';
import { messages } from '../../utils';
import TableOptionsRender from './table-options-render';
import CloseSvg from '../select-part-load/images/close';
import './index.less';

function SelectPartTable(props) {
  const {
    value: propsValue,
    onChange: propsOnChange,
    page: propsSize,
    disabled,
    defaultGetList,
    forceGetList: propsForceGetList,
    columns,
    getPopupContainer,
    placeholder,
    allowClear,
    style,
    isSearchArea,
    cusSuffixIcon,
    cusRemoveIcon,
    labelKey,
    valueKey,
    mode,
    url: propsUrl,
    params: prosParams,
    requestBody: propsRequestBody,
    onBlur: handleBlur = () => {},
    onFocus: handleFocus,
    handleFocusDiv,
  } = props;

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [extraOptions, setExtraOptions] = useState([]);
  const [value, setValue] = useState(propsValue);
  const [forceGetList, setForceGetList] = useState(propsForceGetList);

  const pageInfo = useRef({ size: propsSize || 10, page: 0 });
  const searchText = useRef(null);
  const fetchTimes = useRef(0);
  const canGetList = useRef();
  const loadFlag = useRef(false);

  const selectValue = useMemo(() => {
    if (Array.isArray(value)) {
      const exist = value.every((val) => val[labelKey]);
      if (exist) {
        return value.map((val) => ({
          label: getLabel(labelKey, val),
          key: val[valueKey],
        }));
      } else {
        return messages('base.has.choose.count', {
          params: { count: value.length },
        });
      }
    } else {
      return value
        ? getLabel(labelKey, value)
        : mode === 'multiple'
        ? []
        : undefined;
    }
  }, [value]);

  const data = useMemo(() => {
    return [...extraOptions, ...options];
  }, [extraOptions, options]);

  const classNames = useMemo(() => {
    return value
      ? allowClear === undefined || allowClear !== false
        ? 'value'
        : 'value notAllowClear'
      : 'value valueNull';
  }, [value, allowClear]);

  useEffect(() => {
    setValue(propsValue);
  }, [propsValue]);

  useEffect(() => {
    if (defaultGetList) {
      getList(props);
    }
  }, [defaultGetList]);

  useEffect(() => {
    setForceGetList(true);
  }, [propsUrl, labelKey, valueKey, prosParams, propsRequestBody]);

  function getList(curProps, { page: curPage, size: curSize } = {}, next) {
    const {
      url,
      params,
      method,
      searchKey,
      labelKey: curLabelKey,
      extraOptionList,
    } = curProps || props;
    const searchField = searchKey || curLabelKey;
    const searchParams = searchField
      ? { [searchField]: searchText.current }
      : {};
    const page = curPage === undefined ? pageInfo.current.page : curPage;
    const size =
      curSize === undefined
        ? pageInfo.current.size
        : curSize === 'all'
        ? 9999
        : curSize;
    const queryParams = {
      ...(params || {}),
      ...searchParams,
      page,
      size,
    };

    fetchTimes.current += 1;
    const curTimes = fetchTimes.current; // 支持post

    let { requestBody } = curProps || props;
    const { paramAsBody } = curProps || props;
    let isQueryFlag = false;
    if (paramAsBody) {
      requestBody = { ...(requestBody || {}), ...queryParams };
    } else if (method === 'get') {
      // get请求，params放到requestBody上， 原本的requestBody绝对不可能需要使用
      requestBody = queryParams;
    } else if (
      method === 'post' &&
      queryParams.constructor === Object &&
      Object.keys(queryParams).length
    ) {
      isQueryFlag = !!(
        queryParams.constructor === Object && Object.keys(queryParams).length
      );
      // post请求，且有额外参数要放到请求头上，那么将flag置为true,在axios上传第五参数
    }

    if (!url) {
      let extraOption = [];
      if (Array.isArray(extraOptionList) && searchField) {
        extraOption = searchText.current
          ? extraOptionList.filter((item) =>
              String(item[searchField]).includes(searchText.current),
            )
          : extraOptionList;
      }
      setOptions(extraOption);
      loadFlag.current = false;
      canGetList.current = false;
      return;
    }

    setLoading(true);
    httpFetch[method](
      url,
      requestBody,
      null,
      null,
      isQueryFlag ? queryParams : {},
    )
      .then((res) => {
        if (!Array.isArray(res.data) || curTimes !== fetchTimes.current) return;
        const total = Number(res.headers['x-total-count']) || res.data.length;
        const replaceData = page === 0;

        let extraOption = [];
        if (Array.isArray(extraOptionList) && searchField && replaceData) {
          extraOption = searchText.current
            ? extraOptionList.filter((item) =>
                String(item[searchField]).includes(searchText.current),
              )
            : extraOptionList;
        }

        const curTotal = Math.round((page + 1) * size);
        const canLoadMore = total ? total > curTotal : false;

        pageInfo.current = { page, size, total: total || res.data.length };
        loadFlag.current = canLoadMore;
        canGetList.current = true;

        setOptions((pre) =>
          replaceData ? [...res.data] : [...pre, ...res.data],
        );
        setExtraOptions(extraOption);
        setLoading(false);

        if (curSize === 'all') {
          onChange(res.data);
        }
        if (typeof next === 'function') {
          next();
        }
      })
      .catch(() => {
        canGetList.current = true;
        setLoading(false);
        if (typeof next === 'function') {
          next();
        }
      });
  }

  function onDropdownVisibleChange(isOpen) {
    setOpen(isOpen);
    if (isOpen) {
      if (handleFocus) handleFocus();
      if (!options.length || forceGetList) {
        setOptions([]);
        setForceGetList(propsForceGetList);
        getList(null, { page: 0 });
      }
    } else if (searchText.current) {
      setOptions([]);
      pageInfo.current = { ...pageInfo.current, page: 0, total: 0 };
    }
    searchText.current = null;
  }

  function onPopupScroll(e) {
    const { clientHeight, scrollHeight, scrollTop } = e.target;
    const isBottom = clientHeight + scrollTop >= scrollHeight - 30;

    if (canGetList.current && isBottom && loadFlag.current) {
      canGetList.current = false;
      getList(null, { page: pageInfo.current.page + 1 });
    }
  }

  function onSelectAllHandle(all, callback) {
    if (all) {
      // getList(null, { page: 0, size: 'all' }, callback); // 全选
      onChange([...options]); // 选择当前
      callback();
    } else {
      onChange();
    }
  }

  function dropdownRender() {
    return (
      <TableOptionsRender
        {...props}
        open={open}
        options={data}
        value={value}
        onChange={onChange}
        onSearch={onSearch}
        onPopupScroll={onPopupScroll}
        setOpen={setOpen}
        total={pageInfo.current.total}
        columns={columns}
        onSelectAllHandle={onSelectAllHandle}
        handleFocusDiv={handleFocusDiv}
      />
    );
  }

  function tagRender(tagProps) {
    const { label, closable, onClose } = tagProps;
    return (
      <Tag
        closable={closable}
        onClose={onClose}
        className="ant-select-selection-item"
        title={label}
        closeIcon={<CloseSvg onMouseDown={preventDefault} />}
      >
        <span className="ant-select-selection-item-content">{label}</span>
      </Tag>
    );
  }

  function onChange(val) {
    setValue(val);
    if (propsOnChange) {
      propsOnChange(val);
    }
  }

  function onSearch(val) {
    searchText.current = val;
    getList(null, { page: 0 });
  }

  function handleControlOpen(e) {
    preventDefault(e);
    onDropdownVisibleChange(!open);
  }

  function preventDefault(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  function getLabel(label, item) {
    const multipleLabel = String(label).includes('-');
    if (multipleLabel) {
      return String(label)
        .split('-')
        .map(
          (field) =>
            item[field.replace('{', '').replace('}', '').replace('$', '')],
        )
        .filter((val) => val)
        .join('-');
    } else {
      const { componentType, showLabel, renderLabel } = props; // 判断lov中的下拉框
      if (componentType === 'select') {
        if (showLabel) return item[showLabel] || item[label];
        else if (item.code) return `${item.code}-${item[label]}`;
        else if (renderLabel && typeof renderLabel === 'function')
          return renderLabel(item);
        else return item[label];
      } else return item[label];
    }
  }

  function renderMaxTagPlaceholder(omittedValues) {
    return (
      <Tooltip
        placement="top"
        title={omittedValues.map((op, index) => (
          <span key={op.key}>
            {`${op.label}${index === omittedValues.length - 1 ? '' : '、'}`}
          </span>
        ))}
        overlayStyle={{
          maxWidth: 300,
          ...(selectValue?.length > 20
            ? { maxHeight: 300, overflowY: 'auto' }
            : {}),
        }}
        visible={omittedValues.length ? undefined : false}
      >
        {messages('base.count.options' /* {count}个选项 */, {
          params: { count: omittedValues.length },
        })}
        ...
      </Tooltip>
    );
  }

  function onSelectChange(val) {
    if (val?.length) {
      const newVal = val.reduce((pre, cur) => ({ ...pre, [cur.key]: cur }), {});
      const newResult = value.filter((v) => newVal[v[valueKey]]);
      onChange(newResult);
    } else {
      onChange();
    }
  }

  return (
    <Space
      style={{ width: style?.width || '100%' }}
      direction={isSearchArea ? undefined : 'vertical'}
    >
      <Select
        labelInValue={Array.isArray(selectValue)}
        value={selectValue}
        loading={loading}
        disabled={disabled}
        showSearch={false}
        placeholder={placeholder}
        dropdownRender={dropdownRender}
        onDropdownVisibleChange={onDropdownVisibleChange}
        getPopupContainer={getPopupContainer}
        dropdownMatchSelectWidth={500}
        open={open}
        onBlur={(e) => {
          handleBlur(e, open);
        }}
        onClear={() => {
          setOptions([]); 
          pageInfo.current = { ...pageInfo.current, page: -1 };
        }}
        allowClear={cusRemoveIcon ? false : allowClear}
        onChange={onSelectChange}
        suffixIcon={
          cusRemoveIcon && allowClear !== false && value ? (
            <span
              onMouseDown={preventDefault}
              onClick={() => {
                onChange();
              }}
            >
              {cusRemoveIcon}
            </span>
          ) : cusRemoveIcon ? null : undefined
        }
        mode={mode}
        className={`select-part-table multiple-tag ${classNames}`}
        dropdownStyle={{ padding: 0 }}
        maxTagCount={isSearchArea ? 1 : 'responsive'}
        maxTagPlaceholder={renderMaxTagPlaceholder}
        tagRender={tagRender}
        style={{ width: '100%' }}
      />
      {cusSuffixIcon ? (
        <span
          className="lovDropIcon"
          onClick={handleControlOpen}
          onMouseDown={preventDefault}
        >
          {cusSuffixIcon}
        </span>
      ) : null}
    </Space>
  );
}

SelectPartTable.defaultProps = {
  method: 'get',
  valueKey: 'id',
  showSearch: true,
};

export default SelectPartTable;
