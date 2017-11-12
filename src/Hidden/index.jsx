import React from 'react';
// styled
import StyledHidden from './styled/hidden';

const Hidden = props => (
  <StyledHidden
    {...props}
    type='hidden'
  />
);

Hidden.meta = {
  wrapper: 'div',
  wrapperProps: { style: { display: 'none' } },
};

export default Hidden;
