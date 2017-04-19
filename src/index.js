import Webform from './Webform';
import TextArea from './TextArea';
import CheckboxField from './CheckboxField';
import EmailField from './EmailField';
import PhoneField from './PhoneField';
import Date from './Date';
import ParagraphField from './ParagraphField';
import SelectField from './SelectField';
import Input from './Input';
import RadioField from './RadioField';
import FetchForm from './FetchForm';
import Fieldset from './Fieldset';

const components = {
  textfield: Input,
  textarea: TextArea,
  checkbox: CheckboxField,
  email: EmailField,
  tel: PhoneField,
  webform_date_custom: Date,
  webform_message: ParagraphField,
  select: SelectField,
  radios: RadioField,
  fieldset: Fieldset,
  webform_dateofbirth: Date,
};

export default Webform;
export { components, FetchForm };
