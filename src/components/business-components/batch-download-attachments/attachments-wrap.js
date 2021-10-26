import React from 'react';
import FilePreview from '../../attachment/image-preview';
import ZipFileView from '../../attachment/image-preview';
import httpFetch from 'share/httpFetch';
import config from 'config';
import { getImgIcon } from 'utils/utils';

const AttachmentsWrap = (AttachmentsContent, PreviewElement) => {
  return class Content extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        attachments: [],
        thumbnailList: [],
        previewVisible: false,
        fileType: '',
        imageIndex: 0,
        treeData: {},
        firstIndex: 0,
        lastIndex: 0,
      };
    }

    componentDidMount() {
      const { attachments } = this.props;
      if (Array.isArray(attachments) && attachments.length) {
        this.getFirstAndLast(attachments);
      }
    }

    componentWillReceiveProps(nextProps) {
      const { attachments } = this.props;
      const { attachments: curAttachments } = nextProps;
      if (
        attachments !== curAttachments ||
        attachments.length !== curAttachments.length
      ) {
        this.getFirstAndLast(curAttachments);
      }
    }

    getFirstAndLast = (fileList) => {
      const thumbnailList = [];
      const attachments = fileList.reduce((pre, cur) => {
        if (cur.attachmentName && Array.isArray(cur.attachments)) {
          const childList = cur.attachments.filter((item) => {
            return getImgIcon(item.fileName, true);
          });
          if (childList?.length) {
            thumbnailList.push({
              ...cur,
              attachments: childList.filter((child) =>
                this.notZip(child.fileName),
              ),
            });
          }
          return [...pre, ...childList];
        } else if (cur.fileName && getImgIcon(cur.fileName, true)) {
          if (this.notZip(cur.fileName)) {
            thumbnailList.push(cur);
          }
          return [...pre, cur];
        } else {
          return pre;
        }
      }, []);
      let firstIndex = null;
      let lastIndex = null;
      attachments.forEach((att, index) => {
        if (this.notZip(att.fileName)) {
          lastIndex = index;
          if (firstIndex === null) {
            firstIndex = index;
          }
        }
      });
      this.setState({ firstIndex, lastIndex, attachments, thumbnailList });
    };

    notZip = (fileName) => {
      const curType = this.getFileType(fileName);
      return !['zip'].includes(curType);
    };

    // 下载
    downloadMethod = (attachmentOid) => {
      const downloadURL = `${
        config.fileUrl
      }/api/attachments/download/${attachmentOid}?access_token=${sessionStorage.getItem(
        'token',
      )}`;
      const iframe = document.createElement('iframe');
      iframe.src = downloadURL;
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 500);
    };

    getFileType = (fileName) => {
      return (fileName || '').split('.').pop().toLowerCase();
    };

    // 预览
    onPreview = (params, field) => {
      const { attachments } = this.state;
      let index = params;
      if (typeof index === 'string' && field) {
        index = attachments.findIndex((item) => item[field] === params) || 0;
      }
      const curItem = attachments[index];
      const curType = this.getFileType(curItem.fileName);
      this.setState({ fileType: curType });
      if (['zip'].includes(curType)) {
        this.zipFileView(index, curItem.id);
      } else {
        this.setState({ previewVisible: true, imageIndex: index });
      }
    };

    // 上一张
    handlePrevious = () => {
      const { imageIndex } = this.state;
      if (imageIndex === 0) return;
      this.isFirst(imageIndex - 1);
    };

    // 跳过不可预览, 是否是第一张可预览的
    isFirst = (index) => {
      const { attachments } = this.state;
      const name = attachments[index].fileName;
      const canPreView = getImgIcon(name, true) && this.notZip(name);
      if (!canPreView && index > 0) {
        this.isFirst(index - 1);
      } else {
        this.setState({ imageIndex: index });
      }
    };

    // 下一张
    handleLast = () => {
      const { imageIndex, attachments } = this.state;
      if (imageIndex + 1 === attachments.length) return;
      this.isLast(imageIndex + 1);
    };

    // 跳过不可预览，是否是最后一张可预览的
    isLast = (index) => {
      const { attachments } = this.state;
      const name = attachments[index].fileName;
      const canPreView = getImgIcon(name, true) && this.notZip(name);
      const notLastField = index < attachments.length - 1;
      if (!canPreView && notLastField) {
        this.isLast(index + 1);
      } else {
        this.setState({ imageIndex: index });
      }
    };

    // 预览zip
    zipFileView = (index, id) => {
      httpFetch
        .get(`${config.fileUrl}/api/attachments/view/zip/tree?id=${id}`)
        .then((res) => {
          if (res.status === 200) {
            this.setState({
              treeData: res.data,
              previewVisible: true,
              imageIndex: index,
            });
          }
        });
    };

    onDelete = (oid, index) => {
      const { onRemove } = this.props;
      const { attachments } = this.state;
      if (onRemove) {
        onRemove(attachments[index], index, () => {
          this.setState({ previewVisible: false });
        });
      }
    };

    onClose = () => {
      this.setState({ previewVisible: false });
    };

    render() {
      const {
        previewVisible,
        fileType,
        treeData,
        imageIndex,
        firstIndex,
        lastIndex,
        attachments,
        thumbnailList,
      } = this.state;
      const { showName = 'fileName', showRemoveIcon } = this.props;
      const curAttachment = attachments[imageIndex] || {};
      const PreView = PreviewElement || FilePreview;

      return (
        <React.Fragment>
          <AttachmentsContent
            {...this.props}
            onPreview={this.onPreview}
            onDownload={this.downloadMethod}
          />

          {['zip'].includes(fileType) ? (
            <ZipFileView
              onClose={this.onClose}
              visible={previewVisible}
              treeData={treeData}
              title={curAttachment[showName]}
              attachment={curAttachment}
              previewElement={PreView}
            />
          ) : (
            <PreView
              attachmentOid={curAttachment.id}
              staticFileUrl={curAttachment.staticFileUrl}
              conversionStatus={curAttachment.conversionStatus}
              attachments={attachments}
              thumbnailList={thumbnailList}
              onPreview={this.onPreview}
              onClose={this.onClose}
              visible={previewVisible}
              url={curAttachment.thumbnailUrl}
              title={curAttachment[showName]}
              onDownload={this.downloadMethod}
              onDelete={showRemoveIcon && this.onDelete}
              first={imageIndex === firstIndex}
              last={imageIndex === lastIndex}
              onPrevious={this.handlePrevious}
              onLast={this.handleLast}
              index={imageIndex}
              thumbnailFlag
            />
          )}
        </React.Fragment>
      );
    }
  };
};

export default AttachmentsWrap;
