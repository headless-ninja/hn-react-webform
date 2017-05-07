import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import Parser from '../Parser';
import styles from './style.pcss';

@CSSModules(styles)
class RuleHint extends Component {
  static propTypes = {
    hint: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]).isRequired,
    tokens: PropTypes.objectOf(PropTypes.node),
    tokenCharacter: PropTypes.node,
  };

  static defaultProps = {
    tokens: {},
    tokenCharacter: ':',
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
    return (
      <li styleName='validation-message'>
        <span>
          {Parser(hint)}
        </span>
      </li>
    );
  }
}

export default RuleHint;
