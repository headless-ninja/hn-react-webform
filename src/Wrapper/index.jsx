import React from 'react';
import PropTypes from 'prop-types';

const Wrapper = (p) => {
  const props = Object.assign({}, p, p.component.props); // Merge Wrapper props with Wrapper override props.

  const { component } = props; // Copy component property to delete it later.

  delete props.component; // Delete since component isn't a native React prop.

  props.className = `${props.className || ''} ${props['data-extendClassName'] || ''}`; // Concatenate className and data-extendClassName into the new className.
  const Component = React.cloneElement(component, props, props.children); // Clone passed component with merged props and pass children.

  return Component;
};

Wrapper.propTypes = {
  children: PropTypes.node,
  component: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]).isRequired,
};

Wrapper.defaultProps = {
  children: {},
};

export default Wrapper;
