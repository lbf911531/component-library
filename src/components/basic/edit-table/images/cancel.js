/*
 * @Author: your name
 * @Date: 2021-09-15 11:06:44
 * @LastEditTime: 2021-09-15 14:15:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \companyCode\polaris-web-base\polaris-web-base\src\components\Widget\Template\edit-table\images\cancel.js
 */
import React from 'react';
import Icon from '@ant-design/icons';

const component = () => (
  <svg
    width="16px"
    height="16px"
    viewBox="0 0 16 16"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      id="行编辑0914"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <g
        id="行编辑_4_行保存备份-2"
        transform="translate(-1385.000000, -337.000000)"
      >
        <g id="ic_取消" transform="translate(1385.000000, 337.000000)">
          <rect id="矩形备份-8" x="0" y="0" width="16" height="16" />
          <g
            id="编组备份"
            transform="translate(3.000000, 3.000000)"
            fill="#C2C6CE"
            fillRule="nonzero"
            stroke="#C2C6CE"
            strokeWidth="0.4"
          >
            <path
              d="M5.95996495,5.00200725 L9.80781944,1.15414837 C10.0640602,0.884685815 10.0640602,0.461643332 9.80781944,0.192180782 C9.5383572,-0.0640602606 9.1153152,-0.0640602606 8.84585295,0.192180782 L4.99799848,4.04003967 L1.28012864,0.325173595 C1.018581,0.077178841 0.608714742,0.077178841 0.347167097,0.325173595 C0.0992984329,0.586389856 0.0992984329,0.995924896 0.347167097,1.25714116 L4.06502549,4.97300228 L0.192180562,8.84585165 C-0.0640601874,9.1153142 -0.0640601874,9.53835668 0.192180562,9.80781922 C0.461642804,10.0640603 0.884684804,10.0640603 1.15414703,9.80781922 L5.02699197,5.93496986 L8.74385533,9.64882946 C9.00540297,9.89682421 9.41526923,9.89682421 9.67681687,9.64882946 C9.92531459,9.38748738 9.92531459,8.97720891 9.67681687,8.71586685 L5.95996495,5.00200725 Z"
              id="路径"
            />
          </g>
        </g>
      </g>
    </g>
  </svg>
);

const CancelSvg = (props) => <Icon component={component} {...props} />;

export default CancelSvg;
