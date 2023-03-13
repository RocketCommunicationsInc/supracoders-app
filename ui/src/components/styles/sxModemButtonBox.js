import { AstroTheme } from '../../themes/AstroTheme';

export const sxModemButtonBox = {
  backgroundColor: AstroTheme.system.colors.backgroundBaseDefault,
  border: '1px solid ' + AstroTheme.component.card.cardColorBorder,
  marginTop: '-1px',
  marginBottom: '-1px',
  paddingLeft: AstroTheme.reference.spacing[2],
  paddingRight: AstroTheme.reference.spacing[2],
  height: '100%',
  display: 'flex',
  width: 'fit-content',
  flexDirection: 'column',
  justifyContent: 'space-around',
};
