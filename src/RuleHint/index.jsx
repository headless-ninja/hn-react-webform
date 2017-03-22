import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.pcss';

@CSSModules(styles)
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
      <li styleName='error'>
        <span>
          {hint}
        </span>
      </li>
    );
  }
}

export default RuleHint;
