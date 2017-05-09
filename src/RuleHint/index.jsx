import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import getNested from 'get-nested';
import Parser from '../Parser';
import styles from './styles.pcss';

@CSSModules(styles)
class RuleHint extends Component {
  static propTypes = {
    hint: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]).isRequired,
    tokens: PropTypes.objectOf(PropTypes.node),
    tokenCharacter: PropTypes.node,
    component: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        props: PropTypes.shape({
          className: PropTypes.string,
        }),
      }),
    ]),
  };

  static defaultProps = {
    tokens: {},
    tokenCharacter: ':',
    component: 'li',
  }

  getHint() {
    const { tokenCharacter, tokens } = this.props;
    let hint = this.props.hint;
    Object.keys(tokens).forEach((token) => {
      hint = hint.replace(new RegExp(`${tokenCharacter}${token}`, 'g'), tokens[token]);
    });

    return hint;
  }

  render() {
    const hint = this.getHint();
    const RuleComponent = this.props.component.type || this.props.component;
    return (
      <RuleComponent styleName='validation-message' className={getNested(() => this.props.component.props.className)}>
        <span>
          {Parser(hint)}
        </span>
      </RuleComponent>
    );
  }
}

export default RuleHint;
