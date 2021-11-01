/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-10-26 10:45:50
 * @LastEditors: binfeng.long@hand-china.com
 * @LastEditTime: 2021-10-26 11:56:46
 * @Version: 1.0.0
 * @Description:
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */

import { ReactNode } from 'react';

export interface IProps {
  expandIcon: (panelProps) => ReactNode | undefined;
  header: ReactNode | undefined;
  entityType: string; // 单据类型
  documentId: string; // 单据id
  infoData?: Array<{ [key: string]: any }>; // 单据历史数据
  slideFrameFlag?: boolean; // 审批历史在侧滑框显示
  url?: string;
  params?: { [key: string]: any };
  methodType?: string;
}

export interface IState {
  historyData: Array<{ [key: string]: any }>;
  loading: boolean;
  expenseColorFlag: boolean;
}
