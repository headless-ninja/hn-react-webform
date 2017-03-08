import Webform from './Webform';
import TextArea from './TextArea';
import Checkbox from './EmailField';
import ParagraphField from './ParagraphField';
import SelectField from './SelectField';
import Input from './Input';
import RadioField from './RadioField';

const components = {
  textfield: Input,
  textarea: TextArea,
  checkbox: Checkbox,
  email: Input,
  tel: Input,
  webform_message: ParagraphField,
  select: SelectField,
  radio: RadioField,
};

export default Webform;
export{ components };
