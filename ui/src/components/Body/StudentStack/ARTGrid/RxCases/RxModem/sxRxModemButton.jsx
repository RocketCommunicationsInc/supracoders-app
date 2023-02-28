import { AstroTheme } from '../../../../../../themes/AstroTheme';

export const sxRxModemButton = params => {
  const { isActive } = params;
  return {
    backgroundColor: "none",
    border: '1px solid ' + AstroTheme.system.colors.backgroundInteractiveDefault,
    color: AstroTheme.system.colors.backgroundInteractiveDefault,
    outline: isActive && 'var(--border-width-focus-default) solid var(--color-border-focus-default)',
    outlineOffset: isActive && 'var(--spacing-focus-default)',
    width: 'fit-content',
    minWidth: 'var(--spacing-12)',
    margin: AstroTheme.reference.spacing[2],
    '&:hover': {
      backgroundColor: "none",
      border: '1px solid ' + AstroTheme.system.colors.backgroundInteractiveHover,
      color: AstroTheme.system.colors.backgroundInteractiveHover,
    },
  };
};
