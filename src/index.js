import Webform from './Webform';
import TextArea from './TextArea';
import CheckboxField from './CheckboxField';
import EmailField from './EmailField';
import ParagraphField from './ParagraphField';
import SelectField from './SelectField';
import Input from './Input';
import RadioField from './RadioField';

const components = {
  textfield: Input,
  textarea: TextArea,
  checkbox: CheckboxField,
  email: EmailField,
  tel: Input,
  webform_message: ParagraphField,
  select: SelectField,
  radios: RadioField,
};

export default Webform;
export{ components };
