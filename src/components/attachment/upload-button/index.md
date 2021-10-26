---
group:
  title: 附件
  path: /attachment

order: 2
---

## 上传附件 UploadButton

点击按钮上传附件

## API

| 参数                 | 说明                                          | 默认值                                    |
| -------------------- | --------------------------------------------- | ----------------------------------------- | --- |
| uploadUrl            | 上传 URL                                      | `${config.fileUrl}/api/upload/attachment` |
| attachmentType       | 附件 attachmentType                           |                                           |
| pkName               | 附件 pkName                                   | 'default'                                 |
| pkValue              | 附件 pkValue                                  |                                           |
| bucketName           | 附件 bucketName                               |                                           |
| fileNum              | 最大上传文件的数量                            | null                                      |
| defaultFileList      | 默认上传的文件列表，每项必须包含：uid，name   | []                                        |
| defaultOids          | 默认上传的文件列表 id 数组                    | []                                        |
| uploadHandle         | 附件 onChange                                 | (ids?: string[], info?: object) => void   |
| uploadHandleFileList | 附件 FileList onChange                        | (fileList) => void                        |
| valueKey             | 返回值取值字段                                | "id"                                      |
| multiple             | 是否支持多选文件                              | true                                      |
| disabled             | 是否禁用                                      | false                                     |
| buttonText           | 上传按钮的名称                                |                                           |
| isUseAttachmentId    | 删除附件时是否使用 id                         | false                                     |
| fileSize             | 附件大小限制                                  | 500(500MB)                                |     |
| compressionRatio     | 压缩后的图片质量 值在 0 与 1 之间, 1 质量最好 | undefined                                 |
| compressionSize      | 图片超过多大才压缩                            | 0                                         |
| fileListFlag         | 用于刷新默认 defaultFileList,defaultOids 值   | false                                     |
| noZoom               | 是否隐藏上传按钮                              | false                                     |
| className            | 上传组件的 class 类型                         |                                           |

## 使用例子

```tsx
import React from 'react';
import { UploadButton } from 'polard';
import config from 'config';

export default function Test() {
  return (
    <UploadButton
      uploadUrl={`${config.fileUrl}/api/upload/static/attachment`}
      pkName="EXP_REPORT_LINE"
      // pkValue={record.id}
      // uploadHandle={oidList => { this.setState({ attachmentOid: oidList }) }}
      // uploadHandleFileList={list => { this.setState({ fileList: list }) }}
      // defaultFileList={fileList}
      // defaultOids={attachmentOid}
    />
  );
}
```
