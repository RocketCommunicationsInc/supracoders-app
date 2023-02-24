import { AstroTheme } from '../../../../../../themes/AstroTheme';

export const sxRxModemButton = params => {
  const { isActive } = params;
  return {
    backgroundColor: isActive ? AstroTheme.reference.colors.green500 : "none",
    border: isActive ? '1px solid ' + AstroTheme.reference.colors.green500 : '1px solid ' + AstroTheme.system.colors.backgroundInteractiveDefault,
    color: isActive ? AstroTheme.typography.colors.black : AstroTheme.system.colors.backgroundInteractiveDefault,
    width: '5px',
    margin: '8px',
    outline: 'none',
    '&:hover': {
      backgroundColor: isActive ? AstroTheme.reference.colors.green400 : "none",
      border: isActive ? '1px solid ' + AstroTheme.reference.colors.green400 : '1px solid ' + AstroTheme.system.colors.backgroundInteractiveHover,
      color: isActive ? AstroTheme.typography.colors.black : AstroTheme.system.colors.backgroundInteractiveHover,
    },
  };
};
