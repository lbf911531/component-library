/*
 * @Author: your name
 * @Date: 2021-08-19 16:07:26
 * @LastEditTime: 2021-11-22 10:39:16
 * @LastEditors: binfeng.long@hand-china.com
 * @Description: In User Settings Edit
 * @FilePath: \companyCode\polaris-web-base\polaris-web-base\src\components\DivideContent\index.js
 */
import React from 'react';
import DivideLine from './divide-line';

export default function DivideContent({
  children,
  requirePadding = null,
  showLine = true,
}) {
  return (
    <div style={{ marginLeft: -24, marginRight: -24 }}>
      {showLine && <DivideLine />}
      {requirePadding ? (
        <div
          style={{
            padding: showLine ? '16px 32px' : '0 24px',
            marginBottom: showLine ? '-24px' : 0,
          }}
        >
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
