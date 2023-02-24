import { AstroTheme } from '../../themes/AstroTheme';

export const sxEquipmentCase = {
  flexGrow: 1,
  margin: 'auto',
  borderRadius: AstroTheme.reference.radii.radiusBase,
  boxShadow: AstroTheme.reference.shadow.boxShadow,
  backgroundColor: AstroTheme.system.colors.backgroundSurfaceDefault,
  color: AstroTheme.typography.colors.primary,
  border: '1px solid ' + AstroTheme.component.card.cardColorBorder,
};
