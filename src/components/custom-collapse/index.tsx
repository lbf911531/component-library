/** 通用折叠组件封装 */

import React, { Component } from 'react';
import { Collapse } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import './index.less';

const { Panel } = Collapse;

interface IProps {
  components: any;
}

class CustomCollapse extends Component<IProps, any> {
  static defaultProps = {
    components: [],
  };
  /**
   * 自定义展开图标
   * @param {*} data
   * @returns
   */
  expandIcon = (data) => {
    const { isActive } = data;
    if (isActive) {
      return (
        <div className="collapse-icon-wrap">
          <span className="expand-description">收起</span>
          <UpOutlined className="expand-icon" />
        </div>
      );
    }
    return (
      <div className="collapse-icon-wrap">
        <span className="expand-description">展开</span>
        <DownOutlined className="expand-icon" />
      </div>
    );
  };

  render() {
    const { components } = this.props;
    return (
      <div>
        {components.length && (
          <Collapse
            expandIcon={this.expandIcon}
            ghost
            expandIconPosition="right"
            className="collapse-style"
            {...this.props}
          >
            {components
              .filter(
                (item) =>
                  item &&
                  Object.prototype.toString.call(item) === '[object Object]' &&
                  item.basicInfo,
              )
              .map((component, index) => {
                return (
                  <Panel
                    header={component.header}
                    key={component.key || index}
                    id={component.id || ''}
                    {...component.panelProp}
                  >
                    {component.basicInfo}
                  </Panel>
                );
              })}
          </Collapse>
        )}
      </div>
    );
  }
}

/**
 * components:
 * 格式：
 *  [{
 *    basicInfo: Panel展开后渲染的节点（必须），
 *    header：折叠面板的title,
 *    id：可配合页面的Anchor使用，不需要时可以不传
 *    key：Panel的key值，不能重复！！
 *    panelProp: [], // Collapse.Panel的所有支持属性
 *  ]}
 * Collapse所有支持属性都可以在使用此组件，比如默认打开key为0和1的panel：
    <CustomCollapse defaultActiveKey={['0','1']} components={components}  />
 *
 */

export default CustomCollapse;
