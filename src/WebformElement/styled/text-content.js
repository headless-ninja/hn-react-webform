import styled from 'styled-components';

export default styled.span`
  ${p => (p.class === 'description-before' || p.class === 'description-after') && `
    display: block;
  `}
  
  ${p => p.class === 'description-before' && `
    margin-bottom: calc(${p.theme.spacingUnit} / 2);
    line-height: 1.5;
  `}
  
  ${p => p.class === 'description-after' && `
    font-size: 0.8em;
    margin-top: 0;
    padding-bottom: calc(${p.theme.spacingUnit} / 2);
    line-height: 1.2em;
    clear: both;
  
    ${p.labelDisplay === 'inline' && `
      @media (min-width: 768px) {
        padding-left: calc(${p.theme.spacingUnit} / 2);
        margin-left: ${p.theme.inlineLabelWidth};
        float: left;
      }
    `}
  `}
  
  /* Prefix & Suffix */
  ${p => (p.value === 'field-prefix' || p.value === 'field-suffix') && `
    display: inline-block;
  `}
  
  ${p => p.value === 'field-prefix' && `
    margin-right: 5px;
  `}
  
  ${p => p.value === 'field-suffix' && `
    margin-left: 5px;
  `}
`;
