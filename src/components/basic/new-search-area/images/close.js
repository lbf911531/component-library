/*
 * @Author: your name
 * @Date: 2021-09-27 16:00:33
 * @LastEditTime: 2021-09-27 16:02:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \companyCode\polaris-web-workbench\polaris-web-workbench\src\components\common\search-area\images\close.js
 */
import React from 'react';
import Icon from '@ant-design/icons';

const components = () => (
  <svg
    width="8px"
    height="8px"
    viewBox="0 0 8 8"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      id="查询修改-0901"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
      opacity="0.202264695"
    >
      <g
        id="11-交互说明"
        transform="translate(-771.000000, -798.000000)"
        fill="#111111"
        fillRule="nonzero"
      >
        <g id="编组备份-18" transform="translate(771.000000, 798.000000)">
          <path
            d="M0.159034653,0.86200495 C-0.0350852339,0.667885063 -0.0350852339,0.353154541 0.159034653,0.159034653 C0.353154541,-0.0350852339 0.667885063,-0.0350852339 0.86200495,0.159034653 L7.79269802,7.08972772 C7.91827157,7.21530127 7.96731362,7.39832871 7.92135051,7.56986536 C7.8753874,7.74140202 7.74140202,7.8753874 7.56986536,7.92135051 C7.39832871,7.96731362 7.21530127,7.91827157 7.08972772,7.79269802 L0.159034653,0.86200495 Z"
            id="路径"
          />
          <path
            d="M7.08972772,0.159034653 C7.28384761,-0.0350852339 7.59857813,-0.0350852339 7.79269802,0.159034653 C7.98681791,0.353154541 7.98681791,0.667885063 7.79269802,0.86200495 L0.86200495,7.79269802 C0.736431402,7.91827157 0.553403966,7.96731362 0.381867309,7.92135051 C0.210330651,7.8753874 0.076345269,7.74140202 0.0303821601,7.56986536 C-0.0155809489,7.39832871 0.0334611045,7.21530127 0.159034653,7.08972772 L7.08972772,0.159034653 Z"
            id="路径"
          />
        </g>
      </g>
    </g>
  </svg>
);

const closeSvg = (props) => <Icon component={components} {...props} />;

export default closeSvg;
