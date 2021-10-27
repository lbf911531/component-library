---
group:
  title: 表单
  path: /form
---

## 分页下拉框 SelectPartLoad

基于 Select，下拉数据分页或者懒加载

## 代码演示

```tsx
import React from 'react';
import { SelectPartLoad } from 'polard';

export default function SelectPartLoadDemo() {
  return (
    <div style={{ width: 200 }}>
      <SelectPartLoad
        placeholder="请输入"
        url="/base/api/data/list/page"
        valueKey="id"
        labelKey="name"
      />
    </div>
  );
}
```

## 属性

> 具有 Select 的属性，组件内设置了 Select 的属性 `filterOption: false`

| 参数            | 说明                                                            | 类型                | 默认值 |
| --------------- | --------------------------------------------------------------- | ------------------- | ------ |
| url             | 接口                                                            | string              |        |
| method          | 请求方法                                                        | string              | 'get'  |
| params          | 接口参数                                                        | object              |        |
| valueKey        | Options 的 key 取值字段                                         | string              | 'id'   |
| labelKey        | Options 的 label 取值字段，code-name 写法 labelKey: 'code-name' | string              |        |
| searchKey       | 搜索字段（默认取 labelKey）                                     | string              |        |
| renderOptions   | 渲染 options 方法                                               | (data) => ReactNode |        |
| lazyLoad        | 是否启用懒加载                                                  | boolean             | false  |
| showPagination  | 是否启用分页                                                    | boolean             | false  |
| size            | 分页时的 size                                                   | number              | 10     |
| showSearch      | 同 Select 属性，是否启用搜索                                    | boolean             | true   |
| labelInValue    | 同 Select 属性                                                  | boolean             | true   |
| value           | value 是对象（Select 属性 labelInValue 为 true）                | { key, value }      |        |
| model           | 新增了 singleTag（tags 模式下的单选）                           | string              |        |
| extraOptionList | 额外的下拉数据                                                  | array               |        |
| defaultGetList  | 是否默认获取第一页数据                                          | Boolean             | false  |
| forceGetList    | 是否每次展开下拉框都重新获取第一页数据                          | boolean             | false  |

## Select 滚动加载 用法（默认）

```javascript
<FormItem {...formItemLayout} label={this.$t('adjust.applicable.personnel')}>
  {getFieldDecorator('ABC', {
    initialValue: { key: '0010', label: '测试报账单类型拼接名称' },
  })(
    <SelectPartLoad
      url={`${config.expenseUrl}/api/expense/report/type/query`}
      params={{
        setOfBooksId: '1083762150064451585',
      }}
      valueKey="reportTypeCode"
      labelKey="reportTypeCode-reportTypeName" // code-name
    />,
  )}
</FormItem>
```

## Select 显示分页器 分页用法

```javascript
<FormItem {...formItemLayout} label={this.$t('adjust.applicable.personnel')}>
  {getFieldDecorator('ABC', {
    initialValue: { key: '0010', label: '测试报账单类型拼接名称' },
  })(
    <SelectPartLoad
      url={`${config.expenseUrl}/api/expense/report/type/query`}
      params={{
        setOfBooksId: '1083762150064451585',
      }}
      valueKey="reportTypeCode"
      labelKey="reportTypeName"
      showPagination // 显示分页器
    />,
  )}
</FormItem>
```

## 自定义 renderOptions 用法

```javascript
<SelectPartLoad
  url={`${config.expenseUrl}/api/expense/report/type/query`}
  params={{
    setOfBooksId: '1083762150064451585',
  }}
  renderOptions={(data) => {
    return data.map((item) => {
      return (
        <Select.Option key={item.reportTypeCode}>
          {item.reportTypeName}
        </Select.Option>
      );
    });
  }}
  searchKey="reportTypeName"
/>
```

## 和 edit-table 使用

```javascript
import { EditTable } from 'polard'
<EditTable
  columns={[
    {
      title: '测试币种',
      type: 'selectPartLoad',
      dataIndex: 'currency',
      url: `${config.mdataUrl}/api/currency/base`,
      labelKey: 'currencyName',
      valueKey: 'currencyCode',
      valueKeySelect: "id",
      labelKeySelect: "name:,
    },
  ]}
  onRowSave={(record, status, callback) => {
    const result = {
      ...record,
      currencyCode: record.currency && record.currency.key,
      currencyName: record.currency && record.currency.label,
      currency: record.currency && record.currency.label,
    }
    callback(result);
  }}
/>
```

注意： 在可编辑表格中，分页下拉框的 `valueKey,labelKey`的意义被`valueKeySelect,labelKeySelect`替代

- 普通情况下，valueKey,labelKey 指的是下拉框请求数据中，定义访问数据的路径，指定某具体字段的值作为下拉框的 value
- 可编辑表格情况下， valueKey 指的是下拉框的 value 映射到表格行数据中的路径，
  如：

```ts
// 下拉框下拉菜单数据
var options = [{
  id: 1,
  code: "first",
  name: "下拉框请求数据1",
},{
  id: 2,
  code: "second",
  name: "下拉框请求数据2",
}]

// 普通情况：
<SelectPartLoad
  valueKey="code"
  labelKey="name"
/>
// 可编辑表格中使用：

// 表格数据：
var dataSource = [{
  rowId: 1,
  rowName: "第一行",
  sort: "1",
  currencyCode: "first",
  currencyName: "下拉框请求数据1", //  currencyCode currencyName这一对是一个分页下拉组件的值
  amount: 300, // 这是数字输入框的值
  i18n: { // 这是多语言输入框的值
    rowName: [{
      "zh_cn": "第一行"
    },{
      "en_us": "first row"
    }]
  }
}];
<SelectPartLoad
  valueKeySelect="code"
  labelKeySelect="name"
  valueKey="currencyCode"
  labelKey="currencyName"
/>
```

## SearchArea 中使用

```javascript
{
  type: 'select_part_load',
  id: 'companyId',
  label: this.$t('base.documentary.company'), // 单据公司
  getUrl: `${config.mdataUrl}/api/company/available/by/setOfBooks/enable/dataAuth`,
  getParams: { setOfBooksId: props.company.setOfBooksId },
  valueKey: 'id',
  labelKey: 'name',
  searchKey: 'keyword',
  event: 'COMPANY_CHANGE',
  colSpan: 6,
},

// 提交 submitHandle，返回处理过的数据 { companyId: value }
// 事件 eventHandle，返回未处理数据 { companyId: { key, label } }
```
