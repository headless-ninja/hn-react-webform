import 'babel-polyfill';
import Webform from './Webform';
import TextInput from './TextInput';
import TextArea from './TextArea';
import Checkbox from './Checkbox';
import EmailInput from './EmailInput';
import PhoneInput from './PhoneInput';
import Paragraph from './Paragraph';
import Select from './Select';

const components = {
  textfield: TextInput,
  textarea: TextArea,
  checkbox: Checkbox,
  email: EmailInput,
  tel: PhoneInput,
  webform_message: Paragraph,
  select: Select,
};

export default Webform;
export { components };
