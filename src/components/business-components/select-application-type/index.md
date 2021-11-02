---
nav:
  title: 组件
group:
  title: 业务组件
  path: /business-components

order: 6
---

## 选择费用类型 SelectApplicationType

## 用法示例

- 基础用法

```tsx
import React from 'react';
import { SelectApplicationType } from 'polard';
import config from 'config';

export default function Test() {
  return (
    <SelectApplicationType
      title="费用类型"
      url={`${config.expenseUrl}/api/expense/report/type/section/expense/type`}
      // handleOkCheck={this.handleOkCheck}
      // onChange={this.handleSelectExpenseType}
      // params={{
      //   expenseReportTypeId: headerData.documentTypeId,
      //   companyId: headerData.companyId,
      //   departmentId: headerData.departmentId,
      //   employeeId: headerData.applicantId,
      // }}
    />
  );
}
```

- hideSelect 用法

```tsx
import React, { useRef } from 'react';
import { Button } from 'antd';
import { SelectApplicationType } from 'polard';
import config from 'config';

export default function Test() {
  const eleRef = useRef();

  function onClick() {
    if (eleRef.current) {
      eleRef.current.onDropdownVisibleChange(true);
    }
  }

  return (
    <div>
      <Button onClick={onClick}>选择费用类型</Button>
      <SelectApplicationType
        title="费用类型"
        url={`${config.expenseUrl}/api/expense/report/type/section/expense/type`}
        ref={eleRef}
        // onChange={this.selectHandle}
        // bodyParams={expenseTypeIds}
        hideSelect
      />
    </div>
  );
}
```

## API

| 参数          | 说明                                                                               | 类型                                   | 默认值                   |
| ------------- | ---------------------------------------------------------------------------------- | -------------------------------------- | ------------------------ |
| value         | 选中的值                                                                           | { id, name }                           |                          |
| title         | 标题                                                                               | string                                 | expense.application.type |
| onChange      | 选择类型，点确定后的回调                                                           | (values) => void                       |
| handleOkCheck | onChange 前执行, callback 指 onChange 方法，selected 当前选中，preValue 上一个数据 | (callback, selected, preValue) => void |                          |
| disabled      | 不可操作                                                                           | boolean                                |                          |
| url           | 获取数据接口                                                                       | string                                 |                          |
| method        | 接口 http method                                                                   | string                                 | get                      |
| params        | 接口参数(拼接在 url 上)                                                            | object                                 |                          |
| bodyParams    | post 参数                                                                          | object                                 |                          |
| allowClear    | 是否允许清空                                                                       | boolean                                |                          |
| placeholder   | 选择框 placeholder                                                                 | string                                 |                          |
| hideSelect    | 隐藏选择框（通过 ref 调用组件 onDropdownVisibleChange，显示弹框）                  | boolean                                |                          |
| historyNum    | 最近使用的数量                                                                     | boolean                                | 6                        |
