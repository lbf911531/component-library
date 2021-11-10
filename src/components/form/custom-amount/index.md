---
nav:
  title: 组件
group:
  title: 表单
  path: /form
---

## 金额输入框 CustomAmount

## 代码演示

```tsx
import React, { useState } from 'react';
import { CustomAmount } from 'polard';

export default function CustomAmountDemo() {
  const [disabled, setDisabled] = useState(false);

  function handleDisabled() {
    setDisabled((pre) => !pre);
  }

  return (
    <>
      <a onClick={handleDisabled}>禁用/启用</a>
      <CustomAmount
        onChange={(v) => {
          console.log(v);
        }}
        disabled={disabled}
      />
    </>
  );
}
```

## API

| 属性      | 说明               | 类型            | 默认值            |
| --------- | ------------------ | --------------- | ----------------- |
| disabled  | 是否禁用           | boolean         | false             |
| step      | 步进               | number          | 0.01              |
| precision | 保留 n 位小数      | number          | 2                 |
| min       | 最小值             | number          | 0                 |
| ignoreMin | 不设置最小值       | boolean         | true              |
| style     | 输入框样式         | CSSProperties   | { width: '100%' } |
| onChange  | 值变化的回调       | function(value) | () => { }         |
| maxLength | 限制整数加小数个数 | number          | 20                |
