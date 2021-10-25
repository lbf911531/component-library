---
group:
  title: 业务组件
  path: /business-components
---

## 费用政策提交原因 PolicyTips

## 代码演示

### 基本使用

```tsx
import React, { useState } from 'react';
import { Button } from 'antd';
import { PolicyTips } from 'polard';

export default function Test() {
  const [dataSource, setData] = useState([]);
  const [visible, setVisible] = useState(false);

  function onClick() {
    setVisible(true);
    setData([
      { documentLineId: '1', rowIndex: '1', tips: '测试', submitReason: null },
    ]);
  }

  function onOk() {}

  return (
    <div>
      <Button onClick={onClick}>提交</Button>

      <PolicyTips
        dataSource={dataSource}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={onOk}
      />
    </div>
  );
}
```

## API

| 参数           | 说明         | 类型     | 默认值 |
| -------------- | ------------ | -------- | ------ |
| visible        | 弹框是否显示 | boolean  | false  |
| dataSource     | 费用政策数据 | Array    | []     |
| onCancel       | 关闭         | Function |        |
| onOk           | 确定         | Function |        |
| confirmLoading | boolean      |          |
| readOnly       | 是否只读     | boolean  |        |
