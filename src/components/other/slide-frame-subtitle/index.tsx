/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-10-28 11:41:47
 * @LastEditors: binfeng.long@hand-china.com
 * @LastEditTime: 2021-10-28 11:41:47
 * @Version: 1.0.0
 * @Description:
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */

/**
 * 侧拉框 副标题
 */
import React from 'react';

/**
 * props:
 * @param {*} text : 副标题文本
 * @param {*} widthType : 组件长度类型， 双排侧拉 720 单排侧拉 568
 * @param {*} width: 自定义组件长度
 * @param {*} extraText : 副标题点击事件文本
 * @param {*} extraClickEvent : 副标题点击事件
 * @param {*} bodyStyle : 样式
 */
function SlideFrameSubTitle({
  text,
  widthType = 'narrow',
  width,
  extraText,
  extraClickEvent,
  bodyStyle,
}) {
  const textBoxWidth = { narrow: 568, wide: 720, middle: 620 };

  return (
    <div
      style={{
        width: width || textBoxWidth[widthType],
        background: '#F6F6F6',
        height: 38,
        fontFamily:
          '"MicrosoftYaHei","lucida grande","lucida sans unicode", lucida, helvetica, "Hiragino Sans GB", "WenQuanYi Micro Hei", sans-serif',
        fontSize: '14px',
        color: '#333333',
        letterSpacing: 0,
        lineHeight: '14px',
        padding: '12px 16px',
        marginBottom: 16,
        ...bodyStyle,
      }}
    >
      <span style={{ fontWeight: 600 }}>{text}</span>
      {extraText && (
        <a
          style={{ marginLeft: 24 }}
          onClick={(e) => {
            e.preventDefault();
            extraClickEvent();
          }}
        >
          {extraText}
        </a>
      )}
    </div>
  );
}

export default SlideFrameSubTitle;
