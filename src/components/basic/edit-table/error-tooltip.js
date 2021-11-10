/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-07-30 15:39:47
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-10-27 10:17:39
 * @Version: 1.0.0
 * @Description:
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */
import React from 'react';

export default function ErrorTooltip(props) {
  const { children, info } = props;
  return (
    <div className="error-tooltip" style={{ position: 'relative' }}>
      {/* <div className={info ? "visible tooltip-info" : "tooltip-info"}>
        {info}
      </div> */}
      {children}
      <span
        style={{
          fontSize: 12,
          color: 'red',
          whiteSpace: 'normal',
          display: info ? 'inline-block' : 'none',
          lineHeight: '16px',
          paddingTop: 4,
        }}
      >
        {info}
      </span>
    </div>
  );
}
