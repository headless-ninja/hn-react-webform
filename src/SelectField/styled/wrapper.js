import styled from 'styled-components';

export default styled.div`
  position: relative;
  width: calc(${p => p.theme.inputWidth} + 20px);
  padding-right: 20px;

  @media (min-width: 768px) {
    width: calc(${p => p.theme.inlineLabelWidth} + ${p => p.theme.inputWidth} + 20px);
  }

  ${p => p.labelDisplay === 'inline' && `
    width: calc(${p.theme.inputWidth} + 20px);
    padding-right: 20px;

    @media (min-width: 768px) {
      display: inline-block;
    }

    & :global .Select-placeholder,
    & :global .Select--single > .Select-control .Select-value {
      max-width: calc(${p.theme.inputWidth} - 25px);
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
