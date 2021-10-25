import React from 'react';
import { connect } from 'dva';
import { Modal, Tree } from 'antd';
import FolderIcon from '@/assets/folder@2x.png';
import { messages, getImgIcon } from 'utils/utils';
import FilePreview from '../image-preview';
import './index.less';

class ZipFileView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filePreviewVisible: false,
      item: {},
    };
  }

  onSelect = (value, node) => {
    if (node.node.props.selectable) {
      this.setState({ filePreviewVisible: true });
    }
    this.setState({ item: node.node.props });
  };

  onCancel = () => {
    const { onClose } = this.props;
    onClose();
  };

  // 递归
  useItself = (obj) => {
    let childrenObj = {};
    if (Array.isArray(obj.children) && obj.children.length > 0) {
      childrenObj = {
        ...obj,
        icon: (
          <img
            style={{ height: 24, width: 24, flex: '0 0 24px' }}
            src={FolderIcon}
            alt={messages('base.picture')}
          />
        ),
      };
      childrenObj.children = childrenObj.children.map((item) => {
        const child = this.useItself(item);
        return {
          ...child,
        };
      });
      return childrenObj;
    } else {
      return {
        ...obj,
        icon: (
          <img
            style={{ height: 24, width: 24, flex: '0 0 24px' }}
            src={getImgIcon(obj.title)}
            alt={messages('base.picture')}
          />
        ),
      };
    }
  };

  // 处理树结构的数据展示
  handleTreeData = () => {
    const { treeData } = this.props;

    let treeDataArr = [];
    if (Array.isArray(treeData)) {
      treeDataArr = treeData;
    } else if (
      typeof treeData === 'object' &&
      Object.keys(treeData).length > 0
    ) {
      let treeDataObj = {};
      treeDataObj = this.useItself(treeData);
      treeDataArr = [treeDataObj];
    } else {
      treeDataArr = [];
    }
    return treeDataArr;
  };

  render() {
    const { visible, previewElement } = this.props;
    const { filePreviewVisible, item } = this.state;
    const PreView = previewElement || FilePreview;
    return (
      <div>
        <Modal
          className="image-priview"
          visible={visible}
          onCancel={() => this.onCancel()}
          width="50%"
          bodyStyle={{ minHeight: 480 }}
          title={messages('base.compressed.package.preview')} /** 压缩包预览  */
          footer={null}
          destroyOnClose
        >
          <Tree
            showIcon
            blockNode
            onSelect={(value, node, extra) => this.onSelect(value, node, extra)}
            // treeData={Array.isArray(treeData) ? treeData : typeof treeData === 'object' ? [treeData] : []}
            treeData={this.handleTreeData()}
          />
        </Modal>

        <PreView
          staticFileUrl={item.staticFileUrl}
          onClose={() => {
            this.setState({ filePreviewVisible: false });
          }}
          visible={filePreviewVisible}
          conversionStatus={item.conversionStatus}
          url={item.url}
          title={item.title}
          first
          last
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user.currentUser,
  };
}

export default connect(mapStateToProps)(ZipFileView);
