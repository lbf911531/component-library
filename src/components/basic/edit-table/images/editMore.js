/*
 * @Author: your name
 * @Date: 2021-09-15 15:50:50
 * @LastEditTime: 2021-09-15 15:54:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \companyCode\polaris-web-base\polaris-web-base\src\components\Widget\Template\edit-table\images\editMore.js
 */
import React from 'react';
import Icon from '@ant-design/icons';

const component = () => (
  <svg
    width="3px"
    height="15px"
    viewBox="0 0 3 15"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      id="行编辑0914修改"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <g
        id="行编辑_2_行编辑方案一"
        transform="translate(-287.000000, -333.000000)"
        fill="#999999"
      >
        <g id="ic_更多" transform="translate(287.000000, 333.000000)">
          <circle id="椭圆形" cx="1.5" cy="1.5" r="1.5" />
          <circle id="椭圆形备份" cx="1.5" cy="7.5" r="1.5" />
          <circle id="椭圆形备份-2" cx="1.5" cy="13.5" r="1.5" />
        </g>
      </g>
    </g>
  </svg>
);

const EditMoreSvg = (props) => <Icon component={component} {...props} />;

export default EditMoreSvg;
