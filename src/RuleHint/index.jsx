import React, { Component, PropTypes } from 'react';

class RuleHint extends Component {
  static propTypes = {
    hint: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]).isRequired,
    tokens: PropTypes.objectOf(PropTypes.node),
  };

  static defaultProps = {
    tokens: {},
  }

  getHint() {
    const tokens = this.props.tokens;
    let hint = this.props.hint;
    Object.keys(tokens).forEach((token) => {
      hint = hint.replace(new RegExp(`:${token}`, 'g'), tokens[token]);
    });

    return hint;
  }

  render() {
    const hint = this.getHint();
    return (
      <li>
        <span>
          {hint}
        </span>
      </li>
    );
  }
}

export default RuleHint;
