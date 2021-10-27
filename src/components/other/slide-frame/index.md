---
group:
  title: 其他
  path: /other
---

## 侧拉框 SlideFrame

## 代码演示

```tsx
import React, { useState } from 'react';
import { SlideFrame, CustomSwitch, CodeInput } from 'polard';
import { Form, Button } from 'antd';

export default function SlideFrameDemo() {
  const [visible, setVisible] = useState(false);
  function controlVisible() {
    setVisible((pre) => !pre);
  }

  function handleSubmit(params) {
    console.log(params);
    controlVisible();
  }

  return (
    <>
      <button onClick={controlVisible}>click me</button>
      <SlideFrame show={visible} title="侧拉框" onClose={controlVisible}>
        <Form
          onFinish={handleSubmit}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 10 }}
        >
          <Form.Item
            name="code"
            label="代码"
            rules={[{ required: true, message: '请输入' }]}
          >
            <CodeInput />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <CustomSwitch />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 10 }}>
            <Button type="primary" htmlType="submit">
              确定
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={controlVisible}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </SlideFrame>
    </>
  );
}
```

## API

| 参数           | 说明                                                 | 类型             | 默认值 |
| -------------- | ---------------------------------------------------- | ---------------- | ------ |
| width          | 宽度                                                 | string/number    | -      |
| widthType      | 内置宽度类型(narrow: "660px",wider: "760px")         | "narrow"/"wider" | -      |
| needReMount    | 是否需要更改挂载的父级元素，配合 mountComponent 使用 | boolean          | -      |
| style          | 样式                                                 | CSSProperties    | -      |
| mountComponent | 挂载的父级                                           | reactNode        | -      |
| title          | 标题                                                 | string           | -      |
| show           | 是否显示                                             | boolean          | -      |
| hasMask        | 是否有遮罩层                                         | boolean          | -      |
| onClose        | 点击遮罩层或右上方 x 时触发的事件                    | () => void       | -      |
| afterClose     | 关闭后触发的事件，用于更新外层的 show 值             | (params) => void | -      |
| params         | 外部传入内部组件 props                               | {}               | -      |
| hasFooter      | 是否有低端操作区                                     | boolean          | -      |
| shorter        | 侧划框仅遮盖当前页面                                 | boolean          | -      |
