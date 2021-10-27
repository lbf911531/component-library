---
group:
  title: 基础
  path: /basic
  order: 1
---

## 自定义表格 CustomTable

<Alert type="info">
  该表格内部引入了axios，使用时可直接传入url，挂载时会以主动请求url返回的结果作为表格数据
</Alert>

## 代码演示

### 基本使用

```tsx
import React from 'react';
import { CustomTable } from 'polard';
import { Badge, Divider } from 'antd';

export default function CustomTableDemo() {
  const columns = [
    {
      title: '数据权限代码',
      dataIndex: 'dataAuthorityCode',
      width: 200,
    },
    {
      title: '数据权限名称',
      dataIndex: 'dataAuthorityName',
      width: 100,
    },

    {
      title: '数据权限说明',
      dataIndex: 'description',
      width: 300,
    },
  ];

  function handleEdit(record) {
    console.log(record);
  }

  return (
    <CustomTable
      columns={columns}
      url="/base/api/authority/query"
      tableKey="dataAuthorityCode"
    />
  );
}
```

### 动态设置表头

```tsx
import React from 'react';
import { CustomTable } from 'polard';
import { Badge, Divider } from 'antd';

export default function CustomTableDemo() {
  const columns = [
    {
      title: '数据权限代码',
      dataIndex: 'dataAuthorityCode',
      width: 200,
    },
    {
      title: '数据权限名称',
      dataIndex: 'dataAuthorityName',
      width: 100,
    },

    {
      title: '数据权限说明',
      dataIndex: 'description',
      width: 300,
    },
  ];

  function handleEdit(record) {
    console.log(record);
  }

  return (
    <CustomTable
      columns={columns}
      url="/base/api/authority/query"
      headSettingKey="custom_table_head_set_demo"
      tableKey="dataAuthorityCode"
    />
  );
}
```

## API

基于 Table 组件封装,因此该组件接受 antd/table 及 polard/table 的所有属性

| 参数             | 说明                                                                | 类型                                    | 默认值   |
| ---------------- | ------------------------------------------------------------------- | --------------------------------------- | -------- |
| tableKey         | 行主键, 唯一 key                                                    | string                                  | "id"     |
| isFrontPage      | 是否前端分页                                                        | boolean                                 | false    |
| tableSize        | 表格大小                                                            | "default"/"middle"/"small"              | "middle" |
| onClick          | 行点击事件                                                          | function(record)                        | -        |
| onRow            | 行上事件,同时存在 onClick,onRow 时，onClick 会覆盖 onRow 的 onClick | function(record, index)                 | -        |
| allowChecked     | 表格行是否可选择                                                    | boolean                                 | false    |
| single           | 表格行是否单选                                                      | boolean                                 | false    |
| onSelectChange   | 表格行选中后事件                                                    | function(selectedRowKeys, selectedRows) | -        |
| scrollXWidth     | 指定表格行滚动宽度                                                  | number                                  | -        |
| url              | 指定表格数据源接口                                                  | string                                  | -        |
| methodType       | 指定 url 请求方式                                                   | "get"/"post"                            | "get"    |
| notStartFromZero | 指定分页参数是否从 1 开始                                           | boolean                                 | false    |
| filterData       | 对请求结果过滤                                                      | function(data)                          | -        |
| onLoadData       | 将内部请求的结果向父级传递                                          | function(data)                          | -        |
| params           | 请求参数                                                            | object                                  | -        |
| bodyParams       | "POST" 请求下的请求体参数                                           | object                                  | -        |
| dataKey          | 指定请求结果的访问路径，res.data[dataKey]                           | string                                  | -        |
| getAmountInfo    | 获取 res.headers['amount-info']                                     | function(info:string)                   | -        |
| pagination       | 分页配置项，若设置，则与内部的 pagination 合并，相同属性以内部为主  | object                                  | -        |
| headSettingKey   | 表格是否允许动态配置表头，并指定当前表格与页面的唯一映射关系        | string                                  | -        |

---

**dataKey,notStartFromZero**

```js
// current 来自pagination 当前页
let url = `${url}?page=${
  notStartFromZero ? current : current - 1
}&size=${size}`;
axios[methodType](url)
  .then((res) => {
    // 后端返回的res中的data极为表格数据源
    const dataSource = res.data;
    // 存在dataKey时：
    // const dataSource = dataKey
    //   ? (typeof dataKey === "string " ? res.data[dataKey] : res.data.dataKey)
    //   : res.data;
    const total = res.headers['x-total-count']; // 数据总数
  })
  .catch(() => {});
```

**onRow**

```js
onRow={record => {
  return {
    onClick: event => {}, // 点击行
    onDoubleClick: event => {},
    onContextMenu: event => {},
    onMouseEnter: event => {}, // 鼠标移入行
    onMouseLeave: event => {},
  };
}}
```

---

**pagination**

| 参数             | 说明                                                     | 类型                                                                  | 默认值            |
| ---------------- | -------------------------------------------------------- | --------------------------------------------------------------------- | ----------------- |
| current          | 当前页数                                                 | number                                                                | -                 |
| defaultCurrent   | 默认的当前页数                                           | number                                                                | -                 |
| defaultPageSize  | 默认的每页条数                                           | number                                                                | -                 |
| disabled         | 禁用分页                                                 | boolean                                                               | -                 |
| hideOnSinglePage | 只有一页时是否隐藏分页器                                 | boolean                                                               | false             |
| itemRender       | 用于自定义页码的结构，可用于优化 SEO                     | (page, type: 'page'/'prev'/'next'/originalElement) => React.ReactNode | -                 |
| pageSize         | 每页条数                                                 | number                                                                | -                 |
| pageSizeOptions  | 指定每页可以显示多少条                                   | string[]                                                              | [10, 20, 50, 100] |
| responsive       | 当 size 未指定时，根据屏幕宽度自动调整尺寸               | boolean                                                               | -                 |
| showLessItems    | 是否显示较少页面内容                                     | boolean                                                               | false             |
| showQuickJumper  | 是否可以快速跳转至某页                                   | boolean                                                               | false             |
| showSizeChanger  | 是否展示 pageSize 切换器，当 total 大于 50 时默认为 true | boolean                                                               | -                 |
| showTitle        | 是否显示原生 tooltip 页码提示                            | boolean                                                               | true              |
| showTotal        | 用于显示数据总量和当前数据顺序                           | function(total, range)                                                | -                 |
| simple           | 当添加该属性时，显示为简单分页                           | boolean                                                               | -                 |
| size             | 当为 small 时，是小尺寸分页                              | default/small                                                         | default           |
| total            | 数据总数                                                 | number                                                                | 0                 |
| onChange         | 页码或 pageSize 改变的回调，参数是改变后的页码及每页条数 | function(page, pageSize)                                              | -                 |
| onShowSizeChange | pageSize 变化的回调                                      | function(current, size)                                               | -                 |
