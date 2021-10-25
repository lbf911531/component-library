---
group:
  title: 业务组件
  path: /business-components
---

## 预算校验/预算进度 BudgetTips/BudgetProgressDetail

## 预算校验 BudgetTips

### 代码演示

```tsx
import React, { useState } from 'react';
import { Button } from 'antd';
import { BudgetTips } from 'polard';

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

      <BudgetTips
        budgetCheckMessage={dataSource}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={onOk}
      />
    </div>
  );
}
```

### API

| 参数               | 说明                  | 类型     | 默认值 |
| ------------------ | --------------------- | -------- | ------ |
| visible            | 弹框是否显示          | boolean  | false  |
| budgetCheckMessage | 数据                  | Array    | []     |
| onCancel           | 关闭                  | Function |        |
| onOk               | 确定                  | Function |        |
| maskClosable       | 同 Modal maskClosable | boolean  |

## 预算进度信息 BudgetProgressDetail

### 代码演示

```tsx
import React, { useState } from 'react';
import { Button } from 'antd';
import { BudgetProgressDetail } from 'polard';

export default function Test() {
  const [visible, setVisible] = useState(false);

  function onClick() {
    setVisible(true);
  }

  return (
    <div>
      <Button onClick={onClick}>查看</Button>

      <BudgetProgressDetail
        baseParams={{}}
        visible={visible}
        onCancel={() => setVisible(false)}
      />
    </div>
  );
}
```

### API

| 参数       | 说明         | 类型     | 默认值 |
| ---------- | ------------ | -------- | ------ |
| visible    | 弹框是否显示 | boolean  | false  |
| onCancel   | 关闭         | Function |        |
| baseParams | 请求参数     | Object   |        |
