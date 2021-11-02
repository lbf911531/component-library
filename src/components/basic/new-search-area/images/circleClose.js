/*
 * @Author: your name
 * @Date: 2021-09-26 17:31:28
 * @LastEditTime: 2021-09-26 17:50:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \companyCode\polaris-web-workbench\polaris-web-workbench\src\components\common\search-area\images\circleClose.js
 */
import React from 'react';
import Icon from '@ant-design/icons';

const components = () => (
  <svg
    width="14px"
    height="14px"
    viewBox="0 0 14 14"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      id="查询修改-0901"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <g id="11-交互说明" transform="translate(-643.000000, -833.000000)">
        <g id="编组-8备份-7" transform="translate(643.000000, 833.000000)">
          <circle id="椭圆形" fill="#B2B8C0" cx="7" cy="7" r="7" />
          <path
            d="M9.52322265,9.94325 C9.2477209,10.05125 8.93471891,9.9875 8.72346756,9.78025 L7.00220661,8.061 L5.28169566,9.78025 C4.98844379,10.07325 4.51319077,10.07325 4.2199389,9.78025 C3.92668703,9.4875 3.92668703,9.01225 4.2199389,8.7195 L5.94094985,7 L4.2199389,5.28075 C3.92668703,4.98775 3.92668703,4.51275 4.2199389,4.21975 C4.51319077,3.92675 4.98844379,3.92675 5.28169566,4.21975 L7.00220661,5.93975 L8.72346756,4.21975 C9.01796944,3.93575 9.48622242,3.93975 9.77572426,4.22925 C10.0652261,4.51875 10.0692261,4.9865 9.78447432,5.28075 L8.06396337,7 L9.78447432,8.7195 C9.93197525,8.86775 10.0099758,9.0715 9.99897568,9.2805 C9.98497559,9.57575 9.79872441,9.83525 9.52322265,9.94325"
            id="路径"
            fill="#FFFFFF"
            fillRule="nonzero"
          />
        </g>
      </g>
    </g>
  </svg>
);

const circleCloseSvg = (props) => <Icon component={components} {...props} />;

export default circleCloseSvg;
