import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import Parser, { template } from '../Parser';
import FormStore from '../Observables/Form';
// styled
import ValidationMessage from './styled/validation-message';

@inject('formStore')
class RuleHint extends Component {
  static propTypes = {
    hint: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]).isRequired,
    tokens: PropTypes.objectOf(PropTypes.node),
    component: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        props: PropTypes.shape({
          className: PropTypes.string,
        }),
      }),
    ]),
    formStore: PropTypes.instanceOf(FormStore).isRequired,
  };

  static defaultProps = {
    tokens: {},
    tokenCharacter: ':',
    component: 'li',
  }

  getHint() {
    const { tokens } = this.props;
    let hint = this.props.hint;
    Object.keys(tokens).forEach((token) => {
      hint = hint.replace(new RegExp(`{{${token}}}`, 'g'), tokens[token]);
    });

    return hint;
  }

  render() {
    const hint = this.getHint();
    const RuleComponent = ValidationMessage.withComponent(this.props.component.type || this.props.component);
    return (
      <RuleComponent className='hrw-validation-message'>
        <span>
          {Parser(template(this.props.formStore, hint))}
        </span>
      </RuleComponent>
    );
  }
}

export default RuleHint;
