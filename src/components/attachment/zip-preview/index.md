---
nav:
  title: 组件
group:
  title: 附件
  path: /attachment

order: 6
---

## Zip 预览 ZipFileView

## 何时使用

预览 zip 压缩文件

## 使用例子

```tsx
import React, { useState, useMemo } from 'react';
import { Button } from 'antd';
import { ZipFileView } from 'polard';
import httpFetch from 'share/httpFetch';
import config from 'config';

export default function Demo(props) {
  const [treeData, setTreeData] = useState([]);
  const [attachment] = useState({
    id: '1',
    attachmentId: '1',
    staticFileUrl:
      'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png',
    fileName: 'test.zip',
  });
  const [previewVisible, setPreviewVisible] = useState(false);

  function onPreview(index, id) {
    httpFetch
      .get(`${config.fileUrl}/api/attachments/view/zip/tree?id=${id}`)
      .then((res) => {
        setTreeData(res.data);
        setPreviewVisible(true);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <div>
      <Button onClick={onPreview}>预览</Button>
      <ZipFileView
        visible={previewVisible}
        treeData={treeData}
        title={attachment.fileName}
        attachment={attachment}
        onClose={() => {
          setPreviewVisible(false);
        }}
      />
    </div>
  );
}
```

## API

| 参数     | 说明                                                               | 默认值 |
| -------- | ------------------------------------------------------------------ | ------ |
| onClose  | 关闭的回调参数                                                     | -      |
| visible  | 浮层是否可见                                                       | false  |
| treeData | 压缩文件包中文件名通过树状展示(格式参考 antd.Tree 组件的 treeData) | -      |
