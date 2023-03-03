import { AstroTheme } from '../../themes/AstroTheme';

export const sxVideo = {
  position: 'relative',
  border: '1px solid ' + AstroTheme.component.card.cardColorBorder,
  //borderImageSource: 'url(./bezel.png)',
  //borderImageSlice: '30 fill',
  //borderImageOutset: 0,
  overflow: 'hidden',
  //boxShadow: '0px 0px 10px rgba(0,0,0,0.5)',
  backgroundColor: AstroTheme.system.colors.backgroundBaseDefault,
  borderRadius: AstroTheme.reference.radius.base,
  color: AstroTheme.typography.colors.primary,
  // height: 'calc(100% - 36px)',
  width: 'calc(100% - 16px)',
  maxHeight: '200px',
  aspectRatio: '1/1',
};
