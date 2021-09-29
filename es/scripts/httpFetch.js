function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }
    keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(
          target,
          key,
          Object.getOwnPropertyDescriptor(source, key),
        );
      });
    }
  }
  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-09-16 09:50:03
 * @LastEditors: binfeng.long@hand-china.com
 * @LastEditTime: 2021-09-29 15:08:25
 * @Version: 1.0.0
 * @Description:
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */
import axios from 'axios';
import qs from 'qs';
export function rewriteAxios() {
  var CancelToken = axios.CancelToken;
  var source = CancelToken.source();
  var baseUrl = '';
  var httpFetch = {
    get: function get(url, getParams) {
      var header =
        arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var options =
        arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      var params = getParams;

      var option = _objectSpread(
        _objectSpread({}, options),
        {},
        {
          url: baseUrl + url,
          method: 'GET',
          headers: _objectSpread({}, header),
          params: params,
          paramsSerializer: function paramsSerializer(param) {
            return qs.stringify(param, {
              arrayFormat: 'repeat',
            });
          },
          cancelToken: source.token,
        },
      );

      return axios(option);
    },
    post: function post(url, data) {
      var header =
        arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var options =
        arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      var headerParam =
        arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

      var params = _objectSpread({}, headerParam);

      var option = _objectSpread(
        _objectSpread({}, options),
        {},
        {
          url: baseUrl + url,
          method: 'POST',
          headers: _objectSpread({}, header),
          data: data,
          params: params,
          paramsSerializer: function paramsSerializer(param) {
            return qs.stringify(param, {
              arrayFormat: 'repeat',
            });
          },
          cancelToken: source.token,
        },
      );

      return axios(option);
    },
    put: function put(url, data) {
      var header =
        arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var params = {};
      var option = {
        url: baseUrl + url,
        method: 'PUT',
        headers: _objectSpread({}, header),
        data: data,
        params: params,
        paramsSerializer: function paramsSerializer(param) {
          return qs.stringify(param, {
            arrayFormat: 'repeat',
          });
        },
        cancelToken: source.token,
      };
      return axios(baseUrl + url, option);
    },
    delete: function _delete(url, data) {
      var header =
        arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var params = {};
      var option = {
        method: 'DELETE',
        headers: _objectSpread({}, header),
        data: data,
        params: params,
        paramsSerializer: function paramsSerializer(param) {
          return qs.stringify(param, {
            arrayFormat: 'repeat',
          });
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
