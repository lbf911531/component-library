---
nav:
  title: 组件
group:
  title: 表单
  path: /form
---

## 多语言输入框 InputLanguage

## 代码演示

### 基本使用

```tsx
import React, { useState } from 'react';
import { InputLanguage } from 'polard';

export default function InputLanguageDemo() {
  const [language, setLanguage] = useState(undefined);

  function handleChange(value) {
    console.log(value);
  }

  return (
    <div style={{ width: 200 }}>
      <InputLanguage
        placeholder="请输入"
        value={language}
        onChange={handleChange}
        languages={{
          local: 'zh_cn',
          languageType: [
            {
              id: '1',
              languageName: '简体中文',
              enabled: true,
              language: 'zh_cn',
            },
            { id: '2', languageName: '英语', enabled: true, language: 'en_us' },
          ],
        }}
      />
    </div>
  );
}
```

### 嵌套 form

```tsx
import React from 'react';
import { InputLanguage } from 'polard';
import { Form, Button } from 'antd';

export default function InputLanguageDemo() {
  function onFinish(value) {
    console.log(value);
  }

  return (
    <div style={{ width: 200 }}>
      <Form onFinish={onFinish}>
        <Form.Item
          name="name"
          label="名字"
          rules={[{ required: true, message: '请输入' }]}
        >
          <InputLanguage placeholder="请输入" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
```

## API

| 参数          | 说明                                                                                             | 类型              | 默认值 |
| ------------- | ------------------------------------------------------------------------------------------------ | ----------------- | ------ |
| onCancel      | 语言框关闭后的回调                                                                               | function()        | -      |
| onChange      | 值变化后的回调                                                                                   | function(value)   | -      |
| disabled      | 是否禁用组件                                                                                     | boolean           | -      |
| disabledInput | 是否禁用输入框                                                                                   | boolean           | -      |
| beforeOpen    | 语言框弹开前的回调                                                                               | function()        | -      |
| placeholder   | 输入框占位符                                                                                     | string            | -      |
| valueLength   | 校验输入文本的字符长度                                                                           | number            | 80     |
| onBlur        | 输入框失焦事件                                                                                   | function()        | -      |
| type          | 渲染语言弹窗内部为普通输入框或文本框                                                             | "textarea"/"text" | -      |
| autoSize      | 语言弹窗内部文本框的尺寸，自适应内容高度，可设置为 true/false 或对象：{ minRows: 2, maxRows: 6 } | boolean/object    | false  |
| languages     | 项目语言环境， {local: string, languageType: []}，具体如下[配置语言环境](#language-type)         | array             | -      |
| value         | 组件内容，具体格式如下[value](#language-value)                                                   | object            | -      |

## <a id="language-value">value</a>

```ts
const value = {
  {
    value: "你好",
    i18n: [{
      language: "zh_cn",
      value: "你好",
    }, {
      language: "en_us",
      value: "hello",
    },
    ...
    ],
  }
}
```

## <a id="language-type">配置语言环境</a>

`languages`字段取值逻辑：

- 默认从 window.g_app.\_store(redux)中获取，
- 如果取不到，则判断渲染组件时是否通过 `props`外传
- 如若上述两者都不满足时，取组件内部定义的默认值，默认值如下：

```ts
const languages = {
  local: 'zh_cn', // 当前语言环境
  languageType: [
    {
      id: '1',
      languageName: '中国(简体中文)',
      enabled: true,
      language: 'zh_cn',
    },
  ],
  // 系统定义的语言类型，可拓展
};
```
