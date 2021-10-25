import { getImgIcon } from 'utils/utils';

export const canExportPdf = (fileName: string) => {
  const fileType = (fileName || '').split('.').pop().toLowerCase();
  if (['zip', 'rar'].includes(fileType)) {
    return true;
  }
  return getImgIcon(fileName, true);
};

export const filterCanExportPdfMap = (
  fileObject: Object,
  downloadFormat?: string,
) => {
  const result = {};
  Object.entries(fileObject).forEach((item) => {
    const [id, attachments] = item;
    if (id && Array.isArray(attachments)) {
      result[id] = attachments.filter((value) => {
        if (downloadFormat === 'pdf') {
          return canExportPdf(value.fileName);
        }
        return true;
      });
    }
  });
  return result;
};

export const filterCanExportPdf = (checkedMap: Object) => {
  const result = {};
  for (const key in checkedMap) {
    if ({}.hasOwnProperty.call(checkedMap, key)) {
      if (canExportPdf(checkedMap[key].fileName)) {
        result[key] = checkedMap[key];
      }
    }
  }
  return result;
};

export const transformToObject = (list: Object[], field: string = 'id') => {
  if (!Array.isArray(list)) return {};
  return list.reduce((pre, cur, index) => {
    return { ...pre, [cur[field]]: { ...cur, sortIndex: index } };
  }, {});
};

export const transformQueryUrl = (baseUrl: string, params: Object) => {
  let url = baseUrl;
  for (const key in params) {
    if ({}.hasOwnProperty.call(params, key)) {
      url += `${url.includes('?') ? '&' : '?'}${key}=${params[key]}`;
    }
  }
  return url;
};

export const transformSelectRows = (
  rows: Object[],
  lineField: string,
  pkValueField: string = 'id',
) => {
  if (!Array.isArray(rows)) return {};
  return rows.reduce((pre, cur, index) => {
    const documentLineIds = (cur[lineField] || []).reduce((obj, lineId) => {
      return { ...obj, [lineId]: { headerId: cur.id } };
    }, {});
    return {
      ...pre,
      [cur[pkValueField]]: { ...cur, sortIndex: index, documentLineIds },
    };
  }, {});
};

export const filterAndSetSortIndex = (
  selectedRowKeys: Object[],
  allSelectedRows: Object,
) => {
  return selectedRowKeys.reduce((pre, cur, index) => {
    return { ...pre, [cur]: { ...allSelectedRows[cur], sortIndex: index } };
  }, {});
};
