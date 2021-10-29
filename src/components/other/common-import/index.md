---
nav:
  title: 组件
group:
  title: 其他
  path: /other
  order: 5
---

## 导入 CommonImporter

## API

| 参数          | 说明                                                               | 默认值                                              |
| ------------- | ------------------------------------------------------------------ | --------------------------------------------------- |
| visible       | 是否显示弹框                                                       | false                                               |
| templateCode  | 导入模板代码                                                       |                                                     |
| propertiesUrl | 获取模板的接口                                                     | `${config.baseUrl}/api/excel/import/get/properties` |
| extraParams   | 接口参数                                                           |                                                     |
| title         | 弹框标题                                                           | 根据模板配置                                        |
| onClose       | 关闭弹框                                                           |                                                     |
| onConfirm     | 自定义确定导入方法 ({ templateProperties, batchNo }, func) => void |                                                     |
| showTemplate  | 是否获取模版配置信息                                               | true                                                |
| afterSuccess  | 导入成功的回调                                                     |                                                     |

## 使用例子

```tsx
import React, { useState, useMemo } from 'react';
import { Button } from 'antd';
import { CommonImporter } from 'polard';
import config from 'config';

export default function Test() {
  const [visible, setVisible] = useState(false);

  function onClick() {
    setVisible(true);
  }

  function afterSuccess() {}

  return (
    <div>
      <Button onClick={onClick}>导入</Button>

      <CommonImporter
        visible={visible}
        templateCode="test"
        propertiesUrl={`${config.expenseUrl}/api/excel/import/get/properties`}
        onClose={() => setVisible(false)}
        afterSuccess={afterSuccess}
      />
    </div>
  );
}
```
