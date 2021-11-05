/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-05-27 16:27:29
 * @LastEditors: binfeng.long@hand-china.com
 * @LastEditTime: 2021-06-03 11:41:15
 * @Version: 1.0.0
 * @Description:
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */

import config from '@/config/config';
import httpFetch from '@/share/httpFetch';

export default {
  /**
   * 删除筛选方案
   * @param {*} id
   */
  onDeleteCondition(id) {
    const url = `${config.baseUrl}/api/user/component/setting?id=${id}`;
    return httpFetch.delete(url);
  },
  /**
   * 保存筛选方案
   * @param {*} params
   */
  onSaveCondition(params) {
    const url = `${config.baseUrl}/api/user/component/setting`;
    return httpFetch.post(url, params);
  },
  /**
   * 获取所有的筛选方案
   * @param {*} params
   */
  onGetAllConditions(key) {
    const url = `${config.baseUrl}/api/user/component/setting/list`;
    return httpFetch.get(url, { type: 'SEARCH', key });
  },
};
