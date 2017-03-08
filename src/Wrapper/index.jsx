import React from 'react';

const Wrapper = (p) => {
  const props = Object.assign({}, p);
  const { children, component} = props;
  delete props.children;
  delete props.component;

  return React.createElement(component, props, children);
};

Wrapper.propTypes = {
  children: React.PropTypes.node,
  component: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.element,
  ]).isRequired,
};

Wrapper.defaultProps = {
  children: {},
};

export default Wrapper;
