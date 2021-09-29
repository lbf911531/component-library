/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-09-16 09:50:03
 * @LastEditors: binfeng.long@hand-china.com
 * @LastEditTime: 2021-09-16 14:17:56
 * @Version: 1.0.0
 * @Description:
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */
import axios from 'axios';
import qs from 'qs';

export function rewriteAxios() {
  const { CancelToken } = axios;
  const source = CancelToken.source();
  const baseUrl = '';
  const httpFetch = {
    get(url, getParams, header = {}, options = {}) {
      let params = getParams;

      const option = {
        ...options,
        url: baseUrl + url,
        method: 'GET',
        headers: {
          ...header,
        },
        params,
        paramsSerializer(param) {
          return qs.stringify(param, { arrayFormat: 'repeat' });
        },
        cancelToken: source.token,
      };
      return axios(option);
    },
    post(url, data, header = {}, options = {}, headerParam = {}) {
      let params = { ...headerParam };

      const option = {
        ...options,
        url: baseUrl + url,
        method: 'POST',
        headers: {
          ...header,
        },
        data,
        params,
        paramsSerializer(param) {
          return qs.stringify(param, { arrayFormat: 'repeat' });
        },
        cancelToken: source.token,
      };

      return axios(option);
    },
    put(url, data, header = {}) {
      let params = {};

      const option = {
        url: baseUrl + url,
        method: 'PUT',
        headers: {
          ...header,
        },
        data,
        params,
        paramsSerializer(param) {
          return qs.stringify(param, { arrayFormat: 'repeat' });
        },
        cancelToken: source.token,
      };
      return axios(baseUrl + url, option);
    },
    delete(url, data, header = {}) {
      let params = {};

      const option = {
        method: 'DELETE',
        headers: {
          ...header,
        },
        data,
        params,
        paramsSerializer(param) {
          return qs.stringify(param, { arrayFormat: 'repeat' });
        },
        cancelToken: source.token,
      };
      return axios(baseUrl + url, option);
    },
  };
  window.httpFetch = httpFetch;
  console.log('将axios注册到window全局...');
  return httpFetch;
}
