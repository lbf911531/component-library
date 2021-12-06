import React from 'react';
// import PropTypes from 'prop-types';
import { Upload, Button, message } from 'antd';
import { UploadOutlined, DownOutlined, RightOutlined } from '@ant-design/icons';
import { isNil } from 'lodash';
import config from 'config';
import httpFetch from 'share/httpFetch';
import { messages } from '../../utils';
import UploadFileList from '../upload-file-list';
import './upload-button.less';

class UploadButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      valueList: [],
      defaultListTag: true,
      visible: true,
    };
    this.sizeMap = {
      MB: 2,
      KB: 1,
      B: 0,
    };
  }

  componentDidMount() {
    const { defaultFileList, defaultOids } = this.props;
    this.setState({ fileList: defaultFileList, valueList: defaultOids });
    this.handleSetValueList(defaultFileList, defaultOids);
  }

  componentWillReceiveProps(nextProps) {
    const { fileListFlag } = this.props;
    const { defaultListTag } = this.state;
    if (
      nextProps.defaultFileList.length &&
      (defaultListTag || nextProps.fileListFlag !== fileListFlag)
    ) {
      const { defaultFileList, defaultOids } = nextProps;
      this.setState(
        {
          fileList: defaultFileList,
          valueList: defaultOids,
        },
        () => {
          this.setState({ defaultListTag: false });
          this.handleSetValueList(defaultFileList, defaultOids);
        },
      );
    }
  }

  checkUploadIsDone = () => {
    const { fileList } = this.state;
    const result = fileList.every((file) => {
      return file.status !== 'uploading';
    });
    if (result) {
      return true;
    } else {
      return false;
    }
  };

  /**
   * 根据外传的fileList联动设置当前组件内部的valueList
   * @param {array} nextFileList
   * @param {array} nextValueList
   */
  handleSetValueList = (nextFileList, nextValueList) => {
    if (nextFileList.length !== nextValueList.length) {
      const newValueList = [];
      const { valueKey } = this.props;
      nextFileList.forEach((item) => {
        if (item[valueKey]) {
          newValueList.push(item[valueKey]);
        }
      });
      this.setState({ valueList: [...nextValueList, ...newValueList] });
    }
  };

  /**
   * 设置组件的额外请求参数
   * @returns object
   */
  handleSetRequestData = () => {
    const { attachmentType, pkValue, pkName, bucketName } = this.props;
    return {
      attachmentType,
      pkValue,
      bucketName: bucketName || null,
      pkName,
    };
  };

  /**
   * 校验图片尺寸
   * @param {object} file
   * @returns boolean
   */
  handleCheckImgSize = (file) => {
    const { type } = file;
    const reg = /image\/[a-z]+/g;
    if (!reg.test(type)) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const { maxHeightSize, maxWidthSize, minHeightSize, minWidthSize } =
        this.props;
      if (
        !isNil(maxWidthSize) ||
        !isNil(maxHeightSize) ||
        !isNil(minWidthSize) ||
        !isNil(minHeightSize)
      ) {
        const url = window.URL || window.webkitURL;
        const img = new Image(); // 手动创建一个Image对象
        img.src = url.createObjectURL(file); // 创建Image的对象的url
        img.onload = function onLoad() {
          if (
            (!isNil(maxWidthSize) && maxWidthSize < this.width) ||
            (!isNil(maxHeightSize) && maxHeightSize < this.height) ||
            (!isNil(minHeightSize) && minHeightSize > this.height) ||
            (!isNil(minWidthSize) && minWidthSize > this.width)
          ) {
            let errorMessage = messages('common.pic.size.warning'); // 图片尺寸不符合要求
            if (!isNil(maxWidthSize) && !isNil(maxHeightSize)) {
              errorMessage = `${errorMessage}，${messages(
                'common.size.big.warning',
              )}${maxWidthSize}*${maxHeightSize}`; // 图片尺寸不符合要求，尺寸不可大于x*x
            }
            if (!isNil(minHeightSize) && !isNil(minWidthSize)) {
              errorMessage = `${errorMessage}，${messages(
                'common.size.small.warning',
              )}${minWidthSize}*${minHeightSize}`; // 图片尺寸不符合要求，尺寸不可小于x*x
            }
            message.error(errorMessage);
            return reject();
          }
          return resolve();
        };
      } else return resolve();
    });
  };

  /**
   * 校验附件大小
   * @param {number} size 上传的附件大小
   * @returns boolean 返回 false 则停止上传
   */
  handleCheckFileSize = (size) => {
    const { fileSize, unitSize } = this.props;
    // size 单位是 B
    const isLt = size / 1024 ** this.sizeMap[unitSize] <= fileSize;
    if (!isLt) {
      message.error(
        messages('common.attachment.size.limit', {
          params: {
            size: fileSize,
            unit: unitSize,
          },
        }),
      );
    }
    return isLt;
  };

  /**
   * 校验附件类型
   * 使用文件名字截取是因为 file.type返回的值与extensionName（常人认知的值不一致）
   * @param {*} fileName 附件名字
   * @returns boolean
   */
  handleCheckFileType = (fileName) => {
    const { extensions, fileTypeErrorMessage } = this.props;
    if (!extensions || (Array.isArray(extensions) && extensions.length === 0))
      return true;
    // fileType: image/jpeg / text/html / application/x-zip-compressed ....
    const type = fileName.split('.').pop().toLowerCase();
    const lowerCaseExtensions = extensions.map((o) => o.toLowerCase());
    const isQualified = lowerCaseExtensions.includes(type);
    if (!isQualified) {
      if (fileTypeErrorMessage) {
        message.error(fileName + fileTypeErrorMessage);
      } else {
        message.error(messages('common.upload.failed.reason'));
      }
    }
    return isQualified;
  };

  /**
   * 上传前的校验，antd v4.x 做出修改，这里即便return false,依旧会触发onChange
   * @param {object} file 当前上传的文件
   * @returns boolean 返回boolean值决定file是否符合预期
   */
  handleBeforeUpload = async (file) => {
    if (!this.handleCheckFileType(file.name)) return false;
    if (!this.handleCheckFileSize(file.size)) return false;
    return this.handleCheckImgSize(file)
      .then(async () => {
        // 当执行到这一步的时候，表示上传的附件符合预期，加上pass标记方便onChange使用
        file.pass = true;
        const { compressionRatio, compressionSize } = this.props;
        const fileSize = file.size / 1024 ** 2;
        if (
          compressionRatio &&
          (file.type || '').includes('image') &&
          fileSize > compressionSize
        ) {
          const result = await this.handleTransformFile(file, fileSize);
          result.pass = true;
          if (result) return Promise.resolve(result);
          return Promise.reject();
        }
        return Promise.resolve();
      })
      .catch(() => {
        return Promise.reject();
      });
  };

  /**
   * 图片压缩
   * @param {object} file
   * @param {number} fileSize
   * @returns Promise
   */
  handleTransformFile = (file, fileSize) => {
    let { compressionRatio } = this.props;
    return new Promise((resolve) => {
      const reader = new FileReader();
      const img = new Image();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        img.src = e.target.result;
      };

      // eslint-disable-next-line func-names
      img.onload = function () {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        let errorFlag = false;

        let imgWidth = this.width;
        let imgHeight = this.height;

        if (imgWidth > 8000 || imgHeight > 8000) {
          // 长、宽太大的图片压缩不了
          errorFlag = true;
        } else if (imgWidth >= 1280) {
          imgWidth = 1280;
          imgHeight = this.height * (1280 / this.width);
          if (fileSize < 2) {
            compressionRatio *= 0.8;
          }
        } else if (fileSize <= 0.5) {
          compressionRatio *= 0.5;
        }

        canvas.width = imgWidth;
        canvas.height = imgHeight;

        context.clearRect(0, 0, imgWidth, imgHeight);
        context.drawImage(img, 0, 0, imgWidth, imgHeight);

        canvas.toBlob(
          (blob) => {
            const imgFile = new File([blob], file.name, { type: file.type }); // 将blob对象转化为图片文件
            imgFile.uid = file.uid;
            const flag = errorFlag || imgFile.size > file.size; // 压缩后大小不对 返回源文件
            resolve(flag ? file : imgFile);
          },
          file.type,
          compressionRatio,
        );
      };
    });
  };

  /**
   * 监听附件上传的回调
   * @param {object} info 附件
   */
  handleChange = (info) => {
    if (!info.file.pass) return;
    const { disabled } = this.props;
    if (disabled) return;
    const { uploadHandle, uploadHandleFileList, onChange } = this.props;

    this.setState({ defaultListTag: false });

    let { fileList } = info;
    let { valueList } = this.state;
    fileList = this.handleCutArray(fileList).filter((o) => o.pass !== false);
    this.setState({ fileList }, () => {
      const { status } = info.file;
      if (status === 'done') {
        message.success(
          `${info.file.name} ${messages(
            'common.upload.success' /* 上传成功 */,
          )}`,
        );
        valueList.push(info.file.response.id);
        valueList = this.handleCutArray(valueList);
        this.setState({ valueList }, () => {
          if (typeof uploadHandleFileList === 'function') {
            uploadHandleFileList(fileList);
          }
          if (onChange) {
            onChange(valueList);
          }
          uploadHandle(valueList);
        });
      } else if (status === 'error') {
        message.error(
          `${info.file.name} ${messages('common.upload.fail' /* 上传失败 */)}${
            info.file.response && info.file.response.message
              ? `，${info.file.response.message}`
              : ''
          }`,
        );
      }
    });
  };

  /**
   * 从后向前截取数组
   * @param {array} list 截取前的数组
   * @returns array 截取后的数组
   */
  handleCutArray = (list) => {
    const { fileNum } = this.props;
    if (fileNum) {
      return list.slice(parseInt(`-${fileNum}`, 10));
    }
    return list;
  };

  /**
   * 删除
   * @param {object} info 当前执行删除的附件信息
   * @returns undefined 打断函数执行
   */
  handleRemove = (info) => {
    const { uploadHandle, uploadHandleFileList, onChange, disabled, valueKey } =
      this.props;
    if (disabled) {
      /* 该状态不允许删除附件 */
      message.warn(messages('common.upload.not.allowed.delete'));
      return;
    }
    this.setState({ defaultListTag: false });
    const { valueList, fileList } = this.state;
    const targetKey = info.response ? info.response[valueKey] : info[valueKey];

    const newValueList = valueList.filter((key) => key !== targetKey);
    const newFileList = fileList.filter(
      (file) =>
        (file.response ? file.response[valueKey] : file[valueKey]) !==
        targetKey,
    );

    this.setState(
      { fileList: [...newFileList], valueList: [...newValueList] },
      () => {
        uploadHandle(newValueList, info);
        if (onChange) {
          onChange(newValueList);
        }
        if (typeof uploadHandleFileList === 'function') {
          uploadHandleFileList(newFileList);
        }
      },
    );
    this.handleRemoveByInterface(targetKey);
  };

  /**
   * 调用接口删除附件
   * @param {string} target：附件唯一性值 id
   * @returns undefined 打断函数执行
   */
  handleRemoveByInterface = (target) => {
    if (!target) return;
    const { isUseAttachmentId } = this.props;
    let deleteUrl = `${config.fileUrl}/api/attachments`;
    deleteUrl += isUseAttachmentId ? `?id=${target}` : `/${target}`;

    httpFetch
      .delete(deleteUrl)
      .then(() => {
        message.success(messages('common.operate.success'));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // 自定义上传
  handleCustomUpload = (options) => {
    const formData = new FormData();
    const { uploadUrl } = this.props;
    if (options.data) {
      Object.keys(options.data).forEach((key) => {
        formData.append(key, options.data[key]);
      });
    }
    formData.append('file', options.file);
    httpFetch
      .post(uploadUrl, formData)
      .then((res) => {
        if (res.data) {
          options.onSuccess(res.data, options.file);
        } else {
          options.onError();
        }
      })
      .catch((error) => {
        options.onError();
        console.log(error);
      });
  };

  reset = () => {
    this.setState({ fileList: [], valueList: [] });
  };

  render() {
    const { visible, fileList } = this.state;
    const {
      extraRender,
      buttonClass,
      hideArrow,
      hideButtonIcon,
      disabled,
      uploadUrl,
      multiple,
      buttonText,
      className,
      noZoom,
      valueKey,
      showRemoveIcon,
      showPreviewIcon,
      showDownloadIcon,
      style,
      wrapHandle,
      span,
    } = this.props;
    const token = sessionStorage.getItem('token');
    fileList.forEach((items) => {
      const item = items;
      const key = item.response ? item.response[valueKey] : item[valueKey];
      item.url = `${config.fileUrl}/api/attachments/download/${key}?access_token=${token}`;
    });
    const ArrowIcon = visible ? DownOutlined : RightOutlined;
    return (
      <div className={`upload-button ${className}`}>
        {!noZoom && (
          <div className="btn-wrap">
            {extraRender()}
            <ArrowIcon
              onClick={() => {
                this.setState({ visible: !visible });
              }}
              style={{
                marginRight: 10,
                cursor: 'pointer',
                display: hideArrow ? 'none' : 'inline-block',
              }}
            />
            <Upload
              name="file"
              action={uploadUrl}
              headers={{
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                Accept: 'application/json, text/plain, */*',
              }}
              data={this.handleSetRequestData}
              fileList={fileList}
              multiple={multiple}
              disabled={disabled}
              showUploadList={false}
              className="upload-list-inline"
              beforeUpload={this.handleBeforeUpload}
              onChange={this.handleChange}
              onRemove={this.handleRemove}
              customRequest={this.handleCustomUpload}
            >
              {!disabled && (
                <Button className={buttonClass}>
                  <UploadOutlined
                    style={{
                      marginRight: 4,
                      display: hideButtonIcon ? 'none' : 'inline-block',
                    }}
                  />
                  {buttonText || messages('common.upload.attachment')}
                </Button>
              )}
            </Upload>
          </div>
        )}
        {visible && Array.isArray(fileList) && !!fileList.length && (
          <UploadFileList
            fileList={fileList}
            onRemove={this.handleRemove}
            disabled={disabled}
            showRemoveIcon={showRemoveIcon}
            showPreviewIcon={showPreviewIcon}
            showDownloadIcon={showDownloadIcon}
            style={style}
            wrapHandle={wrapHandle}
            span={span}
          />
        )}
      </div>
    );
  }
}

// UploadButton.propTypes = {
//   uploadUrl: PropTypes.string, // 上传URL
//   disabled: PropTypes.bool, // 是否禁用, 禁用时会隐藏掉上传按钮
//   valueKey: PropTypes.string, // 指定使用附件的唯一值字段，默认使用id，原使用attachmentOid
//   className: PropTypes.string, // upload-button 组件的样式类名
//   noZoom: PropTypes.bool, // 控制附件上传按钮及扩展icon的显隐
//   hideArrow: PropTypes.bool, // 控制 扩展icon的显隐
//   extraRender: PropTypes.func, // 额外渲染dom在 扩展icon 前面
//   hideButtonIcon: PropTypes.bool, // 控制 上传按钮内的上传icon显隐
//   buttonText: PropTypes.string, // 上传按钮文本
//   buttonClass: PropTypes.string, // 按钮样式类名
//   attachmentType: PropTypes.string, // 上传请求额外参数
//   pkValue: PropTypes.string, // 上传请求额外参数
//   bucketName: PropTypes.string, // 上传请求额外参数
//   pkName: PropTypes.string, // 上传请求额外参数
//   showRemoveIcon: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]), // 附件展示列表中是否展示删除
//   showPreviewIcon: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
//   showDownloadIcon: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
//   multiple: PropTypes.bool, // 是否支持多选文件
//   defaultFileList: PropTypes.array, // 默认上传的文件列表，每项必须包含：uid，name
//   defaultOids: PropTypes.array, // 默认上传的文件列表Oid
//   uploadHandle: PropTypes.func, // 回调，获取上传数据
//   isUseAttachmentId: PropTypes.bool, // 删除附件时是否使用id
//   fileSize: PropTypes.number, // 附件大小限制
//   unitSize: PropTypes.string, // 附件大小 单位
//   compressionRatio: PropTypes.number, // 压缩后的图片质量 值在0与1之间, 1质量最好
//   compressionSize: PropTypes.number, // 图片超过多大才压缩
//   fileNum: PropTypes.number,
//   extensions: PropTypes.array, // 限制上传类型
//   uploadHandleFileList: PropTypes.func,
// };
// 理论上讲disabled,hideArrow,noZoom 都用于了显隐当前组件的一部分，不知道原来是出于什么样的考虑这样做
UploadButton.defaultProps = {
  uploadUrl: `${config.fileUrl}/api/upload/attachment`,
  disabled: false,
  valueKey: 'id',
  className: '',
  noZoom: false,
  hideArrow: false,
  extraRender: () => {},
  hideButtonIcon: false,
  buttonText: '',
  buttonClass: '',
  attachmentType: '',
  pkValue: '',
  bucketName: '',
  pkName: '',
  showRemoveIcon: true,
  showPreviewIcon: true,
  showDownloadIcon: true,
  defaultFileList: [],
  defaultOids: [],
  multiple: true,
  uploadHandle: () => {},
  isUseAttachmentId: false,
  compressionRatio: undefined, // 有值的时候开启图片压缩
  compressionSize: 0.3, // 超过0.3m才压缩
  unitSize: 'MB',
  fileSize: 500,
  fileNum: undefined,
  extensions: undefined, // 用法： ["png","jpg","jpeg"], 不传则默认接受所有
  uploadHandleFileList: undefined,
};

export default UploadButton;
