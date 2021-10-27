/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-10-26 11:26:12
 * @LastEditors: binfeng.long@hand-china.com
 * @LastEditTime: 2021-10-26 11:34:03
 * @Version: 1.0.0
 * @Description:
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */

export const modelInfoMap = {
  '1001': { color: '#4390FF' }, // 分配
  SUBMIT: { color: '#EA4343' }, // 提交
  '1003': { color: '#EA4343' }, // 撤回
  '2004': { color: '#EA4343' }, // 审批退回
  '1002': { color: '#3ABFA5' }, // 审批通过
  PASS: { color: '#3ABFA5' }, // 审批通过
  '2002': { color: '#3ABFA5' }, // 审批驳回
  REJECT: { color: '#3ABFA5' }, // 审批驳回
  '6001': { color: 'yellow' }, // 暂挂中
  CON_CANCEL: { color: 'yellow' }, // 已取消
  CON_FINISH: { color: '#4390FF' }, // // 已完成
  '6004': { color: '#4390FF' }, // 取消暂挂
  APPLICATION_CLOSE: { color: '#4390FF' }, // 关闭
  PAYMENT: {
    color: '#4390FF',
    dot: 'pay-circle-o',
  }, // 支付
  '9002': {
    color: '#4390FF',
    dot: 'down-circle-o',
  }, // 退款
  REFUND: {
    color: '#4390FF',
    dot: 'down-circle-o',
  }, // 退票
  '9004': {
    color: '#4390FF',
    dot: 'clock-circle-o',
  }, // 反冲
  CON_CHANGE: {
    color: '#4390FF',
    dot: 'down-circle-o',
  }, // 变更
  PAYMENT_SUBMIT: { color: '#4390FF' }, // 发起支付
  default: { color: '#4390FF' }, // 未知
};
