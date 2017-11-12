import styled from 'styled-components';

export default styled.div`
  position: relative;
  width: calc(${p => p.theme.inputWidth} + 20px);
  padding-right: 20px;

  @media (min-width: 768px) {
    width: calc(${p => p.theme.inputWidth} * 1.3);
  }

  ${p => p.labelDisplay === 'inline' && `
    width: calc(${p.theme.inputWidth} + 20px);
    padding-right: 20px;

    @media (min-width: 768px) {
      display: inline-block;
    }

    & .Select-placeholder,
    & .Select--single > .Select-control .Select-value {
      max-width: calc(${p.theme.inputWidth} - 25px);
      overflow: hidden;
    }
  `}
  
  ${p => p.labelDisplay === 'before' && `
    & .Select-placeholder,
    & .Select--single > .Select-control .Select-value {
      max-width: calc(100% - 25px);
      white-space: normal; /* since we're working with percentual width, we need the line to wrap */
    }

    & .Select--single > .Select-control .Select-value {
      height: calc((${p.theme.spacingUnit} / 2) + ${p.theme.inputLineHeight});
      overflow: hidden;
    }
  `}

  ${p => !p.success && `
    & .Select-control {
      border-color: ${p.theme.errorColor};
      background-color: ${p.theme.errorBgColor};
    }

    & .Select-menu-outer {
      border-bottom-color: ${p.theme.errorColor};
      border-left-color: ${p.theme.errorColor};
      border-right-color: ${p.theme.errorColor};
    }

    & .Select-placeholder {
      color: ${p.theme.errorColor};
    }
  `}
`;
