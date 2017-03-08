import Webform from './Webform';
import TextArea from './TextArea';
import Checkbox from './CheckboxInput';
import Paragraph from './Paragraph';
import SelectField from './SelectField';
import Input from './Input';
import RadioInput from './RadioInput';

const components = {
  textfield: Input,
  textarea: TextArea,
  checkbox: Checkbox,
  email: Input,
  tel: Input,
  webform_message: Paragraph,
  select: SelectField,
  radio: RadioInput,
};

export default Webform;
export{ components };
