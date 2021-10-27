import React, { useEffect, useContext } from 'react';
import { Modal, Input, Form } from 'antd';
import { IFormProps } from './interface';
import { messages } from '@/components/utils';
import LocaleContext from '@/components/locale-lan-provider/context';

function LanguageForm(props: IFormProps) {
  const [form] = Form.useForm();
  const context = useContext(LocaleContext);
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
    <Modal
      {...props}
      title={messages('common.fill.in.multilingual', { context })}
      onOk={ok}
      onCancel={cancel}
      width={600}
    >
      <Form
        wrapperCol={{ span: 16 }}
        labelCol={{ span: 6 }}
        form={form}
        initialValues={i18n}
      >
        {languages.languageType.map((item) => {
          return (
            <Form.Item
              key={item.language}
              label={item.languageName}
              name={item.language}
              rules={[
                {
                  required: required && languages.local === item.code,
                  message: messages('common.please.enter', { context }),
                },
                {
                  max: isTextArea ? valueLength : 80,
                  message: messages('base.no.more.than.limit', {
                    params: { number: valueLength ?? 80 },
                    context,
                  }),
                },
                {
                  whitespace: true,
                  message: messages('common.please.enter', { context }),
                },
              ]}
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
