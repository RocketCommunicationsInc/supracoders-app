import { AstroTheme } from '../../themes/AstroTheme';

export const sxModal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: AstroTheme.system.colors.backgroundBaseHeader,
  color: AstroTheme.typography.colors.black,
  border: `1px solid ${AstroTheme.palette.tertiary.light}`,
  borderRadius: AstroTheme.reference.radii.borderRadius,
  //boxShadow: 24,
  p: 4,
};
