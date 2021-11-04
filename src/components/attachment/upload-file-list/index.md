---
nav:
  title: 组件
group:
  title: 附件
  path: /attachment

order: 4
---

## 附件展示列表 UploadFileList

## 使用例子

```tsx
import React, { useState } from 'react';
import { UploadFileList } from 'polard';

export default function Test() {
  const [fileList] = useState([
    {
      id: '1111',
      attachmentId: '1111',
      staticFileUrl:
        'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png',
      fileName: 'test.png',
      fileType: 'image',
    },
    {
      id: '2222',
      attachmentId: '2222',
      staticFileUrl: 'https://www.google.cn/landing/cnexp/google-search.png',
      fileName: 'test2.png',
      fileType: 'image',
    },
  ]);

  return (
    <UploadFileList
      fileList={fileList}
      showRemoveIcon={false}
      showDownloadIcon
    />
  );
}
```

## API

| 参数             | 说明                                     | 默认值                                          |
| ---------------- | ---------------------------------------- | ----------------------------------------------- |
| fileList         | 上传的附件数组                           | []                                              |
| showRemoveIcon   | 是否展示删除附件按钮，可为函数，自定义   | true                                            |
| showPreviewIcon  | 是否展示预览附件按钮，可为函数，自定义   | true                                            |
| showDownloadIcon | 是否展示下载附件按钮，可为函数，自定义   | true                                            |
| onRemove         | 删除附件函数                             | (attachment?: object, index?: number) => void   |
| style            | 文件列表组件样式                         | {}                                              |
| wrapHandle       | 重写文件列表成员样式                     | (dom: JSX.Element, item: object) => JSX.Element |
| disabled         | 是否渲染删除附件按钮,true 为不渲染       | false                                           |
| onDownload       | 下载附件函数                             | (file: object, index?: number) => void          |
| popupContainer   | 删除按钮的确认框所在浮层挂载到目标节点上 | undefined                                       |
