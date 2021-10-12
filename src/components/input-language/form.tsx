import React, { useEffect } from 'react';
import { Modal, Input, Form } from 'antd';
import { IFormProps } from './interface';

function LanguageForm(props: IFormProps) {
  const [form] = Form.useForm();
  const { languages, required, i18n, type, autoSize, valueLength } = props;
  const isTextArea = type && type.toLocaleLowerCase() === 'textarea';

  useEffect(() => {
    const { validateFields } = form;
    validateFields();
  }, []);

  function ok() {
    const { validateFields } = form;
    validateFields()
      .then((values) => {
        const { onOk } = props;
        onOk(values);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function cancel() {
    const { onCancel } = props;
    onCancel();
  }

  return (
    <Modal {...props} title="填写语言" onOk={ok} onCancel={cancel} width={600}>
      <Form wrapperCol={{ span: 16 }} labelCol={{ span: 6 }} form={form}>
        {languages.languageType.map((item) => {
          return (
            <Form.Item
              key={item.language}
              label={item.languageName}
              name={item.language}
              rules={[
                {
                  required: required && languages.local === item.code,
                  message: '请输入',
                },
                {
                  max: isTextArea ? valueLength : 80,
                  message: `最多输入${valueLength ?? 80}个字符`,
                },
                {
                  whitespace: true,
                  message: '请输入',
                },
              ]}
              initialValue={i18n[item.language]}
            >
              {isTextArea ? <Input.TextArea autoSize={autoSize} /> : <Input />}
            </Form.Item>
          );
        })}
      </Form>
    </Modal>
  );
}

export default LanguageForm;
