import React, { Component } from 'react';
import { Modal, Spin, Button, Popover } from 'antd';
import WrapperConnect from '../custom-connect';
import debounce from 'lodash.debounce';
// @ts-ignore
import httpFetch from 'share/httpFetch';
// @ts-ignore
import config from 'config';
import moment from 'moment';
import { messages, formatMoney } from '../utils';
import { IListSelectorProps, ILov, AlignType } from './interface';
import Lov from './lov';

interface IListSelectorState {
  lov: ILov;
  loading: boolean;
}
const renderMap = {
  time: {
    align: 'center',
    render: (value: any) => (value ? moment(value).format('YYYY-MM-DD') : '-'),
  },
  amount: {
    align: 'right',
    render: (value: string | number) => formatMoney(value, 2, true),
  },
  default: {
    align: 'left',
    render: (value: string | number) => (
      <Popover content={value}>{value}</Popover>
    ),
  },
};
class ListSelector extends Component<IListSelectorProps, IListSelectorState> {
  lovRef: any;

  static defaultProps = {
    width: 800,
  };

  constructor(props: IListSelectorProps) {
    super(props);
    this.state = {
      lov: {},
      loading: true,
    };
    this.onOk = debounce(this.onOk, props.delay ? 200 : 0);
  }

  componentWillReceiveProps(nextProps: IListSelectorProps) {
    const { visible } = this.props;
    const { isRequest } = nextProps;
    // lov显示
    if (nextProps.visible && !visible) {
      if (!isRequest) {
        this.getLovByCode(nextProps);
        return;
      }
      // @ts-ignore
      this.setState({ loading: true, lov: nextProps.lov }, () => {
        this.setState({ loading: false });
      });
    }
  }

  // 为columns的每个成员添加一个render函数
  addRenderFnc = (column: any) => {
    const temp = column;
    const { fieldType } = temp;
    const type: AlignType = fieldType;
    if (fieldType) {
      const { align, render } = renderMap[type] || renderMap.default;
      temp.align = align;
      temp.render = render;
    }
    return temp;
  };

  // 获取lov详情
  getLovByCode = (nextProps: IListSelectorProps): void => {
    /* @ts-ignore */
    const {
      code,
      lovData = {},
      dispatch,
      selectorItem,
      searchList = [],
      searchListIndex,
      columnsList = [],
      needCache = true,
    } = nextProps;

    const columnsMap: any = {};

    if (Array.isArray(columnsList) && columnsList.length) {
      columnsList.forEach((column) => {
        if (column.dataIndex) {
          columnsMap[column.dataIndex] = column;
        }
      });
    }

    const columnsFlag = !!Object.keys(columnsMap).length;

    if (selectorItem && selectorItem.constructor === Object) {
      selectorItem.columns = selectorItem.columns.map((item: any) => {
        let tempItem = item;
        tempItem.title = messages(item.title);
        if (item.tooltips) {
          tempItem.render = (value: any) => (
            <Popover content={value}>{value}</Popover>
          );
        }
        if (columnsFlag && columnsMap[item.dataIndex]) {
          tempItem = { ...tempItem, ...columnsMap[item.dataIndex] };
        }
        return tempItem;
      });

      if (Array.isArray(searchList)) {
        const exitIds = selectorItem.searchForm.map((item: any) => item.id);
        const tempSearchList = searchList.filter(
          (item) => !exitIds.includes(item.id),
        );
        if (searchListIndex || searchListIndex === 0) {
          selectorItem.searchForm.splice(searchListIndex, 0, ...tempSearchList);
        } else {
          selectorItem.searchForm =
            selectorItem.searchForm.concat(tempSearchList);
        }
      }
      const { paramAsBody = false } = this.props;
      this.setState(
        { lov: { method: 'get', paramAsBody, ...selectorItem }, loading: true },
        () => {
          this.setState({ loading: false });
        },
      );
    } else if (code) {
      if (code in lovData) {
        // loading 的切换不仅时为了旋转加载，同时也是重挂载lov组件
        this.setState(
          { lov: { ...lovData[code], key: nextProps.valueKey }, loading: true },
          () => {
            this.setState({ loading: false });
          },
        );
        return;
      }

      this.setState({ loading: true });
      httpFetch
        .get(`${config.baseUrl}/api/lov/detail/${code}`)
        .then(({ data }: any) => {
          if (data) {
            const tempData = data;
            const {
              hideColumns = [],
              hideSearchList = [],
              paramAsBody = false,
            } = this.props;

            tempData.columns = data.columns
              .reduce((pre: any, cur: any) => {
                if (!cur) {
                  return pre;
                }
                if (hideColumns.includes(cur.dataIndex)) {
                  return pre;
                }
                if (cur.dataIndex in columnsMap) {
                  return pre;
                }

                const temp = {
                  ...cur,
                  title: messages(cur.title),
                  width: cur.width || 200,
                };
                const tempObjAfterAdd = this.addRenderFnc(temp);
                pre.push(tempObjAfterAdd);
                return pre;
              }, [])
              .concat(columnsList);

            const tempSearchMap: any = {};

            searchList.forEach((item) => {
              if (item.id) {
                tempSearchMap[item.id] = item;
              }
            });

            tempData.searchForm = [
              ...data.searchForm.reduce((pre: any, cur: any) => {
                if (hideSearchList.includes(cur.id)) {
                  return pre;
                }
                if (cur.id in tempSearchMap) {
                  return pre;
                }
                pre.push({ ...cur, label: messages(cur.label) });
                return pre;
              }, []),
            ];

            if (searchListIndex || searchListIndex === 0) {
              tempData.searchForm.splice(searchListIndex, 0, ...searchList);
            } else {
              tempData.searchForm = tempData.searchForm.concat(searchList);
            }

            this.setState(
              {
                lov: { ...tempData, key: nextProps.valueKey, paramAsBody },
                loading: false,
              },
              () => {
                if (needCache && dispatch) {
                  const { lov } = this.state;
                  dispatch({
                    type: 'lov/addLovData',
                    payload: { [code]: lov },
                  });
                }
              },
            );
          }
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  };

  onOk = () => {
    const { onOk, single, lovType, code } = this.props;
    if (onOk) {
      if (single && lovType === 'lov') {
        onOk(this.lovRef.state.selectedRows[0] || null);
      } else if (lovType === 'listSelector') {
        onOk({
          type: code || '',
          result: this.lovRef.state.selectedRows,
        });
      } else {
        onOk(this.lovRef.state.selectedRows);
      }
    }
  };

  cancelHandle = () => {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
  };

  render() {
    const { loading, lov } = this.state;
    /* @ts-ignore */
    const {
      single,
      disabled,
      visible,
      width,
      value,
      title,
      selectedData,
      hideFooter,
      diyFooter,
      onReturn,
      okText,
      cancelText,
      confirmLoading,
    } = this.props;

    const foot =
      diyFooter && hideFooter
        ? {
            footer: (
              <Button onClick={onReturn || this.cancelHandle}>
                {messages('budgetJournal.return')}
              </Button>
            ),
          }
        : hideFooter
        ? { footer: null }
        : {};

    return (
      <Modal
        title={messages(title || lov?.title)}
        visible={visible}
        bodyStyle={{ maxHeight: '65vh', overflow: 'auto', minHeight: '200px' }}
        onOk={this.onOk}
        confirmLoading={confirmLoading}
        onCancel={this.cancelHandle}
        width={typeof width === 'number' ? width : parseInt(String(width), 10)}
        okText={okText || messages('common.ok')}
        cancelText={cancelText || messages('common.cancel')}
        okButtonProps={{
          style: { display: !single && disabled ? 'none' : 'inline-block' },
        }}
        {...foot}
      >
        {loading ? (
          <Spin />
        ) : (
          <Lov
            {...this.props}
            width={
              typeof width === 'number' ? width : parseInt(String(width), 10)
            }
            ref={(ref) => {
              this.lovRef = ref;
            }}
            lov={lov}
            selectedData={value || selectedData}
          />
        )}
      </Modal>
    );
  }
}

function mapStateToProps(state: any) {
  return {
    lovData: state?.lov?.data,
  };
}

export default WrapperConnect(mapStateToProps)(ListSelector);
