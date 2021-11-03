import React, { useRef, useState } from 'react';
import { Input, Cascader } from 'antd';
import { cloneDeep } from 'lodash';
import './index.less';

function CascaderFilter(props) {
  const { filterSecondData, ...rest } = props;
  let { options } = rest;
  const hasOptions = options && options.length > 0;
  let originOption;
  const curActiveValRef = useRef([]);
  const [inputValue, setInputValue] = useState('');

  /**
   * onClick事件
   * @param {value} e
   */
  function handleInputClick(e) {
    e.stopPropagation();
  }

  /**
   * onKeyDown事件
   * @param {value} e
   */
  function handleKeyDown(e) {
    // SPACE => https://github.com/ant-design/ant-design/issues/16871
    if (e.keyCode === 8 || e.keyCode === 32) {
      e.stopPropagation();
    }
  }

  /**
   * onChange事件
   * @param {value} e
   */
  function handleInputChange(e) {
    setInputValue(e.target.value);
  }

  /**
   * handleOnPressEnter事件
   * @param {value} e
   */
  function handleOnPressEnter(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  /**
   * 显示
   * @param {数据} menus
   * @returns
   */
  function dropdownRender(menus) {
    const {
      props: { activeValue = [] },
    } = menus;
    const flag = activeValue.length > 0;
    if (activeValue && activeValue[0] !== curActiveValRef.current[0]) {
      setInputValue('');
    }
    curActiveValRef.current = activeValue;
    return (
      <div className="filterSecondClass">
        <Input
          style={{ display: flag ? 'block' : 'none' }}
          className="filterInputClass"
          onClick={filterSecondData ? handleInputClick : undefined}
          onKeyDown={handleKeyDown}
          onPressEnter={handleOnPressEnter}
          value={inputValue}
          onChange={filterSecondData ? handleInputChange : undefined}
        />
        <div className="filterMenusClass">{menus}</div>
      </div>
    );
  }

  /**
   * 触发render时选择最近option
   */

  if (!originOption && hasOptions) {
    originOption = cloneDeep(options);
  }

  if (hasOptions && inputValue) {
    options = originOption.reduce((acc, option) => {
      if (option.value === curActiveValRef.current[0]) {
        option.children = option.children.filter((item) => {
          return item.label.toLowerCase().includes(inputValue.toLowerCase());
        });
      }
      acc.push(option);
      return acc;
    }, []);
  }

  return (
    <Cascader
      {...rest}
      options={options}
      getPopupContainer={(node) => node.parentNode}
      dropdownRender={filterSecondData ? dropdownRender : undefined}
    />
  );
}

export default CascaderFilter;
