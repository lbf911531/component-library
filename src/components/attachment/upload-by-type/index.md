---
nav:
  title: 组件
group:
  title: 附件
  path: /attachment

order: 3
---

## 分类上传附件 UploadByType

分类附件上传。

## API

| 参数              | 说明                                                                                    | 默认值                                      |
| ----------------- | --------------------------------------------------------------------------------------- | ------------------------------------------- |
| uploadUrl         | 附件上传 url                                                                            | `${config.fileUrl}/api/upload/attachment`   |
| defaultFileList   | 附件列表                                                                                | []                                          |
| pkValue           | 附件 pkValue                                                                            |                                             |
| pkName            | 附件 pkName                                                                             |                                             |
| attachmentType    | 附件 attachmentType                                                                     |                                             |
| params            | 附件类型相关信息 { attachmentFormatsList, attachmentName, formatFlag, lowerLimit, ... } |                                             |
| multiple          | 是否支持多选文件                                                                        | true                                        |
| disabled          | 是否禁用                                                                                | false                                       |
| isUseAttachmentId | 删除附件时是否使用 id                                                                   | false                                       |
| uploadHandle      | 附件 onChange                                                                           | (ids?: string[], fileList?: object) => void |
| fileListChange    | 附件 fileList onChange                                                                  | (fileList?: object) => void                 |
| fileNum           | 最大上传文件的数量                                                                      | Infinity                                    |
| noDelete          | 是否隐藏删除按钮                                                                        | false                                       |
| required          | 是否必输                                                                                | false                                       |
| readOnly          | 是否只读                                                                                | false                                       |

## 使用例子

```tsx
import React, { useState } from 'react';
import { UploadByType } from 'polard';
import config from 'config';

export default function Test() {
  const [params] = useState({
    attachmentFormatsList: [],
    attachmentName: '测试附件类型',
    formatFlag: true,
    sizeFlag: true,
  });

  return (
    <div style={{ width: 300 }}>
      <UploadByType
        params={params}
        uploadUrl={`${config.fileUrl}/api/upload/static/attachment`}
        pkName="EXP_REPORT_LINE"
        // pkValue={record.id}
        // uploadHandle={oidList => { this.setState({ attachmentOid: oidList }) }}
        // uploadHandleFileList={list => { this.setState({ fileList: list }) }}
        // defaultFileList={fileList}
        // defaultOids={attachmentOid}
      />
    </div>
  );
}
```
