import React, { Component } from 'react';
import { GlobalOutlined } from '@ant-design/icons';
import { Input, Tooltip } from 'antd';
import { DEFAULT_LANGUAGE_CONFIG } from './constant';
import LanguageForm from './form';
import { IProps } from './interface';
import { messages } from '../../utils';
import LocaleContext from '../../locale-lan-provider/context';
import './style.less';

/**
 * value的数据格式
 * {
 *   value: "你好",
 *   i18n: [{
 *     language: "zh_cn",
 *     value: "你好",
 *   }, {
 *     language: "en_us",
 *     value: "hello",
 *   }],
 * }
 */

/**
 * 用法和普通输入框一样 ^_^
 */

/**

 * ex:
 * {getFieldDecorator('parameterName', {
     rules: [],
      initialValue: parameterName,
    })(
      <InputLanguage
        placeholder="请输入"
      />
    )}
 *
 */

class InputLanguage extends Component<IProps> {
  lock: boolean | undefined;
  input: any;

  state = {
    visible: false,
    value: '',
    i18n: [],
  };
  static contextType = LocaleContext;

  componentDidMount() {
    let { value } = this.props;

    if (!value || JSON.stringify(value) === '{}') {
      value = {
        value: null,
        i18n: [],
      };
    }

    this.setState({
      value: value.value,
      i18n: (value.i18n || []).reduce((prev, cur) => {
        prev[cur.language] = cur.value;
        return prev;
      }, {}),
    });
  }

  componentWillReceiveProps(nextProps) {
    let { value } = nextProps;

    if (!value || JSON.stringify(value) === '{}') {
      value = {
        value: null,
        i18n: [],
      };
    }

    this.setState({
      value: value.value,
      i18n: (value.i18n || []).reduce((prev, cur) => {
        prev[cur.language] = cur.value;
        return prev;
      }, {}),
    });
  }

  /**
   * 优先从redux中取数据，如果没有则判断外界是否传入，使用外界的，否则则使用默认的
   * @returns
   */
  getLanguageInfo = () => {
    const { languages } = this.props;
    const { getState } = (window as any)?.g_app?._store || {};
    if (getState) {
      const { languages } = getState?.();
      if (languages?.local && languages?.languageType) {
        return languages;
      }
    }
    if (languages) {
      return languages;
    }
    return DEFAULT_LANGUAGE_CONFIG;
  };

  cancel = () => {
    const { onCancel } = this.props;
    this.setState({ visible: false }, () => {
      if (onCancel) onCancel();
    });
  };

  ok = (values) => {
    const languages = this.getLanguageInfo();
    this.setState(
      {
        visible: false,
        value: values[languages.local],
        i18n: values,
      },
      () => {
        const { onChange } = this.props;
        const value = values[languages.local];
        const i18n = values;
        if (onChange) {
          if (!value) {
            onChange(null);
          } else {
            onChange({
              value,
              i18n: (languages.languageType || []).map((item) => {
                return {
                  language: item.language,
                  value: i18n[item.language] || null,
                };
              }),
            });
          }
        }
      },
    );
  };

  change = (e) => {
    const { value } = e.target;
    const languages = this.getLanguageInfo();
    const { i18n } = this.state;
    this.setState(
      {
        value,
        i18n: {
          ...i18n,
          [languages.local]: value,
        },
      },
      () => {
        const { onChange } = this.props;
        if (onChange) {
          if (!value) {
            onChange(null);
          } else {
            onChange({
              value,
              i18n: (languages.languageType || []).map((item) => {
                return {
                  language: item.language,
                  // eslint-disable-next-line react/destructuring-assignment
                  value: this.state.i18n[item.language] || null,
                };
              }),
            });
          }
        }
      },
    );
  };

  // 打开对语言填写框
  open = () => {
    const { disabled } = this.props;
    if (disabled) return;
    this.lock = true;
    this.setState({ visible: true });
  };

  focus = () => {
    this.input.focus();
  };

  suffixIconClick = () => {
    const { beforeOpen } = this.props;
    this.open();
    if (beforeOpen) beforeOpen();
  };

  render() {
    const { visible, value, i18n } = this.state;
    const {
      disabled,
      placeholder,
      disabledInput = false,
      type = 'text',
      autoSize,
      valueLength,
      onBlur,
    } = this.props;
    // 是否必填
    // eslint-disable-next-line react/destructuring-assignment
    const required =
      this.props['data-__meta'] &&
      this.props['data-__meta'].rules &&
      // eslint-disable-next-line react/destructuring-assignment
      this.props['data-__meta'].rules.length &&
      this.props['data-__meta'].rules[0].required;

    const attribute = {
      value,
      disabled,
      placeholder,
      onChange: (e) => {
        if (!disabledInput) this.change(e);
      },
      onFocus: () => {
        if (disabledInput) this.open();
      },
    };

    return (
      <>
        {type && type.toLocaleLowerCase() === 'textarea' ? (
          <div className="input-language-wrap">
            <Input.TextArea {...attribute} autoSize={autoSize} />
            <Tooltip
              title={messages('common.fill.in.multilingual', {
                context: this.context,
              })}
            >
              <GlobalOutlined
                onClick={this.suffixIconClick}
                style={{
                  cursor: disabled ? 'not-allowed' : 'pointer',
                }}
                className="language-icon"
              />
            </Tooltip>
          </div>
        ) : (
          <Input
            {...attribute}
            suffix={
              <Tooltip
                title={messages('common.fill.in.multilingual', {
                  context: this.context,
                })}
              >
                <GlobalOutlined
                  onClick={this.suffixIconClick}
                  style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                />
              </Tooltip>
            }
            ref={(ref) => {
              this.input = ref;
            }}
            className="custom-inp"
            onBlur={onBlur}
          />
        )}
        {visible && (
          <LanguageForm
            visible={visible}
            onOk={this.ok}
            onCancel={this.cancel}
            i18n={i18n}
            required={required}
            type={type}
            autoSize={autoSize}
            valueLength={valueLength}
            languages={this.getLanguageInfo()}
          />
        )}
      </>
    );
  }
}

export default InputLanguage;
