import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.pcss';
import Input from '../Input';

const Hidden = props => (
  <Input
    {...props}
    type='hidden'
    styleName='hidden'
  />
);

Hidden.meta = {
  wrapper: <div className={styles.hidden} />,
};

export default CSSModules(Hidden, styles);
