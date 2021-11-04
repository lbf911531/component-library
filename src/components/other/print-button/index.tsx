/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-10-28 11:18:15
 * @LastEditors: binfeng.long@hand-china.com
 * @LastEditTime: 2021-11-04 16:43:45
 * @Version: 1.0.0
 * @Description:
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */

/** 按钮-打印 */
import React, { Component } from 'react';
import { Button } from 'antd';
import { messages } from '../../utils';
/**
 * 需要打印的区域的标签id <div id="divId">这里是需要打印的地方，而这个div是你当前的组件</div>
 * <PrintBtn printId='divId' />
 * PrintBtn 可以放在div#divId里也可以放在外面，
 */
class PrintBtn extends Component<any, any> {
  constructor(props) {
    super(props);
  }

  handlePrint = () => {
    // @ts-ignore
    const { printId } = this.props;
    if (!printId) return;

    if (!document.getElementById(printId)) return;
    // 获取局部打印区域的html 字符串
    const newContent = document.getElementById(printId).innerHTML;
    const all = document.getElementById('root');
    all.setAttribute('style', 'display: none'); // 隐藏原本的全部html
    // 去除页眉页脚
    const style = document.createElement('style');
    style.setAttribute('media', 'print');
    style.innerHTML = `
      @page {
        size: auto;
        margin: 0mm;
      }
    `;
    document.head.appendChild(style);

    // 创建新的div，并对div设置样式，其子元素为局部打印区域的html
    const div = document.createElement('div');
    div.setAttribute('id', 'new-content');
    div.setAttribute('style', `padding: 16px;box-sizing: border-box;`);
    div.innerHTML = newContent;
    // 将新建的div挂载到body上
    document.body.appendChild(div);
    // 执行浏览器提供的打印方法
    if (document.queryCommandSupported('print')) {
      document.execCommand('print', false, null);
    } else {
      window.print();
    }
    // window.location.reload(); // 不刷新的话，事件丢失
    // 打印完成后，将原本的html显示并移除之前新建的div
    all.style.display = 'block';
    div.remove();

    return false;
  };

  render() {
    const { printId, ...otherProps } = this.props;

    return (
      <Button onClick={this.handlePrint} {...otherProps}>
        {messages('common.print')}
      </Button>
    );
  }
}

export default PrintBtn;
