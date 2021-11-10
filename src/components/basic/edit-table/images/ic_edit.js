import React from 'react';
import Icon from '@ant-design/icons';

const component = () => (
  <svg
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      id="查询0712"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <g
        id="行编辑_4_行保存"
        transform="translate(-1376.000000, -390.000000)"
        fill="#1790FF"
      >
        <g id="ic_--箭头" transform="translate(1376.000000, 390.000000)">
          <rect
            id="矩形"
            opacity="0.083558"
            transform="translate(12.000000, 12.000000) scale(-1, 1) translate(-12.000000, -12.000000) "
            x="0"
            y="0"
            width="24"
            height="24"
            rx="4"
          />
          <g
            id="编组"
            transform="translate(11.500000, 12.500000) scale(-1, 1) translate(-11.500000, -12.500000) translate(8.000000, 6.000000)"
            fillRule="nonzero"
          >
            <path
              d="M6.6886099,5.66875615 C6.88373454,5.82351533 6.99199015,6.06306889 6.97919891,6.31178642 C7.01654368,6.53935611 6.84032304,6.75292152 6.6886099,6.93030917 L1.20242977,12.3908148 C0.921098486,12.6536648 0.482052169,12.6462116 0.20980464,12.3739641 C-0.0624428889,12.1017166 -0.0698960917,11.6626703 0.192953943,11.381339 L5.41421963,6.2966151 L0.192953943,1.2048891 C-0.0698961779,0.923557832 -0.0624430161,0.484511445 0.209804546,0.212263882 C0.482052108,-0.0599836798 0.921098495,-0.0674368416 1.20242977,0.195413279 L6.68744288,5.66875615 L6.6886099,5.66875615 Z"
              id="路径"
            />
          </g>
        </g>
      </g>
    </g>
  </svg>
);

const EditSvg = (props) => <Icon component={component} {...props} />;

export default EditSvg;
