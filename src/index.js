import Webform from './Webform';
import TextArea from './TextArea';
import Checkbox from './CheckboxField';
import Paragraph from './ParagraphField';
import Select from './SelectField';
import Input from './Input';
import Radio from './RadioField';

const components = {
  textfield: Input,
  textarea: TextArea,
  checkbox: Checkbox,
  email: Input,
  tel: Input,
  webform_message: Paragraph,
  select: Select,
  radio: Radio,
};

export default Webform;
export{ components };
