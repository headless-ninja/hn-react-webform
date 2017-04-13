import Webform from './Webform';
import TextArea from './TextArea';
import CheckboxField from './CheckboxField';
import EmailField from './EmailField';
import PhoneField from './PhoneField';
import DateField from './DateField';
import ParagraphField from './ParagraphField';
import SelectField from './SelectField';
import Input from './Input';
import RadioField from './RadioField';
import FetchForm from './FetchForm';
import Fieldset from './Fieldset';
import DateOfBirthField from './DateOfBirthField';

const components = {
  textfield: Input,
  textarea: TextArea,
  checkbox: CheckboxField,
  email: EmailField,
  tel: PhoneField,
  date: DateField,
  webform_message: ParagraphField,
  select: SelectField,
  radios: RadioField,
  fieldset: Fieldset,
  webform_dateofbirth: DateOfBirthField,
};

export default Webform;
export { components, FetchForm };
