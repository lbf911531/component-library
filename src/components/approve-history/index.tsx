import React from 'react';
import { Collapse, Timeline, Spin, Row, Col, Empty, Badge } from 'antd';
import moment from 'moment';
// @ts-ignore
import httpFetch from 'share/httpFetch';
// @ts-ignore
import config from 'config';
import { messages } from '../utils';
import { IProps, IState } from './interface';
import { modelInfoMap } from './config';
import './style.less';
/**
 * 审批历史
 */
interface IModel {
  text: string;
  color: string;
  dot?: string;
}

class WorkFlowApproveHistory extends React.Component<IProps, IState> {
  static defaultProps = {
    entityType: '',
    documentId: '',
    infoData: [],
    slideFrameFlag: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      historyData: [],
      loading: false,
      expenseColorFlag: false,
    };
  }

  componentDidMount() {
    this.getHistoryData();
  }

  componentWillReceiveProps(nextProps) {
    const { infoData, entityType, documentId, url, params } = this.props;
    if (
      (infoData && infoData.length !== nextProps.infoData.length) ||
      nextProps.entityType !== entityType ||
      nextProps.documentId !== documentId ||
      nextProps.params?.businessId !== params?.businessId ||
      nextProps.url !== url
    ) {
      this.getHistoryData(nextProps);
    }
  }

  getHistoryData = (props = this.props) => {
    const { entityType, documentId, infoData, url, methodType, params } = props;
    if (!infoData || !infoData.length) {
      this.setState({ loading: true });
      if (!url) {
        if (!entityType || !documentId) {
          this.setState({ loading: false });
          return;
        }
        console.log(
          `${config.wflUrl}/api/workflow/approval/history?entityType=${entityType}&entityId=${documentId}`,
        );
        httpFetch
          .get(
            `${config.wflUrl}/api/workflow/approval/history?entityType=${entityType}&entityId=${documentId}`,
          )
          .then((res) => {
            console.log(res.data, 'res');
            this.setState({ historyData: res.data, loading: false });
          })
          .catch((err) => {
            console.error(err);
            this.setState({ loading: false });
          });
      } else {
        if (params.businessId) {
          httpFetch[methodType || 'get'](url, params)
            .then((res) => {
              this.setState({
                historyData: res.data,
                loading: false,
                expenseColorFlag: true,
              });
            })
            .catch((err) => {
              console.log(err);
              this.setState({ loading: false });
            });
        }
        this.setState({ loading: false });
      }
    } else {
      this.setState({
        historyData: infoData,
        loading: false,
      });
    }
  };

  getHistory = () => {
    const { historyData } = this.state;
    const children = [];
    historyData.forEach((item, i) => {
      children.push(this.getHistoryRender(item, i));
    });
    return children;
  };

  getColor = (value) => {
    const model: IModel = {} as IModel;
    model.text = value.operationDesc;
    switch (value.operationType) {
      case 1000:
        if (value.operation === 1001) {
          // 新建
          model.color = '#4390FF';
        } else if (value.operation === 1002) {
          // 提交
          model.color = '#4390FF';
        } else if (value.operation === 3011) {
          // 自动转交
          model.color = '#4390FF';
          model.dot = 'up-circle-o';
        } else if (value.operation === 1003) {
          // 撤回
          model.color = '#4390FF';
          model.dot = 'down-circle-o';
        } else if (value.operation === 1004) {
          // 审批通过
          model.color = '#3ABFA5';
          model.dot = 'check-circle-o';
        } else if (value.operation === 1005) {
          // 审批驳回
          model.color = '#EA4343';
          model.dot = 'close-circle-o';
        } else if (value.operation === 6001) {
          // 暂挂中
          model.color = '#4390FF';
        } else if (value.operation === 6002) {
          // 已取消
          model.color = '#4390FF';
        } else if (value.operation === 6003) {
          // 已完成
          model.color = '#4390FF';
        } else if (value.operation === 6004) {
          // 取消暂挂
          model.color = '#4390FF';
        } else if (value.operation === 7001) {
          // 关闭
          model.color = '#4390FF';
          model.dot = 'close-circle';
        } else if (value.operation === 9001) {
          // 支付
          model.color = '#4390FF';
          model.dot = 'pay-circle-o';
        } else if (value.operation === 9002) {
          // 退款
          model.color = '#4390FF';
          model.dot = 'down-circle-o';
        } else if (value.operation === 9003) {
          // 退票
          model.color = '#4390FF';
          model.dot = 'down-circle-o';
        } else if (value.operation === 9004) {
          // 反冲
          model.color = '#4390FF';
          model.dot = 'clock-circle-o';
        } else if (value.operation === 6005) {
          model.color = '#4390FF';
          model.dot = 'down-circle-o';
          model.text = '变更';
        } else {
          // 未知
          model.color = '#4390FF';
        }
        break;
      case 1009:
        if (value.operation === 1000) {
          // 工作台--入池
          model.color = '#4390FF';
        } else if (value.operation === 1001) {
          // 工作台--分配
          model.color = '#4390FF';
          model.dot = 'down-circle-o';
        } else {
          /**
           * 1002(工作台--通过)  <'workflow.workbench.log.approve'>
           * 1003(退回至上一节点)  <'workflow.workbench.log.returnFrontNode'>
           * 1004(退回至申请人)  <'workflow.workbench.log.reject'>
           * 1005(暂挂)  <'workflow.workbench.log.hold'>
           * 1006(取消暂挂)  <'workflow.workbench.log.cancelHold'>
           * 1007(申请退回)  <'workflow.workbench.log.applyReturn'>
           * 1008(申请退回通过)  <'workflow.workbench.log.applyReturnApprve'>
           * 1009(申请退回驳回)  <'workflow.workbench.log.applyReturnReject'>
           * 1010(强制申请退回)  <'workflow.workbench.log.forceApplyReturn'>
           */
          model.dot = 'down-circle-o';
          model.color = '#4390FF';
        }
        break;
      default:
        if (value.operation === 1001) {
          // 提交
          model.color = '#4390FF';
          model.dot = 'up-circle-o';
        } else if (value.operation === 3011) {
          // 自动转交
          model.color = '#4390FF';
          model.dot = 'up-circle-o';
        } else if (value.operation === 1002) {
          // 撤回
          model.color = '#4390FF';
          model.dot = 'down-circle-o';
        } else if (value.operation === 2001) {
          // 审批通过
          model.color = '#3ABFA5';
          model.dot = 'check-circle-o';
        } else if (value.operation === 2002) {
          // 审批驳回
          model.color = '#EA4343';
          model.dot = 'close-circle-o';
        } else if (value.operation === 2004) {
          // 审批退回
          model.color = '#4390FF';
          model.dot = 'left-circle-o';
        } else if (value.operation === 3001) {
          // 转交
          model.color = '#4390FF';
          model.dot = 'solution-o';
        } else if (value.operation === 3002) {
          // 加签
          model.color = '#4390FF';
          model.dot = 'solution-o';
        } else if (value.operation === 3003) {
          // 重启
          model.color = '#F9A343';
          model.dot = 'up-circle-o';
        } else if (value.operation === 3009) {
          // 跳转
          model.color = '#4390FF';
          model.dot = 'sync-o';
        } else if (value.operation === 5004) {
          // 还款提交
          model.color = '#4390FF';
          model.dot = 'up-circle-o';
        } else if (value.operation === 5009) {
          // 添加会签
          model.color = '#4390FF';
          model.dot = 'close-circle-o';
        } else if (value.operation === 9101) {
          // 邮寄
          model.color = '#4390FF';
          model.dot = 'check-circle-o';
        } else if (value.operation === 9102) {
          // 签收
          model.color = '#4390FF';
          model.dot = 'check-circle-o';
        } else if (value.operation === 9103) {
          // 邮退
          model.color = '#4390FF';
          model.dot = 'close-circle-o';
        } else if (value.operation === 9104) {
          // 核对通过
          model.color = '#4390FF';
          model.dot = 'close-circle-o';
        } else if (value.operation === 9105) {
          // 核对驳回
          model.color = '#4390FF';
          model.dot = 'close-circle-o';
        } else if (value.operation === 9106) {
          // 通知补寄
          model.color = '#4390FF';
          model.dot = 'close-circle-o';
        } else {
          // 其他
          model.color = '#4390FF';
          model.dot = 'close-circle-o';
        }
        break;
    }
    return model;
  };

  getExpenseColor = (value) => {
    const model: IModel = {
      text: value.operationTypeName,
      ...modelInfoMap[value.operationType || 'default'],
    };
    return model;
  };

  /**
   * 自动转交时有换行符需要进行转换
   */
  operationRemarkTransfer = (item) => {
    if (item.operationRemark && item.operationRemark.indexOf('\n')) {
      return item.operationRemark.split('\n').map((itemChild) => (
        <div>
          <div>{itemChild}</div>
          <br />
        </div>
      ));
    }
    return item.operationRemark;
  };

  getHistoryRender = (item, i) => {
    const { expenseColorFlag } = this.state;
    const { slideFrameFlag } = this.props;
    if (item) {
      const model =
        expenseColorFlag || item.hasOwnProperty('operationTypeName')
          ? this.getExpenseColor(item)
          : this.getColor(item);
      return (
        <Timeline.Item
          dot={<Badge color={model.color || '#4390FF'} offset={[4, 0]} />}
          color={model.color || '#4390FF'}
          key={i}
        >
          <Row>
            <Col
              span={slideFrameFlag ? 12 : 8}
              style={{
                maxWidth: '320px',
                paddingLeft: '8px',
                paddingRight: `${slideFrameFlag ? '32px' : '42px'}`,
              }}
            >
              <div
                style={{
                  fontWeight: 'bold',
                  height: '14px',
                  marginBottom: 8,
                  color: '#333333',
                }}
              >
                {model.text}
              </div>
              <div style={{ color: '#999999' }}>
                <span
                  style={{
                    fontSize: '12px',
                    marginRight: '8px',
                    letterSpacing: 0,
                    color: '#999999',
                  }}
                >
                  {moment(item.lastUpdatedDate).format('YYYY-MM-DD HH:mm')}
                </span>
                <span style={{ fontSize: '12px', marginRight: '8px' }}>
                  {item.approvalNodeName}
                </span>
                <span style={{ fontSize: '12px', color: '#999999' }}>
                  {item.operationMethodName === 'ROBOT'
                    ? `${item.userName}`
                    : item.hasOwnProperty('createdByName')
                    ? `${item.createdByName ? item.createdByName : ''} ${
                        item.createdByCode ? item.createdByCode : ''
                      }`
                    : `${item.userName} ${item.userCode}`}
                </span>
              </div>
            </Col>
            <Col span={slideFrameFlag ? 12 : 16}>
              <div
                style={{
                  wordBreak: 'break-word',
                  fontSize: '12px',
                  color: '#666',
                  lineHeight: '18px',
                }}
              >
                {item.hasOwnProperty('description')
                  ? item.description
                  : this.operationRemarkTransfer(item)}
              </div>
            </Col>
          </Row>
        </Timeline.Item>
      );
    }
    return '';
  };

  render() {
    const { loading, historyData } = this.state;
    const { slideFrameFlag, expandIcon, header } = this.props;
    return (
      <Spin spinning={loading}>
        <div className="approve-history">
          {slideFrameFlag ? (
            <div>
              <div
                className="common-item-title"
                style={{ marginTop: 20, marginBottom: 16 }}
              >
                {header || messages('common.approval.history')}
              </div>
              {historyData.length ? (
                <Timeline className="times">{this.getHistory()}</Timeline>
              ) : (
                <Empty style={{ textAlign: 'center' }} />
              )}
            </div>
          ) : (
            <div style={{ borderRadius: 4 }} className="collapse">
              <Collapse
                bordered={false}
                defaultActiveKey={['1']}
                expandIconPosition="right"
                expandIcon={expandIcon}
              >
                <Collapse.Panel
                  header={header || messages('common.approval.history')}
                  key="1"
                >
                  <div style={{ paddingLeft: 18, marginTop: 8 }}>
                    {historyData.length ? (
                      <Timeline className="times">{this.getHistory()}</Timeline>
                    ) : (
                      <Empty style={{ textAlign: 'center' }} />
                    )}
                  </div>
                </Collapse.Panel>
              </Collapse>
            </div>
          )}
        </div>
      </Spin>
    );
  }
}

export default WorkFlowApproveHistory;
