import React from 'react';
import { storiesOf } from '@kadira/storybook';
import Markdown from 'react-remarkable';
import hljs from 'highlight.js';
import 'highlight.js/styles/default.css';
import Readme from '../README.md';
import Webform from '../src';
import RemoteForm from './RemoteForm';

storiesOf('RDW - Documentation', module)
  .add('Readme', () => (
    <Markdown
      source={Readme} options={{
        highlight: (str, lang) => {
          console.log(str);
          if(lang && hljs.getLanguage(lang)) {
            try {
              return hljs.highlight(lang, str).value;
            } catch(err) {
              console.error(err);
            }
          }

          try {
            return hljs.highlightAuto(str).value;
          } catch(err) {
            console.error(err);
          }

          return ''; // use external default escaping
        },
      }}
    />
  ));

storiesOf('Examples', module)
  .add('Routeboekje formulier', () => (
    <Webform
      settings={{
        title: 'Routeboekje form',
        postUrl: false,
      }}
      form={{
        form_id: 'natuurmonumenten_routeboekje',
        settings: {
          page: true,
          page_submit_path: '',
          page_confirm_path: '',
          form_submit_label: 'Routeboekje aanvragen',
          form_submit_once: false,
          form_submit_attributes: [],
          form_exception_message: '',
          form_closed_message: '',
          form_previous_submissions: true,
          form_confidential: false,
          form_confidential_message: '',
          form_prepopulate: false,
          form_prepopulate_source_entity: false,
          form_novalidate: false,
          form_unsaved: false,
          form_disable_back: false,
          form_autofocus: false,
          form_details_toggle: false,
          wizard_progress_bar: true,
          wizard_progress_pages: false,
          wizard_progress_percentage: false,
          wizard_next_button_label: '',
          wizard_next_button_attributes: [],
          wizard_prev_button_label: '',
          wizard_prev_button_attributes: [],
          wizard_start_label: '',
          wizard_complete: true,
          wizard_complete_label: '',
          preview: 0,
          preview_next_button_label: '',
          preview_next_button_attributes: [],
          preview_prev_button_label: '',
          preview_prev_button_attributes: [],
          preview_message: '',
          draft: false,
          draft_auto_save: false,
          draft_button_label: '',
          draft_button_attributes: [],
          draft_saved_message: '',
          draft_loaded_message: '',
          confirmation_type: 'page',
          confirmation_message: '',
          confirmation_url: '',
          confirmation_attributes: [],
          confirmation_back: true,
          confirmation_back_label: '',
          confirmation_back_attributes: [],
          limit_total: null,
          limit_total_message: '',
          limit_user: null,
          limit_user_message: '',
          purge: 'none',
          purge_days: null,
          entity_limit_total: null,
          entity_limit_user: null,
          results_disabled: false,
          results_disabled_ignore: false,
          token_update: false,
          crm_connection: {
            4: 0,
          },
        },
        elements: [
          {
            '#type': 'webform_message',
            '#message_message': 'Vraag nu het gratis routeboekje aan. Je kunt kiezen uit vijf regio&"#39";s waar je het liefst wilt wandelen of fietsen.',
            '#webform_id': 'natuurmonumenten_routeboekje--introduction',
            '#webform_key': 'introduction',
            '#webform_parent_key': '',
            '#webform_parent_flexbox': false,
            '#webform_depth': 0,
            '#webform_children': [],
            '#webform_multiple': false,
            '#webform_composite': false,
            '#title': null,
            '#admin_title': null,
            '#states': {
              visible: [
                {
                  ':input[name="name"]': {
                    empty: true,
                  },
                },
                {
                  ':input[name="name"]': {
                    filled: true,
                  },
                },
              ],
              invisible: {
                ':input[name="name"]': {
                  value: '1',
                },
              },
              enabled: {
                ':input[name="checkbox_with_dependency"]': {
                  checked: true,
                },
              },
              disabled: {
                ':input[name="message"]': {
                  filled: true,
                },
              },
              required: {
                ':input[name="phone_number"]': {
                  filled: true,
                },
              },
              optional: {
                ':input[name="phone_number"]': {
                  unchecked: true,
                },
              },
              checked: {
                ':input[name="conditional_input_always_required"]': {
                  empty: true,
                },
              },
              unchecked: {
                ':input[name="message"]': {
                  collapsed: true,
                },
              },
            },
          },
          {
            '#type': 'select',
            '#title': 'In welke regio wandel of fiets je graag?',
            '#title_display': 'before',
            '#options': {
              'groningen-friesland-drenthe': 'Groningen, Friesland, Drenthe',
              'zuid-holland-zeeland': 'Zuid-holland & Zeeland',
            },
            '#empty_option': 'Selecteer de gewenste regio',
            '#select2': true,
            '#required': true,
            '#webform_id': 'natuurmonumenten_routeboekje--in_welke_regio_wandel_of_fiets_je_graag_',
            '#webform_key': 'in_welke_regio_wandel_of_fiets_je_graag_',
            '#webform_parent_key': '',
            '#webform_parent_flexbox': false,
            '#webform_depth': 0,
            '#webform_children': [],
            '#webform_multiple': false,
            '#webform_composite': false,
            '#admin_title': null,
          },
          {
            '#type': 'radios',
            '#title': 'Gender',
            '#title_display': 'invisible',
            '#options': {
              Male: 'Male',
              Female: 'Female',
            },
            '#options_display': 'side_by_side',
            '#required': true,
            '#required_error': 'Please select your gender',
            '#webform_id': 'natuurmonumenten_routeboekje--gender',
            '#webform_key': 'gender',
            '#webform_parent_key': '',
            '#webform_parent_flexbox': false,
            '#webform_depth': 0,
            '#webform_children': [],
            '#webform_multiple': false,
            '#webform_composite': false,
            '#admin_title': null,
          },
          {
            '#type': 'textfield',
            '#title': 'First name',
            '#required': true,
            '#webform_id': 'natuurmonumenten_routeboekje--first_name',
            '#webform_key': 'first_name',
            '#webform_parent_key': '',
            '#webform_parent_flexbox': false,
            '#webform_depth': 0,
            '#webform_children': [],
            '#webform_multiple': false,
            '#webform_composite': false,
            '#admin_title': null,
          },
          {
            '#type': 'textfield',
            '#title': 'Middle name',
            '#webform_id': 'natuurmonumenten_routeboekje--middle_name',
            '#webform_key': 'middle_name',
            '#webform_parent_key': '',
            '#webform_parent_flexbox': false,
            '#webform_depth': 0,
            '#webform_children': [],
            '#webform_multiple': false,
            '#webform_composite': false,
            '#admin_title': null,
          },
          {
            '#type': 'textfield',
            '#title': 'Last name',
            '#required': true,
            '#webform_id': 'natuurmonumenten_routeboekje--last_name',
            '#webform_key': 'last_name',
            '#webform_parent_key': '',
            '#webform_parent_flexbox': false,
            '#webform_depth': 0,
            '#webform_children': [],
            '#webform_multiple': false,
            '#webform_composite': false,
            '#admin_title': null,
          },
          {
            '#type': 'tel',
            '#title': 'Phone number',
            '#description': 'Voer je telefoonnummer in, bijvoorbeeld 0123456789.',
            '#description_display': 'after',
            '#required': true,
            '#webform_id': 'natuurmonumenten_routeboekje--phone_number',
            '#webform_key': 'phone_number',
            '#webform_parent_key': '',
            '#webform_parent_flexbox': false,
            '#webform_depth': 0,
            '#webform_children': [],
            '#webform_multiple': false,
            '#webform_composite': false,
            '#admin_title': null,
          },
          {
            '#type': 'email',
            '#title': 'Email address',
            '#description': 'Je ontvangt een e-mail ter bevestiging.',
            '#description_display': 'after',
            '#required': true,
            '#webform_id': 'natuurmonumenten_routeboekje--email_address',
            '#webform_key': 'email_address',
            '#webform_parent_key': '',
            '#webform_parent_flexbox': false,
            '#webform_depth': 0,
            '#webform_children': [],
            '#webform_multiple': false,
            '#webform_composite': false,
            '#admin_title': null,
          },
          {
            '#type': 'radios',
            '#title': 'Steun de natuur',
            '#description': 'Wil je lid worden van Natuurmonumenten en zorg dragen voor het behoud van de mooie natuur in Nederland? Zo kun je niet alleen z&eacute;lf maar kunnen ook toekomstige generaties van de natuur blijven genieten!<br /> <br /> Als cadeau ontvang je het boek &"#39"";Beleef de natuur&"#39"; met 80 verrassende tochten door heel Nederland.',
            '#default_value': '0',
            '#title_display': 'invisible',
            '#description_display': 'before',
            '#options': {
              false: 'Nee, bedankt',
              true: 'Ja, ik steun de natuur',
            },
            '#webform_id': 'natuurmonumenten_routeboekje--steun_de_natuur',
            '#webform_key': 'steun_de_natuur',
            '#webform_parent_key': '',
            '#webform_parent_flexbox': false,
            '#webform_depth': 0,
            '#webform_children': [],
            '#webform_multiple': false,
            '#webform_composite': false,
            '#admin_title': null,
          },
          {
            '#type': 'fieldset',
            '#title': 'Donation fieldset',
            '#title_display': 'invisible',
            '#open': true,
            '#states': {
              visible: {
                ':input[name="steun_de_natuur"]': {
                  value: '1',
                },
              },
            },
            donation_recurrence: {
              '#type': 'radios',
              '#title': 'Donation recurrence',
              '#default_value': 'monthly',
              '#options': {
                monthly: 'Monthly',
                yearly: 'Yearly',
              },
              '#options_display': 'side_by_side',
              '#required': true,
              '#webform_id': 'natuurmonumenten_routeboekje--donation_recurrence',
              '#webform_key': 'donation_recurrence',
              '#webform_parent_key': 'donation_fieldset',
              '#webform_parent_flexbox': false,
              '#webform_depth': 1,
              '#webform_children': [],
              '#webform_multiple': false,
              '#webform_composite': false,
              '#admin_title': null,
            },
            donation_monthly: {
              '#type': 'radios',
              '#title': 'Donation monthly',
              '#default_value': '5',
              '#title_display': 'invisible',
              '#options': {
                5: '€ 5',
                10: '€ 10',
                2.5: '€ 2,5',
                other: 'Other',
              },
              '#options_display': 'side_by_side',
              '#required': true,
              '#states': {
                visible: {
                  ':input[name="donation_recurrence"]': {
                    value: 'monthly',
                  },
                },
              },
              '#webform_id': 'natuurmonumenten_routeboekje--donation_monthly',
              '#webform_key': 'donation_monthly',
              '#webform_parent_key': 'donation_fieldset',
              '#webform_parent_flexbox': false,
              '#webform_depth': 1,
              '#webform_children': [],
              '#webform_multiple': false,
              '#webform_composite': false,
              '#admin_title': null,
            },
            donation_monthly_other: {
              '#type': 'textfield',
              '#title': 'Donation monthly other',
              '#default_value': '3',
              '#field_prefix': '€',
              '#required': true,
              '#states': {
                visible: [
                  {
                    ':input[name="donation_monthly"]': {
                      value: 'other',
                    },
                  },
                  {
                    ':input[name="donation_recurrence"]': {
                      value: 'monthly',
                    },
                  },
                ],
              },
              '#webform_id': 'natuurmonumenten_routeboekje--donation_monthly_other',
              '#webform_key': 'donation_monthly_other',
              '#webform_parent_key': 'donation_fieldset',
              '#webform_parent_flexbox': false,
              '#webform_depth': 1,
              '#webform_children': [],
              '#webform_multiple': false,
              '#webform_composite': false,
              '#admin_title': null,
            },
            donation_yearly: {
              '#type': 'radios',
              '#title': 'Donation yearly',
              '#default_value': '37.5',
              '#title_display': 'invisible',
              '#options': {
                50: '€ 50',
                37.5: '€ 37.50',
                27.5: '€ 27.50',
                other: 'Other',
              },
              '#options_display': 'side_by_side',
              '#required': true,
              '#states': {
                visible: {
                  ':input[name="donation_recurrence"]': {
                    value: 'yearly',
                  },
                },
              },
              '#webform_id': 'natuurmonumenten_routeboekje--donation_yearly',
              '#webform_key': 'donation_yearly',
              '#webform_parent_key': 'donation_fieldset',
              '#webform_parent_flexbox': false,
              '#webform_depth': 1,
              '#webform_children': [],
              '#webform_multiple': false,
              '#webform_composite': false,
              '#admin_title': null,
            },
            donation_yearly_other: {
              '#type': 'textfield',
              '#title': 'Donation yearly other',
              '#default_value': '30',
              '#title_display': 'invisible',
              '#field_prefix': '€',
              '#required': true,
              '#states': {
                visible: [
                  {
                    ':input[name="donation_yearly"]': {
                      value: 'other',
                    },
                  },
                  {
                    ':input[name="donation_recurrence"]': {
                      value: 'yearly',
                    },
                  },
                ],
              },
              '#webform_id': 'natuurmonumenten_routeboekje--donation_yearly_other',
              '#webform_key': 'donation_yearly_other',
              '#webform_parent_key': 'donation_fieldset',
              '#webform_parent_flexbox': false,
              '#webform_depth': 1,
              '#webform_children': [],
              '#webform_multiple': false,
              '#webform_composite': false,
              '#admin_title': null,
            },
            '#webform_id': 'natuurmonumenten_routeboekje--donation_fieldset',
            '#webform_key': 'donation_fieldset',
            '#webform_parent_key': '',
            '#webform_parent_flexbox': false,
            '#webform_depth': 0,
            '#webform_children': [],
            '#webform_multiple': false,
            '#webform_composite': false,
            '#admin_title': null,
          },
          // {
          //   '#type': 'webform_dateofbirth',
          //   '#title': 'Geboortedatum',
          //   '#webform_id': 'natuurmonumenten_routeboekje--geboortedatum',
          //   '#webform_key': 'geboortedatum',
          //   '#webform_parent_key': '',
          //   '#webform_parent_flexbox': false,
          //   '#webform_depth': 0,
          //   '#webform_children': [ ],
          //   '#webform_multiple': false,
          //   '#webform_composite': true,
          //   '#admin_title': null,
          //   "composite_elements": {
          //     "dob": {
          //       '#type': 'textfield',
          //       '#title': 'Date of Birth',
          //       '#title_display': 'invisible',
          //       '#description': 'dd/mm/yyyy',
          //       '#description_display': 'after',
          //       '#mask': '99/99/9999',
          //       '#alwaysShowMask': true,
          //       '#pattern': '[0-9]{2}/[0-9]{2}/[0-9]{4}',
          //       '#patternError': 'Please enter a date in the dd/mm/yyyy format',
          //     },
          //   },
          // },
          // {
          //   "#type":"webform_dateofbirth",
          //   "#title":"Geboortedatum",
          //   "#webform_id":"natuurmonumenten_routeboekje--geboortedatum",
          //   "#webform_key":"geboortedatum",
          //   "#webform_parent_key":"",
          //   "#webform_parent_flexbox":false,
          //   "#webform_depth":0,
          //   "#webform_children":[],
          //   "#webform_multiple":false,
          //   "#webform_composite":true,
          //   "#admin_title":null,
          //   "composite_elements":{
          //     "dob":{
          //       "#type":"textfield",
          //       "#title":"Date of Birth",
          //       "#description":"dd\/mm\/yyyy",
          //       "#description_display":"after",
          //     },
          //   },
          // },
          {
            '#type': 'fieldset',
            '#title': 'IBAN',
            '#states': {
              visible: {
                ':input[name="steun_de_natuur"]': {
                  value: '1',
                },
              },
            },
            text_field_should_be_replaced_by_iban: {
              '#type': 'textfield',
              '#title': 'Text field should be replaced by IBAN',
              '#required': true,
              '#webform_id': 'natuurmonumenten_routeboekje--text_field_should_be_replaced_by_iban',
              '#webform_key': 'text_field_should_be_replaced_by_iban',
              '#webform_parent_key': 'iban',
              '#webform_parent_flexbox': false,
              '#webform_depth': 1,
              '#webform_children': [],
              '#webform_multiple': false,
              '#webform_composite': false,
              '#admin_title': null,
            },
            '#webform_id': 'natuurmonumenten_routeboekje--iban',
            '#webform_key': 'iban',
            '#webform_parent_key': '',
            '#webform_parent_flexbox': false,
            '#webform_depth': 0,
            '#webform_children': [],
            '#webform_multiple': false,
            '#webform_composite': false,
            '#admin_title': null,
          },
          {
            '#type': 'checkbox',
            '#title': 'Ja, houd mij op de hoogte van nieuws en activiteiten van Natuurmonumenten.',
            '#webform_id': 'natuurmonumenten_routeboekje--ja_houd_mij_op_de_hoogte_van_nieuws_en_activiteiten_van_natuurmo',
            '#webform_key': 'ja_houd_mij_op_de_hoogte_van_nieuws_en_activiteiten_van_natuurmo',
            '#webform_parent_key': '',
            '#webform_parent_flexbox': false,
            '#webform_depth': 0,
            '#webform_children': [],
            '#webform_multiple': false,
            '#webform_composite': false,
            '#admin_title': null,
          },
          {
            '#type': 'checkbox',
            '#title': 'Terms and conditions',
            '#description': 'Ik ga akkoord met de&nbsp;<a href="https://www.natuurmonumenten.nl/sites/default/files/Voorwaarden-Routeboekje-2017_0.pdf" target="_blank" title="voorwaarden">voorwaarden</a>&nbsp;van deze actie. Natuurmonumenten kan mij eenmalig bellen en e-mailen om mij te informeren over het lidmaatschap en haar activiteiten.',
            '#title_display': 'invisible',
            '#description_display': 'after',
            '#webform_id': 'natuurmonumenten_routeboekje--terms_and_conditions',
            '#webform_key': 'terms_and_conditions',
            '#webform_parent_key': '',
            '#webform_parent_flexbox': false,
            '#webform_depth': 0,
            '#webform_children': [],
            '#webform_multiple': false,
            '#webform_composite': false,
            '#admin_title': null,
          },
        ],
        token: '8eW0cn6zaaHXP6wzVHYA6X2E0-vHUC6HuB9cXqsXqdU',
      }}
    />
  ))
  .add('Remote-form', () => (
    <RemoteForm />
  ));
