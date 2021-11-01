/*
 * @Author: your name
 * @Date: 2021-08-19 16:07:26
 * @LastEditTime: 2021-10-12 16:33:02
 * @LastEditors: Please set LastEditors
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
        <div style={{ padding: showLine ? '16px 32px' : '0 24px' }}>
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
