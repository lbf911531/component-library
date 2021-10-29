---
nav:
  title: 组件
group:
  title: 其他
  path: /other
---

## Excel 导出 ExcelExport

指定需要导出的表格列后，将有关列的表格数据导出到 excel 中

## 代码演示

```tsx
import React, { useState } from 'react';
import { ExcelExporter } from 'polard';
// import FileSaver from 'file-saver';

export default function ExcelExportDemo() {
  const [excelVisible, setExcelVisible] = useState(false);
  const exportColumns = [
    { title: '代码', dataIndex: 'dimensionItemCode' },
    { title: '名称', dataIndex: 'dimensionItemName' },
    { title: '状态', dataIndex: 'enabled' },
  ];
  function onExportCancel() {
    setExcelVisible((pre) => !pre);
  }

  function onConfirmExport(result) {
    console.log('导出中...');
    return;
    const { dimensionId } = this.state;
    result, dimensionId;
    httpFetch
      .post('/api/item/export', result, {}, { responseType: 'arraybuffer' })
      .then((res) => {
        if (res.status === 200) {
          console.log('导出成功');
          const fileName =
            res.headers['content-disposition'].split('filename=')[1];
          const f = new Blob([res.data]);
          // FileSaver.saveAs(f, decodeURIComponent(fileName));
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <>
      <button onClick={onExportCancel}>click me</button>
      <ExcelExporter
        visible={excelVisible}
        onOk={onConfirmExport}
        columns={exportColumns}
        canCheckVersion={false}
        fileName="导出"
        onCancel={onExportCancel}
        excelItem="PREPAYMENT_FINANCIAL_QUERY"
      />
    </>
  );
}
```

## API

| 参数            | 说明                                                                   | 类型                      | 默认值 |
| --------------- | ---------------------------------------------------------------------- | ------------------------- | ------ |
| visible         | 导出弹框是否可见                                                       | boolean                   | false  |
| onCancel        | 点击取消回调                                                           | () => void                | -      |
| onOk            | 选择导出列回调，                                                       | (result) => void          | -      |
| columns         | 需要导出的列                                                           | [columns](#excel-columns) | -      |
| fileName        | 导出的文件名称                                                         | string                    | -      |
| excelItem       | 导出文件大类; 这个东东为什么要加，我也不清楚                           | string                    | -      |
| canCheckVersion | 是否可以修改文件格式，默认为 true, 如果为 false 则全部默认为 excel2007 | boolean                   | true   |

## <a id="excel-columns">columns</a>

```ts
const columns = [
  { title: string, dataIndex: string },
  // ...
];
// title: 表格列名
// dataIndex: 对应后台需要的字段名
```
