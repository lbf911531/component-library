export interface IProps {
  checkedDesc?: string;
  unCheckedDesc?: string;
  disabled?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean, event?: any) => void;
  checkedChildren?: any;
  unCheckedChildren?: any;
}
