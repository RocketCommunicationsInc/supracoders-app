import { AstroTheme } from '../../../../../../themes/AstroTheme';

export const sxRxModemButton = params => {
  const { isActive } = params;
  return {
    backgroundColor: isActive ? AstroTheme.palette.primary.dark : AstroTheme.palette.primary.light2,
    border: '2px solid ' + AstroTheme.typography.colors.black,
    color: isActive ? 'white' : 'black',
    width: '5px',
    margin: '8px',
    outline: 'none',
    '&:hover': {
      backgroundColor: isActive ? AstroTheme.typography.colors.black : AstroTheme.palette.primary.light,
    },
  };
};
