import React from 'react';

class RuleHint extends React.Component {
  static propTypes = {
    hint: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.element,
    ]).isRequired,
    tokens: React.PropTypes.objectOf(React.PropTypes.node),
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
