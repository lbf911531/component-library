---
nav:
  title: 组件
group:
  title: 基础
  path: /basic
---

## 可编辑表格 edit-table

## 代码演示

```tsx
import React, { useRef, useState } from 'react';
import { EditTable } from 'polard';

export default function EditTableDemo() {
  const editTableRef = useRef();
  const [editWithCellFlag, setFlag] = useState(false);
  const columns = [
    {
      title: '数据权限代码',
      dataIndex: 'dataAuthorityCode',
      width: 200,
      type: 'input',
      disable: true,
    },
    {
      title: '数据权限名称',
      dataIndex: 'dataAuthorityName',
      width: 100,
      type: 'language',
    },

    {
      title: '数据权限说明',
      dataIndex: 'description',
      width: 300,
      type: 'input',
    },
    {
      title: '说明',
      dataIndex: 'colSrcType',
      width: 300,
      type: 'select',
      valueKey: 'value',
      labelKey: 'label',
      options: [
        {
          value: '1',
          label: '一',
        },
      ],
    },
  ];

  function handleDelete(id) {
    console.log(id, 'delete');
  }

  function handleChangeStatus() {
    setFlag((pre) => !pre);
  }

  function handleSave(value, status, next) {
    console.log(value);
    next(true);
  }

  return (
    <div>
            <a onClick={handleChangeStatus}>切换表格编辑模式</a>
            <br />
            <br />
      <EditTable
        url="/base/api/authority/query"
        rowKey="dataAuthorityCode"
        columns={columns}
        wrappedComponentRef={(ref) => {
          editTableRef.current = ref;
        }}
        operationMap={{
          delete: {
            label: '删除',
            event: (value, record) => {
              handleDelete(record.dataAuthorityCode);
            },
            hidden: (value, record) => true,
          },
          detail: {
            // 通过如下配置，[key]自定义，格式如下，可自定义操作，与renderOption 属性作用一致
            label: '详情',
            disabled: false,
            disabled: (record) => !record.detail, // disabled 可传入一个方法，去根据 record 的值进行判断与计算
            event: (value, record) => {
              this.detailClick(record);
            },
          },
        }}
        editWithCellFlag={editWithCellFlag}
        onRowSave={handleSave}
      />
    </div>
  );
}
```

## API

| 属性             | 说明                                                                             | 类型                                                                                                                                    | 默认值 |
| ---------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| rowKey           | 表格行的 key                                                                     | string                                                                                                                                  | id     |
| hideButton       | 是否隐藏创建按钮                                                                 | bool                                                                                                                                    | false  |
| showNumber       | 是否显示序号                                                                     | bool                                                                                                                                    | false  |
| createButtonText | 创建按钮的文本                                                                   | bool                                                                                                                                    | false  |
| addOrder         | 添加新行的顺序                                                                   | 'front', 'after'                                                                                                                        | front  |
| renderOption     | 自定义操作列内容, 如果为空，则使用组件自带的操作列                               | { dataIndex: string, title: string, editRender: (value, record, index) => void, normalRender: (value, record, index) => void } : object | null   |
| url              | 请求数据的 url                                                                   | string                                                                                                                                  | ''     |
| params           | 请求的额外参数                                                                   | {}                                                                                                                                      | null   |
| dataKey          | 如果数据有嵌套，可以用这个属性设置数据源字段                                     | string                                                                                                                                  | ''     |
| onFilterData     | 格式化数据                                                                       | (data) => (newData)                                                                                                                     | null   |
| onLoadData       | 数据请求完成的回调                                                               | (response, pagination) => void                                                                                                          | null   |
| onValueChange    | 表单值输改变回调                                                                 | (column, value, record, index, row) => void                                                                                             | null   |
| onDeleteRow      | 删除一行数据的回调                                                               | (id, next : function, record) => void                                                                                                   | null   |
| onRowSave        | 保存一行数据的回调                                                               | (values, status, next: function) => void                                                                                                | null   |
| notStartFromZero | 是否使用分页器的 page 作为请求接口的 page 字段（默认从 0 开始，启用后从 1 开始） | false                                                                                                                                   |

## 方法

| 方法名          | 说明                             | 参数                               |
| --------------- | -------------------------------- | ---------------------------------- |
| editRowHandle   | 编辑一行                         | (value, record, index) => void     |
| cancleRowHandle | 取消一行                         | (value, record, index) => void     |
| okRowHandle     | 确定                             | (record) => void                   |
| deleteRowHandle | 删除一行 ｜ (id, record) => void |
| reloadData      | 刷新数据                         | () => void                         |
| getTableData    | 获取表格数据                     | (callback(data): function) => void |
| setRowValue     | 设置行数据                       | (values) => void                   |
| setCellValue    | 设置单元格数据                   | (row, column, value) => void       |
| setCellAttr     | 设置单元格属性                   | (row, column, attr) => void        |

## column

| 属性                                 | 说明                                                                           | 类型                                       | 默认值 |
| ------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------ | ------ |
| type                                 | 表单元素类型                                                                   | 'input', 'number', 'date', 'select', 'lov' | ''     |
| dataIndex                            | 绑定字段                                                                       | string                                     | ''     |
| title                                | 列的标题                                                                       | string                                     | ''     |
| required                             | 是否必填                                                                       | bool                                       | false  |
| labelKey                             | 显示绑定的 key，select 和 lov 使用                                             | string                                     | ''     |
| valueKey                             | 值绑定的 key，select 和 lov 使用                                               | string                                     | ''     |
| code                                 | lov 的 code                                                                    | string                                     | ''     |
| single                               | 是否单选                                                                       | bool                                       | false  |
| extraParams                          | lov 额外请求参数                                                               | {}                                         | ''     |
| getUrl                               | select 请求数据的 url                                                          | string                                     | ''     |
| getParams                            | select 请求数据的参数                                                          | {}                                         | null   |
| valueMap ｜ 表格数据映射到表单的方法 | (record) => (newRecord: object)                                                | null                                       |
| inverseValueMap                      | 表单数据映射到表格上的方法                                                     | (value,record) => {newRecord: object}      | null   |
| valueMapKey                          | 同时兼有 valueMap,inverseValueMap 的作用，一般用作 select，指定 value 的字段名 | string                                     | null   |
| valueMapLabel                        | 同时兼有 valueMap,inverseValueMap 的作用，一般用作 select，指定 label 的字段   | string                                     | null   |

## 更新日志

1. 增加`editWithCellFlag`属性，配置可编辑表格支持单元格编辑
2. 增加`operationMap`属性，配置可编辑表格在 单元格模式下 重定义操作栏
   operationMap 内置"delete","copy","edit" 三种操作
3. 增加`inverseValueMap`,`valueMapLabel`,`valueMapKey` 字段辅助 valueMap，对值进行处理
   （原组件内部只设置 valueMap 有隐藏的 bug，因此增加额外辅助字段，用法如下代码：）
4. 增加 ` hiddenEditMore` 属性，配置后，可编辑表格左侧的最左侧的操作栏 icon 不会默认显示，得搭配 `editWithCellFlag` 一起使用，单用无效
5. render 方法拆分为 renderEditCell 和 renderNormalCell 属性，提供分别自定义 可编辑状态下以及常态下的单元格，也可继续使用之前的 render 方法
6. 更新下拉操作栏中需要气泡确认框的操作，在 optionMap 中配置 isPopConfirm 以及 title 属性

## editWithCellFlag,hiddenEditMore 的使用

```javascript
  <EditTable
    rowKey='id'
    columns={columns}
    url=""
    params={{ ...searchParams }}
    renderOption={renderOption}
    wrappedComponentRef={ref => { this.childEditTable = ref }}
    editWithCellFlag
    hiddenEditMore
    operationMap={{
      "delete": null, // 通过为内置的同名属性设置null，可去除删除操作
      "delete": {	// 如果 页面自己定义了 delete 方法，通过这个方式传给 editTable 才能使用
        label: this.$t("mdata.delete" /* 删除 */),
        // next 方法接受两个参数 （flag：boolean | string，record.id） => void;
        // 其作用在某种程度上可以替代外界调用table.getList操作，且是 停留在当前页的数据刷新
        /*
         * flag:
            为true则调用接口刷新数据
            为false则阻塞 删除数据后的逻辑操作（包含接口刷新数据）
            为 "delete" 则不调用接口删除行数据
        */
        event: (value, record, index, next) => {this.handleDelete(record.id,next)},
      },
      "detail": { // 通过如下配置，[key]自定义，格式如下，可自定义操作，与renderOption 属性作用一致
        label: this.$t("my.contract.detail"),
        disabled: false,
        disabled: (record) => !record.detail  // disabled 可传入一个方法，去根据 record 的值进行判断与计算
        event: (value, record) => { this.detailClick(record) },
        isPopConfirm: true,		// 如果需要配置气泡确认框，配置该属性
        title: messages('workbench.initializing.credit.management.will.empt.di18n'),	// 如果配置了气泡确认框，必须配置该项，代表气泡确认框的提示
      },
    }}
  />
```

## inverseValueMap,valueMapKey, valueMapLabel

- 一般 valueMap 用在下拉框组件中，可以使用 valueMapKey, valueMapLabel 替换掉 valueMap,

- 如果需要使用 valueMap，请同时设置 inverseValueMap，该属性与 valueMap 一致为方法，但作用与 valueMap 相反，
  valueMap 时将后端数据值转化成下拉框数据（{value,label}）,inverseValueMap 则是将（{value,label}）转化成后端接受的数据格式

```javascript
var columns = [
  {
    title: this.$t('account.period.define.rule.addition-name' /* 名称附加 */),
    dataIndex: 'periodAdditionalFlagDes',
    width: 200,
    align: 'left',
    required: true,
    labelKey: 'name',
    valueKey: 'value',
    type: 'selectPartLoad',
    url: `${config.baseUrl}/api/custom/enumerations/template/by/type?type=1010`,
    valueMapKey: 'periodAdditionalFlag',
    valueMapLabel: 'periodAdditionalFlagDes',
    // valueMap: (record) => {
    //   return (record.periodAdditionalFlag && record.periodAdditionalFlagDes) ? {
    //     value: record.periodAdditionalFlag,
    //     label: record.periodAdditionalFlagDes,
    //     key: record.periodAdditionalFlag,
    //   } : undefined
    // },
    // inverseValueMap: (value,record) => {
    //   console.log(value);
    //   if (value) {
    //     return ({
    //       periodAdditionalFlag: value.value,
    //       periodAdditionalFlagDes: value.label,
    //     })
    //   }
    // },
  },
];
```

## renderEditCell, renderNormalCell 的使用

- 给了这两个属性，相当于 **自定义 可编辑状态下的单元格 以及 常规状态下的单元格**
- 除了这两个属性，还得给 `isCusRenderFormItem: true`

- demo:

````javascript
  {
    title: this.$t('budget.balance.params.value'),
      dataIndex: 'queryScope',
      width: '40%',
      align: 'center',
      type: 'input',
      isCusRenderFormItem: true,
      renderEditCell: (text, record) => {
        return (
          <div>
            <Select
                defaultValue={text.toString()}
                value={text.toString()}
                onChange={value => this.onQueryScopeChange(value, record)}
                disabled={!record.parameterCode}
            >
              {record.queryScopeList.map(item => {
                return <Option key={item.code}>{item.messageKey}</Option>;
              })}
            </Select>
            <Input
              value={"已选" + record.solutionParameterList.length + "条"}
              onClick={e => this.onListSelectorOk(e, record)}
              disabled={!(record.parameterCode && record.queryScope == '1002')}
            />
          </div>
        );
        },
        renderNormalCell: (text, record) => {
          let resultText = '';
          if (record.queryScope.toString() === '1002') {
            resultText = "已选" + record.solutionParameterList.length + "条"
          } else if (record.queryScope.toString() === '1003') {
            if (record.parameterCode === 'COMPANY') {
              resultText = this.$t('budget.balance.current.company')
            } else if (record.parameterCode === 'UNIT') {
              resultText = this.$t('budget.balance.current.department')
            } else if (record.parameterCode === 'EMPLOYEE') {
              resultText = this.$t('budget.balance.current.user')
            }
          } else {
              resultText = "全部";
          }
          return (
            <div
              onClick={() => {
              this.editTable.onChangeTdStatus(record.id, "queryScope",record, true);
              }} >
              {resultText}
            </div>
          )
        },
      }
    ```
````
