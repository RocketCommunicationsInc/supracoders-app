import { AstroTheme } from '../../themes/AstroTheme';

export const sxModalError = {
  position: 'fixed',
  zIndex: '100',
  top: '0%',
  left: '50%',
  transform: 'translate(-50%, 10%)',
  bgcolor: AstroTheme.system.colors.backgroundBaseDefault,
  color: AstroTheme.typography.colors.primary,
  borderTop: `3px solid ${AstroTheme.palette.critical.main}`,
  borderRight: `3px solid ${AstroTheme.palette.critical.main}`,
  borderBottom: `3px solid ${AstroTheme.palette.critical.main}`,
  borderLeft: `11px solid ${AstroTheme.palette.critical.main}`,
  borderRadius: AstroTheme.reference.radius.base,
  padding: 'var(--notification-banner-padding)',
  maxWidth: '50%',
  minWidth: '30%',
  p: 2,
  fontFamily: 'var(--font-heading-5-font-family)',
  fontSize: 'var(--font-heading-5-font-size)',
  fontWeight: 'var(--font-heading-5-font-weight)',
  letterSpacing: 'var(--font-heading-5-letter-spacing)',
  lineHeight: 'var(--font-heading-5-line-height)',
};
