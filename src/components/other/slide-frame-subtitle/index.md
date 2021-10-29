---
nav:
  title: 组件
group:
  title: 其他
  path: /other
---

## 侧拉框副标题 SlideFrameSubtitle

应 UI 设计规范，封装侧拉框内副标题组件，避免各功能自定义

## 代码演示

```tsx
import React, { useState } from 'react';
import { SlideFrame, SlideFrameSubtitle } from 'polard';

export default function SlideFrameSubtitleDemo() {
  const [visible, setVisible] = useState(false);
  function controlVisible() {
    setVisible((pre) => !pre);
  }

  function handleClick() {
    alert('副标题点击事件');
  }

  return (
    <>
      <button onClick={controlVisible}>click me</button>
      <SlideFrame
        show={visible}
        title="侧拉框"
        onClose={controlVisible}
        widthType="narrow"
      >
        <SlideFrameSubtitle
          text="这是副标题"
          extraText={<b>编辑</b>}
          extraClickEvent={handleClick}
          widthType="middle"
        />
        以下是具体内容
      </SlideFrame>
    </>
  );
}
```

## API

| 参数            | 说明                                            | 类型                     | 默认值   |
| --------------- | ----------------------------------------------- | ------------------------ | -------- |
| text            | 副标题文本                                      | string                   | -        |
| widthType       | 指定宽度类型，narrow: 568 wide: 720 middle: 620 | "narrow"/"wide"/"middle" | "narrow" |
| width           | 自定义组件宽度，当 widthType 不满足时使用       | string/number            | -        |
| extraText       | 副标题文本                                      | ReactNode                | -        |
| extraClickEvent | 副标题点击事件                                  | function()               | -        |
| bodyStyle       | 样式                                            | CSSProperties            | -        |
