import React, { useState, useEffect } from 'react';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Checkbox } from 'antd';
import Folder from '@/assets/folder@2x.png';
import { messages } from 'utils/utils';
import UploadFileList from '../../attachment/upload-file-list';
import { canExportPdf, filterCanExportPdf, transformToObject } from './utils';

function RenderItem(props) {
  const {
    documentNumber,
    attachments,
    onSelectChange,
    downloadFormat,
    onPreview,
  } = props;

  const [expand, setExpand] = useState(!!attachments.length);
  const [checkedList, setCheckedList] = useState({});
  const [selectedNum, setSelectedNum] = useState(0);
  const [initFlag, setInitFlag] = useState(true);

  useEffect(() => {
    let curChecked = checkedList;
    if (initFlag) {
      curChecked = transformToObject(attachments);
    }
    const result = filterCanExportPdf(curChecked);
    setCheckedList(result);
    setInitFlag(false);
  }, [downloadFormat]);

  useEffect(() => {
    setSelectedNum(Object.values(checkedList).length);
  }, [checkedList]);

  // 附件选择
  const itemCheckChange = (e, widget) => {
    const newCheckedList = { ...checkedList };
    const { id } = widget;
    if (e.target.checked) {
      newCheckedList[id] = widget;
    } else {
      delete newCheckedList[id];
    }
    setCheckedList(newCheckedList);
    if (onSelectChange) {
      const result = { [documentNumber]: Object.values(newCheckedList) };
      onSelectChange(result);
    }
  };

  const wrapHandle = (children, widget) => {
    const { id } = widget;
    const disabled =
      downloadFormat === 'pdf' ? !canExportPdf(widget.fileName) : false;
    return (
      <div key={id}>
        <Checkbox
          onChange={(e) => itemCheckChange(e, widget)}
          checked={!!checkedList[id]}
          className="check-item"
          disabled={disabled}
        />
        {children}
      </div>
    );
  };

  // 展开、收起
  const changeExpand = () => {
    setExpand((pre) => !pre);
  };

  return (
    <div className="attachments-wrap">
      <div className="clearfix attachments-title-wrap" onClick={changeExpand}>
        <div className="title-left over-range">
          <img src={Folder} alt="folder" className="folder-ico" />
          <span className="document-number" title={documentNumber}>
            {documentNumber}
          </span>
        </div>
        <div className="title-right over-range">
          <span className="selected-num">
            {
              messages('expense.selected.num', {
                num: selectedNum,
              }) /* 已选中{num}个 */
            }
          </span>
          <span className="total-num">
            {
              messages('expense.total.files', {
                number: attachments.length,
              }) /* 共{num}个文件 */
            }
          </span>
          <span className="expand-ico">
            {expand ? <UpOutlined /> : <DownOutlined />}
          </span>
        </div>
      </div>
      {expand ? (
        <UploadFileList
          onPreview={(index, item) => onPreview(item.id, 'id')}
          fileList={attachments}
          wrapHandle={wrapHandle}
          showRemoveIcon={false}
        />
      ) : null}
    </div>
  );
}

function RenderAttachmentsWrap(props) {
  const { attachmentList, ...rest } = props;

  return (
    Array.isArray(attachmentList) &&
    attachmentList.map((item) => {
      const { documentNumber, attachments = [] } = item;
      return (
        <RenderItem
          {...rest}
          key={documentNumber}
          documentNumber={documentNumber}
          attachments={attachments}
        />
      );
    })
  );
}

export default RenderAttachmentsWrap;
