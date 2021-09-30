---
group:
  title: 组件
  path: /components
---

## 代码输入框 CodeInput

<Alert type="info">
  校验： 任意字母，数字，符号"."，符号"-"；唯有符合该校验规则的结果，才能置入输入框。
</Alert>

## 代码演示 Demo

### 基本使用

```tsx
import React from 'react';
import { CodeInput } from 'polard';

export default function CodeInputDemo() {
  return (
    <div style={{ width: 200 }}>
      <CodeInput placeholder="请输入" />
      <br />
      <br />
      <CodeInput placeholder="请输入" disabled />
    </div>
  );
}
```

### 尺寸设置

```tsx
import React, { useState } from 'react';
import { CodeInput } from 'polard';
import { Radio } from 'antd';

export default function CodeInputDemo() {
  // size === undefined 时等同于size: "middle"
  const [size, setInputSize] = useState('middle');

  function handleSizeChange(e) {
    setInputSize(e.target.value);
  }

  return (
    <div style={{ width: 400 }}>
      <Radio.Group value={size} onChange={handleSizeChange}>
        <Radio.Button value="large">Large</Radio.Button>
        <Radio.Button value="middle">Default</Radio.Button>
        <Radio.Button value="small">Small</Radio.Button>
      </Radio.Group>
      <br />
      <br />
      <CodeInput size={size} placeholder="请输入" />
    </div>
  );
}
```

### 定义正则

```tsx
import React, { useState } from 'react';
import { CodeInput } from 'polard';

export default function CodeInputDemo() {
  return (
    <div style={{ width: 400 }}>
      {/* (reg=/^[\w.-]+$/)  */}
      <h3>默认</h3>
      <CodeInput placeholder="请输入" />
      {/* (reg=/^[\w-]+$/)  */}
      <h3>禁止输入"." </h3>
      <CodeInput placeholder="请输入" supportPoint={false} />
      <h3>自定义正则</h3>
      <CodeInput placeholder="请输入" checkReg={/^[0-9]+$/} />
    </div>
  );
}
```

## API

| 参数        | 说明                          | 类型                     | 默认值    |
| ----------- | ----------------------------- | ------------------------ | --------- |
| placeholder | 占位符                        | string                   | -         |
| disabled    | 是否禁用组件                  | boolean                  | false     |
| size        | 组件尺寸                      | "large"/"middle"/"small" | middle    |
| inputRef    | 组件内 input 输入框的实例对象 | object                   | -         |
| onBlur      | 失焦事件                      | function                 | e => void |
| onFocus     | 聚焦事件                      | function                 | e => void |
