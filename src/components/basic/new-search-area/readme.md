---
nav:
  title: 组件
group:
  title: 基础
  path: /basic
---

## 新搜索组件 SearchArea

- 用法与原 search-area 组件基本一致，在原组件基础上，改造了样式，增加了存取筛选方法的功能，此功能需要配置`uniqueKey`方可使用，否则执行保存方案逻辑时将会阻塞
- 注意： 由于搜索组件要配合筛选方案功能，因此内部组件会在初始挂载时，强制执行一次组件的`submitHandle`方法，此时页面将有可能重复调用获取列表页数据的接口，因此需要外界视情况自行控制

## 代码演示

```tsx
import React, { useRef, useState } from 'react';
import { NewSearchArea } from 'polard';

export default function NewSearchAreaDemo() {
  const searchAreaRef = useRef();
  const [searchForm] = useState([
    {
      type: 'input',
      id: 'dimensionCode',
      placeholder: '请输入',
      label: '维度代码',
      colSpan: 6,
    },

    {
      type: 'input',
      id: 'dimensionName',
      placeholder: '请输入',
      label: '维度名称',
      colSpan: 6,
    },

    {
      type: 'value_list',
      id: 'enabled',
      label: '状态',
      colSpan: 6,
      options: [
        { value: false, label: '启用' },
        { value: true, label: '禁用' },
      ],
      valueKey: 'value',
      labelKey: 'label',
    },
    {
      type: 'lov',
      id: 'companyId',
      code: 'company',
      labelKey: 'name',
      valueKey: 'id',
      label: '公司',
      single: true,
    },
    {
      type: 'select_part_load',
      id: 'employeeId',
      getUrl: '/base/api/data/list/page',
      valueKey: 'id',
      labelKey: 'name',
      label: '员工',
    },
  ]);

  function handleSubmit(values) {
    // console.log(searchAreaRef.current,'searchAreaRef.current')
    console.log(values);
  }

  return (
    <div>
      <NewSearchArea
        searchForm={searchForm}
        submitHandle={handleSubmit}
        wrappedComponentRef={(ref) => {
          searchAreaRef.current = ref;
        }}
        searchCodeKey="dimension-definition"
        uniqueKey="dimension-definition"
      />
    </div>
  );
}
```

## API

| 属性              | 说明                                                                                                            | 值类型                          | 默认值 |
| ----------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------- | ------ |
| uniqueKey         | 为每个搜索区组件设置一个唯一性字符串，用于保存筛选方案时，能将当前页面和该组件的方案关联                        | string                          | -      |
| extraSearch       | 配置额外的搜索参数，id 为字段名，placeholder 配置占位符，一般用于单据查询编号，或固定搜索字段，配置后渲染输入框 | {id: xx,placeholder: "请输入" } | -      |
| handleCache       | 组件实例方法，确认开启缓存                                                                                      | function()                      | -      |
| handleSearch      | 组件实例方法，确认事件                                                                                          | function(result)                | -      |
| resetSearchForm   | 组件实例方法，重新初始化 searchForm                                                                             | function (searchForm,callback)  | -      |
| getCacheListValue | 组件实例方法，获取当前组件缓存的表单数据，默认返回表单对象，指定 field 时，仅返回该字段值                       | function(field)                 | -      |
| getFieldListValue | 组件实例方法，返回当前表单对象，用法与 form.getFieldsValue 一致                                                 | function(params)                | -      |

（组件实例方法： 指需要通过 ref 实例调用）

### <a id="reset-search-form">resetSearchForm</a>

```js
componentDidMount() {
  httpFetch.get(url,params).then(res => {
    const { searchForm } = this.state;
    if (res?.data?.systemFlag) {
      const newSearchForm = searchForm.filter(formItem => formItem.id !== 'companyId');
      this.searchAreaRef?.resetSearchForm?.(newSearchForm, () => {
        this.setState({ searchForm: newSearchForm })
      })
    }
  })
}
```

### handleCache

```markdown
// 伪代码：

<NewSearchArea
searchCodeKey="DIMENSION_DEFINE"
wrappedComponentRef={ref => { this.searchAreaRef = ref }}
/>
<Button onClick={this.onLinkToDetailPage}>详情</Button>

onLinkToDetailPage = () => {
this.searchAreaRef.handleCache();
window.location.hash = "/dimension_define/detail";
}
```

### getFieldListValue

```js
const formValues = this.searchAreaRef.getFieldListValue();
const companyValue = this.searchAreaRef.getFieldListValue(['companyId']);
```

### getCacheListValue

```js
const cacheValues = this.searchAreaRef.getCacheListValue();
const companyValue = this.searchAreaRef.getCacheListValue('companyId');
```

## 更新日志

1. `radio`,`checkbox`类型改为渲染下拉框组件
2. 由于 UI 样式设计，目前新搜索区组件只适用于列表页
3. 增加 `resetSearchForm` 方法，如若`searchForm`是在页面 didMount 时通过接口数据改写了，建议此时使用 resetSearchForm 方法通知组件内部，[详情](#reset-search-form)
4. 表单项根据输入文本，自适应宽度
