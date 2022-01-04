---
nav:
  title: 组件
group:
  title: 表单
  path: /form
---

# SelectPartTable

基于 Select，下拉数据分页

## 属性

> 用法同 `select-part-load` 和 `Lov`

| 参数 | 说明     | 类型          | 默认值 |
| ---- | -------- | ------------- | ------ |
| mode | 是否多选 | 多选 multiple |        |

## 赋默认值

- 多选，value 需要是完整的值 [{ id, .... }];
- 单选，{ id, ... }

## 模糊搜索

- `searchKey`，搜索字段 `Lov`默认是`keywords`
