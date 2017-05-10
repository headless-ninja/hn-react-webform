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
import IBAN from './IBAN';
import Address from './Address';
import Hidden from './Hidden';
import RangeField from './RangeField';
import WizardPages from './Wizard';
import Relation from './Relation';
import FormRow from './FormRow';

const components = {
  checkbox: CheckboxField,
  email: EmailField,
  fieldset: Fieldset,
  hidden: Hidden,
  iban: IBAN,
  radios: RadioField,
  range: RangeField,
  select: SelectField,
  tel: PhoneField,
  textfield: Input,
  textarea: TextArea,
  webform_address_custom: Address,
  webform_date_custom: Date,
  webform_dateofbirth: Date,
  webform_iban: FormRow,
  webform_message: ParagraphField,
  webform_relation_custom: Relation,
  webform_relation_postcode_custom: Relation,
  webform_wizard_pages: WizardPages,
  default: Fieldset,
};

export default Webform;
export { components, FetchForm };
