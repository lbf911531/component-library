---
nav:
  title: 组件
group:
  title: 附件
  path: /attachment

order: 5
---

## 附件预览 ImagePriview

## API

| 参数             | 说明                                         | 默认值      |
| ---------------- | -------------------------------------------- | ----------- |
| visible          | 预览浮层展开或隐藏                           | false/true  |
| title            | 图片名称                                     | -           |
| onClose          | 关闭浮层事件                                 | () => {}    |
| attachmentOid    | 附件 oid(来自后端返回数据[attachmentId])     | -           |
| onDelete         | 删除图片                                     | (oid) => {} |
| onDownload       | 下载图片                                     | (oid) => {} |
| staticFileUrl    | 附件 url(来自后端返回数据[staticFileUrl])    | -           |
| first            | 当前附件在附件数组中是否为第一成员           | false/true  |
| last             | 当前附件在附件数组中是否为最后成员           |
| onPrevious       | 翻前页                                       | () => {}    |
| onLast           | 翻后页                                       | () => {}    |
| index            | 当前附件在附件数组的下标                     | -           |
| conversionStatus | 附件状态(来自后端返回数据[conversionStatus]) |
| disabled         | 是否展示删除 icon 以便执行删除操作           | true/false  |

## 使用例子

```tsx
import React, { useState, useMemo } from 'react';
import { Button } from 'antd';
import { ImagePriview } from 'polard';

export default function Demo(props) {
  const [imageIndex, setImageIndex] = useState(0);
  const [attachments, setAttachments] = useState([
    {
      id: '1',
      attachmentId: '1',
      staticFileUrl:
        'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png',
      fileName: 'test.png',
    },
  ]);
  const [previewVisible, setPreviewVisible] = useState(false);

  const attachment = useMemo(() => {
    return attachments[imageIndex];
  }, [attachments, imageIndex]);

  function onPreview() {
    setPreviewVisible(true);
  }

  function deleteFile(oid) {
    console.log(oid);
  }

  function download(oid) {
    console.log(oid);
  }

  function handlePrevious() {}

  function handleLast() {}

  return (
    <div>
      <Button onClick={onPreview}>预览</Button>
      <ImagePriview
        attachmentOid={attachment.attachmentId}
        staticFileUrl={attachment.staticFileUrl}
        conversionStatus={attachment.conversionStatus}
        visible={previewVisible}
        url={attachment.thumbnailUrl}
        title={attachment.fileName}
        onDownload={download}
        onDelete={props.showDelete && deleteFile}
        first={imageIndex === 0}
        last={imageIndex + 1 === (attachments || []).length}
        onPrevious={handlePrevious}
        onLast={handleLast}
        index={imageIndex}
        onClose={() => {
          setPreviewVisible(false);
        }}
      />
    </div>
  );
}
```
