import 'babel-polyfill';
import Webform from './Webform';
import TextInput from './TextInput';
import TextArea from './TextArea';
import Checkbox from './Checkbox';
import EmailInput from './EmailInput';
import PhoneInput from './PhoneInput';
import Select from './Select';

const components = {
  textfield: TextInput,
  textarea: TextArea,
  checkbox: Checkbox,
  email: EmailInput,
  tel: PhoneInput,
  select: Select,
};

export default Webform;
export { components };
