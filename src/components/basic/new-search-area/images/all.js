/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-06-09 09:46:46
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-09-01 10:46:01
 * @Version: 1.0.0
 * @Description:
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */

import React from 'react';
import Icon from '@ant-design/icons';

const component = () => (
  <svg width="14px" height="12px" viewBox="0 0 14 12" version="1.1">
    <g
      id="查询列表(确认)"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
      opacity="0.426037016"
    >
      <g
        id="行编辑_1_更多操作"
        transform="translate(-244.000000, -122.000000)"
        fill="#262626"
      >
        <g id="编组-3" transform="translate(244.000000, 122.000000)">
          <rect id="矩形" x="0" y="0" width="14" height="2" rx="1" />
          <rect id="矩形备份-5" x="0" y="5" width="11" height="2" rx="1" />
          <rect id="矩形备份-6" x="0" y="10" width="7" height="2" rx="1" />
        </g>
      </g>
    </g>
  </svg>
);

const AllSvg = (props) => <Icon component={component} {...props} />;

export default AllSvg;
