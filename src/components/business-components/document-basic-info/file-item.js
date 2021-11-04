import React, { useState } from 'react';
import { Tooltip, Popconfirm, message } from 'antd';
import { messages, getImgIcon } from '../../utils';

import priviewIcon from '../../../assets/priview-default.png';
import priviewActiveIcon from '../../../assets/priview-active.png';
import downloadIcon from '../../../assets/download-icon.png';
import downloadActiveIcon from '../../../assets/download-active.png';
import deleteIcon from '../../../assets/trash-default.png';
import deleteActiveIcon from '../../../assets/delete-active.png';

import './file-item.less';

function FileItem({
  title,
  attachmentOid,
  onDownload,
  onDelete,
  index,
  onPriview,
  conversionStatus,
}) {
  const [priviewActive, setPriviewActive] = useState(false);
  const [downloadActive, setDownloadActive] = useState(false);
  const [deleteActive, setDeleteActive] = useState(false);
  const [classNames, setClassNames] = useState('attach-detail-box');

  // 下载附件
  function download() {
    if (onDownload) {
      onDownload(attachmentOid);
    }
  }

  function deleteFile() {
    setClassNames('attach-detail-box');
    if (onDelete) {
      onDelete(attachmentOid, index);
    }
  }

  function priview() {
    const imgs = ['png', 'jpg', 'bmp', 'jpeg', 'gif'];
    const fileType = getFileType(title);
    if (imgs.includes(fileType) && onPriview) {
      onPriview(index);
      return;
    }

    if (conversionStatus === 'CONVERTING') {
      message.warning(messages('common.doc.converting'));
    } else if (conversionStatus === 'FAILURE') {
      message.error(messages('common.doc.conversion.failed'));
    } else if (conversionStatus === 'SUCCESS' && onPriview) {
      onPriview(index);
    } else {
      message.error(messages('common.doc.conversion.failed'));
    }
  }

  function getFileType(name) {
    return (name || '').split('.').pop().toLowerCase();
  }

  return (
    <div
      style={{ display: 'flex', width: '100%' }}
      className="attachment-item-box"
    >
      <img
        style={{ height: 24, width: 24, flex: '0 0 24px' }}
        src={getImgIcon(title)}
        alt="pic"
      />
      <div
        style={{
          marginLeft: 4,
          marginTop: '-4px',
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          width: 0,
        }}
        className={classNames}
      >
        <span className="attach-detail-title">
          <Tooltip placement="topLeft" title={title}>
            {title}
          </Tooltip>
        </span>
        <div className="attach-detail-operation">
          {getImgIcon(title, true) && (
            <Tooltip title={messages('common.preview')}>
              <img
                style={{
                  height: 10,
                  width: 10,
                  verticalAlign: 'top',
                  cursor: 'pointer',
                }}
                src={priviewActive ? priviewActiveIcon : priviewIcon}
                alt="pic"
                onMouseEnter={() => {
                  setPriviewActive(true);
                }}
                onMouseLeave={() => {
                  setPriviewActive(false);
                }}
                onClick={priview}
              />
            </Tooltip>
          )}
          <Tooltip title={messages('common.download')}>
            <img
              style={{
                height: 10,
                width: 10,
                verticalAlign: 'top',
                marginLeft: getImgIcon(title, true) ? 12 : 0,
                cursor: 'pointer',
              }}
              src={downloadActive ? downloadActiveIcon : downloadIcon}
              alt="pic"
              onClick={download}
              onMouseEnter={() => {
                setDownloadActive(true);
              }}
              onMouseLeave={() => {
                setDownloadActive(false);
              }}
            />
          </Tooltip>
          {onDelete && (
            <Tooltip title={messages('common.delete')}>
              <Popconfirm
                title={messages('common.confirm.to.delete')}
                onConfirm={deleteFile}
                onCancel={() => {
                  setClassNames('attach-detail-box');
                }}
                onVisibleChange={(flag) => {
                  if (flag) setClassNames('attach-detail-box display-block');
                  else setClassNames('attach-detail-box');
                }}
              >
                <img
                  style={{
                    height: 10,
                    width: 10,
                    verticalAlign: 'top',
                    marginLeft: 12,
                    cursor: 'pointer',
                  }}
                  src={deleteActive ? deleteActiveIcon : deleteIcon}
                  alt="pic"
                  onMouseEnter={() => {
                    setDeleteActive(true);
                  }}
                  onMouseLeave={() => {
                    setDeleteActive(false);
                  }}
                />
              </Popconfirm>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
}

export default FileItem;
