//import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';
// import component from '@astrouxds/tokens/dist/json-nested/base.component.json';
import system from '@astrouxds/tokens/dist/json-nested/base.system.json';
import reference from '@astrouxds/tokens/dist/json-nested/base.reference.json';
// import light from '@astrouxds/tokens/dist/json-nested/theme.light.json'
console.log(reference);

export const AstroTheme = {
  palette: {
    type: 'dark',
    background: {
      default: '#101923',
      paper: '#1b2d3e',
    },
    primary: {
      main: system.color.border.focus.default,
      light: '#2f7aa7',
      light2: '#649cbd',
      light3: '#98bdd3',
      light4: '#cbdee9',
      dark: '#004872',
      dark2: '#003655',
      dark3: '#002439',
      dark4: '#00121c',
    },
    reference: reference,
    tertiary: {
      // main: '#274059', // team / server background color
      main: system['color-background-base-header'],
      // light: '#52667a', // Spectrum Analyzer / Equipment Case Border Color
      light: 'var(--card-color-border)',
      // light2: '#7e8c9b', // Spectrum Analyzer and Equipment Case Background Color
      light2: 'var(--color-background-surface-default)',
      // light3: '#a9b2bc', // ARTGrid background color / 'Space Electronic Warfare' header text color / Loopback Switch Background Color / Input background color / Apply, Power and Tx button on Antenna Controller and Modems
      light3: 'var(--color-background-base-default)',
      light4: '#d4d8dd',
      // dark: '#1f3347', // Top of header background color
      dark: system['color-background-base-header'],
      dark2: '#172635',
      dark3: '#101923',
      dark4: '#080c11',
    },
    error: {
      main: '#ffb302',
    },
    warning: {
      main: '#fce83a', // tooltip color / config button on spectrum analyzer (why does this exist twice in this file?)
      Lighten1: 'rgb(253, 237, 97)',
      Lighten2: 'rgb(253, 241, 137)',
      Lighten3: 'rgb(254, 246, 176)',
      Lighten4: 'rgb(254, 250, 216)',
      Darken1: 'rgb(202, 186, 46)',
      Darken2: 'rgb(151, 139, 35)',
      Darken3: 'rgb(101, 93, 23)',
      Darken4: 'rgb(50, 46, 12)',
    },
    info: {
      main: '#2dccff',
    },
    success: {
      main: system.color.status.normal,
    },
    critical: {
      main: system.color.status.critical,
    },
    serious: {
      main: system.color.status.serious,
    },
    caution: {
      main: system.color.status.caution, // tooltip color / config button on spectrum analyzer (why does this exist twice in this file?)
    },
    normal: {
      main: system.color.status.normal,
    },
    standby: {
      main: system.color.status.standby,
    },
    disabled: {
      main: system.color.status.off, //off
    },
  },
  typography: {
    colors: {
      primary: 'var(--color-text-primary)',
      secondary: 'var(--color-text-secondary)',
      interactive: 'var(--color-text-interactive-default)',
      black: 'var(--color-text-black)',
      inverse: 'var(--color-text-inverse)',
    },
    h1: {
      fontSize: '2.125rem',
      fontWeight: 400,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 400,
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
  },
  reference: {
    radii: {
      radiusBase: 'var(--radius-base)',
    },
    colors: {
      green400: 'var(--color-palette-green-400)',
      green500: 'var(--color-palette-green-500)',
    },
    shadow: {
      boxShadow: 'var(--shadow-overlay)',
    },
    spacing: {
      spacing2: 'var(--spacing-2)',
    },
  },
  system: {
    colors: {
      backgroundBaseHeader: 'var(--color-background-base-header)',
      backgroundInteractiveDefault: 'var(--color-background-interactive-default)',
      backgroundInteractiveHover: 'var(--color-background-interactive-hover)',
      backgroundInteractiveMuted: 'var(--color-background-interactive-muted)',
      backgroundSurfaceDefault: 'var(--color-background-surface-default)',
      backgroundSurfaceHover: 'var(--color-background-surface-hover)',
      backgroundSurfaceSelected: 'var(--color-background-surface-selected)',
      borderInteractiveDefault: 'var(--color-border-interactive-default)',
      borderInteractiveHover: 'var(--color-border-interactive-hover)',
      borderInteractiveMuted: 'var(--color-border-interactive-muted)',
    },
  },
};

/** Values that do not exist in this file (but should) **/
// color: rgba(0, 0, 0, 0.87)
// color: white;
// color: #fff <--yet another white, why??
// background-color: yellow (IF and PAUSE button on Spetrum Analyzer)
