---
nav:
  title: 组件
group:
  title: 基础
  path: /basic
---

## 列表页模板 ProTable

基于 CustomTable 和 SearchArea 封装的组件，封装了点击搜索调用 table 的 search 方法，表格的列默认组成 SearchArea 的搜索项

## 何时使用

- 页面主要由搜索和表格组成时

## 代码演示

```tsx
import React, { useRef } from 'react';
import { ProTable } from 'polard';

export default function ProTableDemo() {
  const columns = [
    {
      title: '代码',
      dataIndex: 'dataAuthorityCode',
      type: 'input',
    },
    {
      title: '名称',
      dataIndex: 'dataAuthorityName',
      type: 'input',
      hideInTable: true,
    },
    {
      title: '组织',
      dataIndex: 'setOfBooksName',
      type: 'input',
      hideInTable: true,
    },
    {
      title: '数据权限说明',
      dataIndex: 'description',
      hideInSearch: true,
      type: 'input',
    },
  ];
  const searchAreaRef = useRef();
  const tableRef = useRef();

  function handleRowClick(record) {
    console.log(record);
  }

  return (
    <ProTable
      onClick={handleRowClick}
      searchRef={(ref) => {
        searchAreaRef.current = ref;
      }}
      tableRef={(ref) => {
        tableRef.current = ref;
      }}
      columns={columns}
      url="/base/api/authority/query"
      tableKey="dataAuthorityCode"
      scroll={{ x: 1300 }}
      extraSearchField="requisitionNumber"
    >
      <button type="primary">新建</button>
    </ProTable>
  );
}
```

## API

- 具有 CustomTable 和 SearchArea 的属性，以下是有不同点的属性说明

| 参数               | 说明                                                      | 类型                                               | 默认值   |
| ------------------ | --------------------------------------------------------- | -------------------------------------------------- | -------- |
| columns            | 表格列（默认也是搜索项）                                  | Object[]                                           | -        |
| searchForm         | 在搜索和显示字段差异大时使用，同 SearchArea 的 searchForm | Object[]                                           | -        |
| searchRef          | 获取 SearchArea 组件实例                                  | ReactNode                                          | -        |
| tableRef           | 获取 CustomTable 组件实例                                 | ReactNode                                          | -        |
| beforeSearchSubmit | 搜索前对数据进行处理                                      | (values) => newValues                              | -        |
| submitHandle       | 点击搜索时触发的函数                                      | (values) => void                                   | -        |
| extraSearchField   | SearchArea 之外的搜索的字段(如 单号搜索)，默认没有        | string                                             | -        |
| placeholder        | 额外搜索 input 的 placeholder                             | string                                             | "请输入" |
| children           | ProTable 组件的内容（显示在搜索和表格中间区域）           | React                                              | -        |
| toolBarRender      | table 上方区域渲染函数                                    | (selectedRowKeys, selectedRows) => React.ReactNode | -        |
| allowChecked       | 选择，内部封装了 rowSelection                             | boolean                                            | -        |
| single             | 是否单选                                                  | boolean                                            | false    |
| onSelectChange     | allowChecked 为 true 时，选择 change 后的回调             | (selectedRowKeys, selectedRows) => void            | -        |

## columns 定义

- columns 的值同时也默认是 SearchArea 的 searchFrom 的值
- searchFrom 的 id 默认取 columns 的 dataIndex，label 默认取 columns 的 title，也可在 columns 中添加 dataIndex、label
- 若搜索和表格显示差距大时，也可再单独传入 searchForm 属性作为搜索项

| 参数           | 说明                                              | 类型          | 默认值       |
| -------------- | ------------------------------------------------- | ------------- | ------------ |
| dataIndex      | 表格列（搜索）字段                                | string        | -            |
| id             | 搜索字段（不传和 dataIndex 值相同）               | string        | -            |
| title          | 表格列（搜索）显示文字                            | string        | -            |
| label          | 搜索项文字（不传和 title 值相同）                 | string        | -            |
| hideInSearch   | 不作为搜索项，不在搜索区域显示                    | boolean       | false        |
| hideInTable    | 不作为表格列，不在表格显示                        | boolean       | false        |
| type           | 同 SearchArea                                     | string        | -            |
| showFormat     | type 为 date 时，表格中日期显示格式               | string        | 'YYYY-MM-DD' |
| searchFormat   | type 为 date 时，搜索时日期 moment.format()的格式 | string        | -            |
| precision      | type 为 inputNumber 时，小数位数                  | string/number | 2            |
| defaultGetList | type 为 select 时是否自动调接口                   | boolean       | false        |
