import { AstroTheme } from '../../themes/AstroTheme';

export const sxValues = {
  fontWeight: 'bold',
  textAlign: 'center',
  color: AstroTheme.typography.colors.secondary,
};
export const sxValuesGrid = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  backgroundColor: AstroTheme.system.colors.backgroundBaseDefault,
  border: '1px solid ' + AstroTheme.component.card.cardColorBorder,
  borderRadius: '5px',
};
