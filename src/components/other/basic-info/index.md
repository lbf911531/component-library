---
nav:
  title: 组件
group:
  title: 其他
  path: /other
---

## 信息展示 BasicInfo

## 代码演示

```tsx
import React from 'react';
import { BasicInfo } from 'polard';

export default function BasicInfoDemo() {
  const infoList = [
    {
      type: 'input',
      id: 'itemCode',
      label: '代码',
    },
    {
      type: 'input',
      id: 'itemName',
      label: '名字',
    },
    {
      type: 'input',
      id: 'itemTypeName',
      label: '类型',
    },
    {
      type: 'switch',
      id: 'status',
      label: '状态',
    },
  ];

  const infoData = {
    itemCode: 'code',
    itemName: 'name',
    itemTypeName: 'type',
    status: true,
  };

  function handleSubmit(params) {
    console.log(params);
  }

  return (
    <div>
      <h3>隐藏编辑按钮：</h3>
      <BasicInfo infoList={infoList} infoData={infoData} isHideEditBtn />
      <h3>切换编辑：</h3>
      <BasicInfo
        infoList={infoList}
        infoData={infoData}
        updateHandle={handleSubmit}
      />
    </div>
  );
}
```

## API

| 参数           | 说明                                                                          | 类型                  | 默认值 |
| -------------- | ----------------------------------------------------------------------------- | --------------------- | ------ |
| infoList       | 传入的基础信息列表                                                            | array                 | -      |
| infoData       | 传入的基础信息值                                                              | object                | -      |
| updateHandle   | 更新表单事件，只用来显示信息，不需要更新                                      | function(params)      | -      |
| updateState    | 更新状态（true／false）                                                       | boolean               | -      |
| loading        | 保存按钮状态（true／false）                                                   | boolean               | -      |
| eventHandle    | 表单的 onChang 事件                                                           | function(event,value) | -      |
| isHideEditBtn  | 是否隐藏编辑按钮                                                              | boolean               | -      |
| handleEdit     | 点击编辑时如果有其他操作不想使用 searchArea 时则设置，不设置则渲染 searchArea | function()            | -      |
| runEditor      | 第一次是否是进行 editor 方法                                                  | boolean               | -      |
| cancelHandle   | 点击取消事件事件                                                              | function(params)      | -      |
| isDefineBySelf | 自定义一个 card title 上面的点击按钮                                          | boolean               | -      |
