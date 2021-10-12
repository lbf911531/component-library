---
group:
  title: 组件
  path: /components
---

## 开关选择器 CustomSwitch

## 代码演示

### 基本使用

```tsx
import React, { useState } from 'react';
import { CustomSwitch } from 'polard';

export default function CustomSwitchDemo() {
  const [status, setSwitchValue] = useState(false);

  return (
    <>
      <CustomSwitch onChange={setSwitchValue} checked={status} />
      <br />
      <br />
      状态：<span style={{ marginLeft: 8 }}>{status ? '启用' : '禁用'}</span>
    </>
  );
}
```

### 嵌套 form

```tsx
import React from 'react';
import { CustomSwitch } from 'polard';
import { Form, Button } from 'antd';

export default function CustomSwitchDemo() {
  function onFinish(params) {
    console.log('params:', params);
  }

  return (
    <Form onFinish={onFinish}>
      <Form.Item
        name="enabled"
        label="状态"
        valuePropName="checked"
        initialValue={true}
      >
        <CustomSwitch />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
```

## API

| 参数          | 说明           | 类型                     | 默认值 |
| ------------- | -------------- | ------------------------ | ------ |
| disabled      | 是否禁用       | boolean                  | false  |
| checked       | 值，是否选中   | boolean                  | false  |
| checkedDesc   | 选中时的内容   | string                   | "启用" |
| uncheckedDesc | 未选中时的内容 | string                   | "禁用" |
| onChange      | 变化时的回调   | function(checked, event) | -      |
