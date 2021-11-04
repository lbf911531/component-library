/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-06-15 11:20:39
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-08-20 17:26:35
 * @Version: 1.0.0
 * @Description: 气泡框-存储筛选方案
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */

import React, { useState } from 'react';
import { Input, Popconfirm, Button, message } from 'antd';
import { messages } from '../../utils';
import Service from './service';
import { customStringify } from './utils';

export default function SaveSolutionBubble(props) {
  const { onGetCondition, formValue, uniqueKey } = props;
  const [conditionName, setConditionName] = useState();

  function handleSave() {
    if (!uniqueKey) {
      message.error(
        messages(
          'common.set.key.before.save' /* 请先设置唯一值以关联筛选条件和当前页面 */,
        ),
      );
      return;
    }
    if (!conditionName) {
      message.error(
        messages(
          'base.please.set.the.filter.name.first' /* 请先设置筛选条件名 */,
        ),
      );
      return;
    }

    const params = {
      settingType: 'SEARCH',
      settingName: conditionName,
      settingValue: customStringify(formValue.params),
      settingKey: uniqueKey,
    };
    if (params.settingName.trim() === '') {
      message.error(
        messages(
          'base.filter.criteria.names.cannot.be.all.spaces' /* 筛选条件名字不能全为空格 */,
        ),
      );
    } else {
      handleSaveCondition(params);
    }
  }

  /**
   * 筛选条件弹窗确认保存
   */
  function handleSaveCondition(params) {
    Service.onSaveCondition(params)
      .then((res) => {
        message.success(messages('base.add.success'));
        const { onAfterSave } = props;
        // 保存后，通过接口刷新数据
        if (onAfterSave) onAfterSave(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleChangeName(e) {
    setConditionName(e.target.value);
  }

  return (
    <Popconfirm
      icon={false}
      title={
        <>
          <div className="margin-bottom-8">
            {messages('common.new.filter' /* 新建筛选条件 */)}
          </div>
          <Input
            value={conditionName}
            onChange={handleChangeName}
            placeholder={messages(
              'common.please.enter....a.filter.name' /* 请输入筛选条件名称 */,
            )}
          />
        </>
      }
      getPopupContainer={(node) => node.parentNode}
      overlayClassName="new-solution-bubble"
      onConfirm={handleSave}
      destroyTooltipOnHide
    >
      <Button
        className="edit-btn"
        onClick={() => {
          onGetCondition(false);
        }}
      >
        {messages('common.save.as' /* 另存为 */)}
      </Button>
    </Popconfirm>
  );
}
