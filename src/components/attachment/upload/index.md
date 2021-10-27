---
group:
  title: 附件
  path: /attachment
  order: 3
---

## 可拖拽上传附件 Upload

可拖拽或点击上传附件

## API

| 参数              | 说明                                              | 默认值                                           |
| ----------------- | ------------------------------------------------- | ------------------------------------------------ |
| uploadUrl         | 上传 URL                                          | `${config.fileUrl}/api/upload/static/attachment` |
| attachmentType    | 附件类型                                          | -                                                |
| pkValue           | 附件 pkValue                                      | -                                                |
| pkName            | 附件 pkName                                       | "default"                                        |
| fileNum           | 最大上传文件的数量                                | null                                             |
| extensionName     | 附件支持的扩展名                                  | '.rar .zip .doc .docx .pdf .jpg...'              |
| defaultFileList   | 默认上传的文件列表，每项必须包含：uid，name       | []                                               |
| defaultOids       | 默认上传的文件列表 id                             | []                                               |
| needAllResponse   | 是否返回上传文件的所有内容，为 false 时只返回 Oid | false                                            |
| valueKey          | 返回值取值字段                                    | "id"                                             |
| uploadHandle      | 附件 onChange                                     | (ids) => void                                    |
| isUseAttachmentId | 删除附件时是否使用 id                             | false                                            |
| unitSize          | 附件大小单位                                      | MB                                               |
| fileSize          | 附件大小限制                                      | 500MB                                            |
| disabled          | 禁用组件                                          | false                                            |

## 使用例子

```tsx
import React from 'react';
import { Upload } from 'polard';
import config from 'config';

export default function Test() {
  return (
    <Upload
      pkName="EXP_REPORT_HEADER"
      uploadUrl={`${config.fileUrl}/api/upload/static/attachment`}
      // pkValue={record.id}
      // uploadHandle={oidList => { this.setState({ attachmentOid: oidList }) }}
      // defaultFileList={fileList}
      // defaultOids={uploadOids}
    />
  );
}
```
