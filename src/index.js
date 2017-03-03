import Webform from './Webform';
import TextArea from './TextArea';
import Checkbox from './Checkbox';
import Paragraph from './Paragraph';
import Select from './Select';
import GeneralInput from './GeneralInput';

const components = {
  textfield: GeneralInput,
  textarea: TextArea,
  checkbox: Checkbox,
  email: GeneralInput,
  tel: GeneralInput,
  webform_message: Paragraph,
  select: Select,
};

export default Webform;
export { components };
