export interface Ii18n {
  language: string;
  value: string;
}

export interface ILanguage {
  value: string;
  i18n: Array<Ii18n> | undefined;
}

export interface IProps {
  value?: ILanguage;
  languages:
    | {
        local: string;
        languageType: Array<{
          id: string;
          languageName: string;
          enable?: boolean;
          language: string;
          code?: string;
        }>;
      }
    | undefined;
  onCancel?: () => void;
  onChange?: (value: undefined | null | ILanguage) => void;
  disabled?: boolean;
  beforeOpen?: () => void;
  placeholder?: string | undefined;
  disabledInput?: boolean;
  valueLength?: number;
  onBlur?: () => void;
  type?: string;
  autoSize?: any;
}

export interface IFormProps extends IProps {
  required?: boolean;
  i18n: Array<Ii18n> | undefined;
  onOk: (values) => void;
  visible: boolean;
  languages: {
    local: string;
    languageType: Array<{
      id: string;
      languageName: string;
      enable?: boolean;
      language: string;
      code?: string;
    }>;
  };
}
