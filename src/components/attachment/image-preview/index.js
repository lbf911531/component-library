import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { CloseOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Result } from 'antd';

import { WaterMark } from '@ant-design/pro-layout';
import Connect from '../../custom-connect';
import { messages, getImgIcon } from '../../utils';
import downloadIcon from '../../../assets/download.png';
import downloadActiveIcon from '../../../assets/download-default.png';

import increaseIcon from '../../../assets/increase.png';
import increaseActiveIcon from '../../../assets/increase-active.png';

import reduceIcon from '../../../assets/reduce.png';
import reduceActiveIcon from '../../../assets/reduce-active.png';

import trashIcon from '../../../assets/trash.png';
import trashActiveIcon from '../../../assets/trash-active.png';

import rotateIcon from '../../../assets/rotate.png';
import rotateActiveIcon from '../../../assets/rotate.active.png';

import './index.less';

function FilePreview(props) {
  const {
    visible,
    title,
    onClose,
    attachmentOid,
    onDelete,
    onDownload,
    staticFileUrl,
    first,
    last,
    onPrevious,
    onLast,
    index,
    conversionStatus,
  } = props;

  const [active, setActive] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  const [lastTop, setLastTop] = useState(0);
  const [lastLeft, setLastLeft] = useState(0);

  useEffect(() => {
    setActive(false);
    setPressed(false);
  }, [visible]);

  useEffect(() => {
    setTop(0);
    setLeft(0);
    setLastTop(0);
    setLastLeft(0);
  }, [attachmentOid]);

  const type = getFileType(title);
  const imgs = ['png', 'jpg', 'bmp', 'jpeg', 'gif'];
  const isImg = imgs.includes(type);

  function close() {
    if (onClose) {
      onClose();
    }
  }

  function mouseDown(e) {
    setLastTop(e.clientY);
    setLastLeft(e.clientX);
    setPressed(true);
  }

  function mouseUp() {
    setPressed(false);
  }

  function mouseMove(e) {
    e.stopPropagation();
    if (!pressed) return;
    let y = top;
    let x = left;

    y += e.clientY - lastTop;
    x += e.clientX - lastLeft;

    setTop(y);
    setLeft(x);
    setLastTop(e.clientY);
    setLastLeft(e.clientX);
  }

  function handleOperateImage(operate) {
    const imageDom = document.querySelector(`#img-${attachmentOid}`);
    const transformStyle = imageDom.style.transform;
    let rotateZ = 0;
    let scale = 1;
    // 得到rotateZ值
    transformStyle.replace(/rotateZ\(((\d+)|(-\d+))deg\)/, (target, $1) => {
      rotateZ = Number($1);
      return target;
    });
    // 得到scale值
    transformStyle.replace(/scale\(((\d+.\d+)|(\d+))\)/, (target, $1) => {
      scale = Number($1);
      return target;
    });
    switch (operate) {
      // 放大，最大2
      case 'plus': {
        if (scale < 2) scale += 0.2;
        break;
      }
      // 缩小，最小0.1
      case 'minus': {
        if (scale > 0.2) scale -= 0.2;
        break;
      }
      // 向左旋转
      case 'left': {
        rotateZ -= 90;
        break;
      }
      // 向又旋转
      case 'right': {
        rotateZ += 90;
        break;
      }
      default: {
        break;
      }
    }
    imageDom.style.transform = `rotateZ(${rotateZ}deg) scale(${scale}) translate(-50%, -50%)`;
  }

  function renderItem(icon, activeIcon, name, callback, marginTop = 0) {
    return (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          backgroundColor: active === name ? '#4390FF' : '#fff',
          textAlign: 'center',
          lineHeight: '32px',
          marginTop,
          cursor: 'pointer',
        }}
        onMouseEnter={() => {
          setActive(name);
        }}
        onMouseLeave={() => {
          setActive('');
        }}
        onClick={() => {
          callback();
        }}
        title={name}
      >
        <img
          src={active === name ? activeIcon : icon}
          style={{ height: 16, width: 16 }}
          alt={name}
        />
      </div>
    );
  }

  function renderContent() {
    if (!getImgIcon(title, true)) {
      return renderResult(messages('common.doc.preview.warning'));
    }

    if (isImg) {
      return renderImage();
    } else if (conversionStatus === 'CONVERTING') {
      return renderResult(messages('common.doc.converting'));
    } else if (conversionStatus === 'FAILURE') {
      return renderResult(messages('common.doc.conversion.failed'));
    } else if (conversionStatus === 'SUCCESS') {
      return renderDocument();
    } else {
      return renderResult(messages('common.doc.conversion.failed'));
    }
  }

  function renderResult(text) {
    return (
      <div
        id={`img-${attachmentOid}`}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Result status="warning" title={text} />
      </div>
    );
  }

  function renderImage() {
    const { user } = props;
    return (
      <div
        style={{
          position: 'absolute',
          top: 64,
          left: 226,
          bottom: 64,
          right: 226,
          overflow: 'hidden',
        }}
      >
        <WaterMark
          content={`${user.userCode} - ${user.userName}`}
          style={{
            position: 'absolute',
            bottom: '0',
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '100%',
              height: '100%',
            }}
          >
            <img
              key={attachmentOid}
              id={`img-${attachmentOid}`}
              src={`${staticFileUrl}?access_token=${sessionStorage.getItem(
                'token',
              )}`}
              alt="pic"
              style={{
                position: 'absolute',
                top,
                left,
                transform: 'translate(-50%, -50%)',
                cursor: pressed ? 'move' : 'pointer',
                transformOrigin: '0% 0%',
              }}
              onMouseDown={mouseDown}
              onMouseUp={mouseUp}
              draggable={false}
              onLoad={loadImage}
            />
          </div>
        </WaterMark>
      </div>
    );
  }

  function loadImage(e) {
    const { width, height, style } = e.target;
    const { offsetWidth, offsetHeight } = e.target.parentNode;

    if (offsetWidth < width && offsetHeight < height) {
      if (width > height) {
        style.width = '100%';
      } else {
        style.height = '100%';
      }
    } else if (offsetWidth < width) {
      style.width = '100%';
    } else if (offsetHeight < height) {
      style.height = '100%';
    }
    style.display = 'block';
  }

  function renderDocument() {
    const { user } = props;
    const reg = /.pdf$/;
    const flag = reg.test(staticFileUrl.toLowerCase());
    let fileUrl;
    if (!flag) {
      fileUrl = `.${staticFileUrl}?access_token=${sessionStorage.getItem(
        'token',
      )}`;
    } else {
      fileUrl = `/pdfjs/web/viewer.html?file=${window.encodeURIComponent(
        `${staticFileUrl}?access_token=${sessionStorage.getItem('token')}`,
      )}`;
    }
    return (
      <div
        style={{
          position: 'absolute',
          top: 64,
          left: 226,
          bottom: 64,
          right: 226,
          overflow: 'hidden',
        }}
      >
        <WaterMark
          content={`${user.userCode} - ${user.userName}`}
          style={{
            position: 'absolute',
            bottom: '0',
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          <iframe
            title={title}
            src={fileUrl}
            style={{ width: '100%', height: '100%', backgroundColor: '#fff' }}
          />
        </WaterMark>
      </div>
    );
  }

  function handlePrevious() {
    if (onPrevious) {
      onPrevious();
    }
  }

  function handleLast() {
    if (onLast) {
      onLast();
    }
  }

  function getFileType(name) {
    return (name || '').split('.').pop().toLowerCase();
  }

  return ReactDOM.createPortal(
    visible && (
      <div
        style={{
          backgroundColor: 'rgba(0,0,0,.8)',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10005,
          userSelect: 'none',
        }}
        className="file-priview"
        onMouseUp={mouseUp}
        onMouseMove={mouseMove}
      >
        <div
          style={{
            position: 'absolute',
            top: 24,
            left: 82,
            fontSize: 16,
            color: '#fff',
          }}
        >
          {title}
        </div>
        <div style={{ position: 'absolute', top: 27, right: 82 }}>
          <CloseOutlined
            onClick={close}
            className="close-icon"
            style={{ fontSize: 18, color: '#fff', cursor: 'pointer' }}
          />
        </div>
        <div style={{ position: 'absolute', top: 64, right: 34 }}>
          {onDownload &&
            renderItem(
              downloadIcon,
              downloadActiveIcon,
              messages('common.download'),
              () => {
                onDownload(attachmentOid);
              },
            )}
          {isImg && (
            <>
              {renderItem(
                increaseIcon,
                increaseActiveIcon,
                messages('common.enlarge'),
                () => {
                  handleOperateImage('plus');
                },
                20,
              )}
              {renderItem(
                reduceIcon,
                reduceActiveIcon,
                messages('common.narrow'),
                () => {
                  handleOperateImage('minus');
                },
                20,
              )}
              {renderItem(
                rotateIcon,
                rotateActiveIcon,
                messages('common.rotate'),
                () => {
                  handleOperateImage('right');
                },
                20,
              )}
            </>
          )}
          {!props.disabled &&
            onDelete &&
            renderItem(
              trashIcon,
              trashActiveIcon,
              messages('common.delete'),
              () => {
                onDelete(attachmentOid, index);
              },
              20,
            )}
        </div>
        {!first && (
          <div onClick={handlePrevious} className="ico-wrapper left-ico">
            <LeftOutlined />
          </div>
        )}
        {!last && (
          <div onClick={handleLast} className="ico-wrapper right-ico">
            <RightOutlined />
          </div>
        )}
        {renderContent()}
      </div>
    ),
    document.body,
  );
}

function mapStateToProps(state) {
  return {
    user: state.user.currentUser,
  };
}

export default Connect(mapStateToProps)(FilePreview);
