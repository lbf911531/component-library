---
nav:
  title: 组件
group:
  title: 业务组件
  path: /business-components
---

## 单据提交按钮 DocumentSubmitBtn

该组件用于单据详情页面提交，内集成普通按钮及模态框，当该单据勾连工作流自选节点时，将先弹出模态框供用户选取审批人并调用接口后，再执行由外部传入的 onClick 函数。如若未勾连，则直接走外部的 onClick

## 代码演示

```tsx
import React, { useState } from 'react';
import { DocumentSubmitBtn } from 'polard';

export default function DocumentSubmitBtnDemo() {
  const [submitLoading, setSubmitLoading] = useState(false);

  function handleCancel() {
    setSubmitLoading(false);
  }

  function handleSubmit() {
    // setSubmitLoading(true);
    alert('后续逻辑执行...');
    // 后续逻辑....
  }

  return (
    <div>
      <DocumentSubmitBtn
        // approvalRule="RETURN_NODE"
        onClick={handleSubmit}
        btnLoading={submitLoading}
        url="/workflow/api/document/submit"
      />
    </div>
  );
}
```

## API

| 参数         | 说明                                                                                        | 类型               | 默认值 |
| ------------ | ------------------------------------------------------------------------------------------- | ------------------ | ------ |
| documentType | 单据类型(doc-submit-btn-wfl 无该属性)                                                       | string             | -      |
| documentOid  | 单据 oid(doc-submit-btn-wfl 无该属性)                                                       | string             | -      |
| onClick      | 外部传入的提交事件                                                                          | function(callback) | -      |
| url          | 接口 url,判断是否有关联自选节点                                                             | string             | -      |
| className    | 提交按钮的 class                                                                            | string             | -      |
| btnLoading   | 外部控制提交按钮 loading                                                                    | boolean            | false  |
| block        | 将按钮宽度调整为其父宽度的选项                                                              | boolean            | false  |
| approvalRule | ['RETURN_NODE', 'RETURN_WORKBANCH']数组包含 approvalRule 值的时候，强制只执行传入的 onClick | string             | -      |
