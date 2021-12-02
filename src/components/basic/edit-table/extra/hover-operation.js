/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-06-10 10:29:49
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-12-01 10:48:15
 * @Version: 1.0.0
 * @Description: 滑入表格行，展示可操作下拉菜单
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */
import React, { useEffect, useState } from 'react';
import { Dropdown, Menu, Popconfirm } from 'antd';
// import { MoreOutlined } from '@ant-design/icons';
import _ from 'lodash';
import { messages } from '../../../utils';
import EditMoreSvg from '../images/editMore';

const EDIT = 'edit';
const COPY = 'copy';
const DELETE = 'delete';

export default function HoverOperation(props) {
  const {
    value,
    record,
    index,
    operationMap,
    onEdit,
    onDelete,
    hideDelete,
    hideEdit,
    onCopy,
    hideEditMore = false,
    rowKey,
  } = props;

  const eventTemplate = {
    [EDIT]: {
      label: messages('common.edit' /* 编辑 */),
      event: onEdit,
      disabled: false,
    },
    [COPY]: {
      label: messages('common.copy' /* 复制 */),
      event: handleCopy,
      disabled: false,
    },
    [DELETE]: {
      label: messages('common.delete' /* 删除 */),
      event: onDelete,
      danger: true,
      disabled: false,
    },
  };

  const [dropVisible, setDropVisible] = useState(false); // 控制下拉框显隐
  const [eventMap, setEventMap] = useState(_.cloneDeep(eventTemplate));

  useEffect(() => {
    if (operationMap) {
      const newMap = { ...eventMap, ...operationMap };
      if (hideEdit) {
        newMap[EDIT] = null;
      }
      if (operationMap[DELETE])
        newMap[DELETE] = { ...eventTemplate[DELETE], ...operationMap[DELETE] };
      setEventMap(newMap);
    }
  }, [operationMap, hideEdit]);

  function lastEventConfig(menu) {
    return { ...eventTemplate[menu], ...eventMap[menu] };
  }

  function handleDropVisibleChange(flag) {
    setDropVisible(flag);
  }

  function handleDelete() {
    eventMap[DELETE].event(record[rowKey], record, index);
  }

  function handleMenuClick(event, info) {
    event.domEvent.stopPropagation();
    if (event?.key) {
      const lastEventMap = lastEventConfig([event?.key]);
      const fn = lastEventMap.event;
      if (fn) fn(info.value, info.record, info.index);
      setDropVisible(!dropVisible);
    } else setDropVisible(true);
  }

  function handleCopy(cell, row, rowIndex) {
    if (onCopy) onCopy(row, rowIndex);
  }

  function handleCustomEvent(customEvent, eventValue, eventRecord) {
    customEvent(eventValue, eventRecord);
  }

  const notNormal = ['NEW', 'EDIT'].includes(record._status);
  const isHideDelete =
    typeof hideDelete === 'function' ? hideDelete(record) : hideDelete;

  return (
    <Dropdown
      visible={dropVisible}
      onVisibleChange={handleDropVisibleChange}
      onClick={(e) => e.stopPropagation()}
      destroyPopupOnHide
      overlay={
        <Menu
          onClick={(event) => {
            handleMenuClick(event, { value, record, index });
          }}
        >
          {Object.keys(eventMap).map((menu) => {
            if (!eventMap[menu] || menu === DELETE) return null;
            const lastEventMap = lastEventConfig(menu);
            const {
              label,
              disabled,
              hidden,
              isPopConfirm,
              title,
              event: customEvent,
            } = lastEventMap;
            const isHidden =
              typeof hidden === 'function' ? hidden(record) : hidden;
            if (isHidden) return null;
            const forbidden =
              typeof disabled === 'function' ? disabled(record) : disabled;
            if (isPopConfirm) {
              return (
                <div onClick={(e) => e.stopPropagation()}>
                  <Popconfirm
                    title={title} /** 确认删除？ */
                    okText={messages('common.ok')} /** 确认 */
                    cancelText={messages('common.cancel')} /** 取消 */
                    onConfirm={() => {
                      handleCustomEvent(customEvent, value, record);
                    }}
                    destroyTooltipOnHide
                  >
                    <Menu.Item key={menu} disabled={forbidden}>
                      {label}
                    </Menu.Item>
                  </Popconfirm>
                </div>
              );
            } else
              return (
                <Menu.Item key={menu} disabled={forbidden}>
                  {label}
                </Menu.Item>
              );
          })}

          {
            // 删除
            eventMap[DELETE] && !isHideDelete && (
              <>
                <Menu.Divider />
                <div onClick={(e) => e.domEvent.stopPropagation()}>
                  <Popconfirm
                    title={messages('common.delete.warning')} /** 确认删除？ */
                    okText={messages('common.ok')} /** 确认 */
                    cancelText={messages('common.cancel')} /** 取消 */
                    onConfirm={handleDelete}
                    destroyTooltipOnHide
                  >
                    <Menu.Item
                      key={DELETE}
                      disabled={
                        typeof eventMap[DELETE].disabled === 'function'
                          ? eventMap[DELETE].disabled(record)
                          : eventMap[DELETE].disabled
                      }
                      className="drop-down-menu-delete"
                    >
                      {eventMap[DELETE].label}
                    </Menu.Item>
                  </Popconfirm>
                </div>
              </>
            )
          }
        </Menu>
      }
      getPopupContainer={(node) => node.parentNode}
      overlayStyle={{ width: 130 }}
    >
      <EditMoreSvg
        className={
          notNormal
            ? 'display-none'
            : hideEditMore
            ? 'dropdown-menu-icon hidden-edit-more'
            : 'dropdown-menu-icon'
        }
        style={{ fontSize: 10 }}
      />
    </Dropdown>
  );
}
