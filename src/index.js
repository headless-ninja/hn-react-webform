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
import Parser from './Parser';
import Number from './Number';
import Converse from './Converse';

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
  webform_email_custom: EmailField,
  webform_address_custom: Address,
  webform_checkbox_custom: CheckboxField,
  webform_select_custom: SelectField,
  webform_textarea_custom: TextArea,
  webform_radios_custom: RadioField,
  webform_telephone_custom: PhoneField,
  webform_textfield_custom: Input,
  webform_date_custom: Date,
  webform_dateofbirth: Date,
  webform_iban: FormRow,
  webform_message: ParagraphField,
  webform_relation_custom: Relation,
  webform_relation_postcode_custom: Relation,
  webform_wizard_pages: WizardPages,
  webform_number_custom: Number,
  webform_converse_payment: Converse,
  default: Fieldset,
};

export default Webform;
export { components, FetchForm, Parser };
