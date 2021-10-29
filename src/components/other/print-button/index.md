---
nav:
  title: 组件
group:
  title: 其他
  path: /other
---

## 局部打印 PrintButton

根据传入的元素 id，临时创建块级区域，调用`window.print`方法打印

## 代码演示

```tsx
import React from 'react';
import { PrintButton } from 'polard';

export default function PrintButtonDemo() {
  return (
    <div>
      <div>
        <h1>标题</h1>
        <p id="print-content">内容</p>
      </div>
      <PrintButton printId="print-content" />
    </div>
  );
}
```

## API

| 参数    | 说明                       | 类型   | 默认值 |
| ------- | -------------------------- | ------ | ------ |
| printId | 需要打印的元素的 id 属性值 | string | -      |
