/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-05-27 10:55:57
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-10-20 09:56:09
 * @Version: 1.0.0
 * @Description: 新建筛选条件
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */

import React, { useState } from 'react';
import { Modal, Row, Col, Input, Form, message } from 'antd';
import { getUuid, messages } from 'utils/utils';
import Service from './service';

function NewFilterConditions(props) {
  const { formValue, uniqueKey, conditions } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();

  /**
   * 外部传入formValue（当前重命名的 / 新建的） object
   * 外部传入conditions （全量筛选方案） array
   * 1. 新建时 conditions.push(formValue)
   * 2. 编辑时 conditions.find
   * --
   * save JSON.stringify(conditions)
   */
  function handleSave() {
    if (!uniqueKey) {
      message.error(
        messages(
          'common.set.key.before.save' /* 请先设置唯一值以关联筛选条件和当前页面 */,
        ),
      );
      return;
    }
    form.validateFields().then((values) => {
      const newConditions = [...conditions];
      let params;
      if (formValue.value) {
        const index = newConditions.findIndex(
          (con) => con.value === formValue.value,
        );
        if (~index) {
          params = newConditions[index];
          params.settingName = values.name;
          params.settingValue = JSON.stringify(params.settingValue);
        }
      } else {
        newConditions.push({
          label: values.name,
          params: formValue.params,
          value: getUuid(),
        });
        params = {
          settingType: 'SEARCH',
          settingName: values.name,
          settingValue: JSON.stringify(formValue.params),
          settingKey: uniqueKey,
        };
      }
      handleSaveCondition(params, newConditions);
    });
  }

  /**
   * 筛选条件弹窗确认保存
   */
  function handleSaveCondition(params) {
    setConfirmLoading(true);
    Service.onSaveCondition(params)
      .then((res) => {
        handleCancel();
        setConfirmLoading(false);
        message.success(messages('common.save.success'));
        const { onAfterSave } = props;
        // 保存后，通过接口刷新数据
        if (onAfterSave) onAfterSave(res.data);
      })
      .catch((err) => {
        setConfirmLoading(false);
        console.log(err);
      });
  }

  function handleCancel() {
    if (props.onCancel) {
      props.onCancel();
    }
  }

  return (
    <Modal
      title={
        formValue?.value
          ? messages('common.rename.filter.criteria' /* 重命名筛选条件 */)
          : messages('common.new.filter' /* 新建筛选条件 */)
      }
      visible={formValue.visible}
      onCancel={handleCancel}
      onOk={handleSave}
      zIndex={1001}
      confirmLoading={confirmLoading}
    >
      <Form layout="vertical" form={form}>
        <Row>
          <Col span={24} style={{ padding: '0 20px' }}>
            <Form.Item
              label={messages(
                'common.set.filter.criteria.name' /* 设置筛选条件名称 */,
              )}
              name="name"
              rules={[
                {
                  required: true,
                  message: messages(
                    'common.name.of.warning' /* 请输入筛选条件名称！ */,
                  ),
                },
                {
                  whitespace: true,
                  message: messages(
                    'common.name.spaces.warning' /* 筛选条件名称不能全为空格！ */,
                  ),
                },
              ]}
              initialValue={formValue?.label || undefined}
            >
              <Input
                placeholder={messages(
                  'common.need.condition.name' /* 请输入条件名称 */,
                )}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default NewFilterConditions;
