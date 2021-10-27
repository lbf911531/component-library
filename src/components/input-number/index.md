---
group:
  title: 组件
  path: /components
---

## 数字输入框 InputNumber

基于 antd/input-number 组件，引入`bignumber.js`，处理 javascript 数字精度丢失问题

## 代码演示

```tsx
import React, { useState } from 'react';
import { InputNumber } from 'polard';
import { Radio } from 'antd';

export default function InputNumberDemo() {
  const [size, setSize] = useState(undefined);

  function onChange(value) {
    console.log('changed', value);
  }

  function onChangeSize(e) {
    setSize(e.target.value);
  }

  return (
    <div style={{ width: 200 }}>
      <h3 style={{ margin: '0 0 1em' }}>限定上下限：</h3>
      <InputNumber
        min={1}
        max={10}
        step={0.01}
        defaultValue={3.33333333333333333}
        onChange={onChange}
        style={{ width: '100%' }}
      />
      <h3 style={{ margin: '1em 0' }}>尺寸：</h3>
      <Radio.Group
        onChange={onChangeSize}
        buttonStyle="solid"
        style={{ marginBottom: '10px' }}
      >
        <Radio.Button value="large">大</Radio.Button>
        <Radio.Button value="middle">中</Radio.Button>
        <Radio.Button value="small">小</Radio.Button>
      </Radio.Group>
      <InputNumber
        min={1}
        max={10}
        defaultValue={3.33333333333333333}
        onChange={onChange}
        style={{ width: '100%' }}
        size={size}
      />
      <h3 style={{ margin: '1em 0' }}>格式化：</h3>
      <InputNumber
        min={1}
        max={10}
        defaultValue={3.3556}
        style={{ width: '100%' }}
        formatter={(value) =>
          `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        }
        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
      />
    </div>
  );
}
```

## API

| 参数         | 说明                                                       | 类型                                | 默认值 |
| ------------ | ---------------------------------------------------------- | ----------------------------------- | ------ |
| disabled     | 是否禁用                                                   | boolean                             | false  |
| autoFocus    | 自动获取焦点                                               | boolean                             | false  |
| defaultValue | 初始值                                                     | number                              | -      |
| value        | 值                                                         | number                              | -      |
| step         | 每次改变步数，可以为小数                                   | number/string                       | -      |
| min          | 最小值                                                     | number                              | -      |
| max          | 最大值                                                     | number                              | -      |
| parser       | 指定从 formatter 里转换回数字的方式，和 formatter 搭配使用 | function(string): number            | -      |
| formatter    | 指定输入框展示值的格式                                     | function(number): string            | -      |
| onChange     | 变化回调                                                   | function(value: number/string/null) | -      |

具体 API 可参考 antd 官网 v4.12.0 及以下版本的属性
[antd/input-number](https://ant.design/components/input-number-cn/)
