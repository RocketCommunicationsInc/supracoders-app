//import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';
//import component from '@astrouxds/tokens/dist/json-nested/base.component.json';
import system from '@astrouxds/tokens/dist/json-nested/base.system.json';
import reference from '@astrouxds/tokens/dist/json-nested/base.reference.json';
// import light from '@astrouxds/tokens/dist/json-nested/theme.light.json'

export const AstroTheme = {
  palette: {
    type: 'dark',
    background: {
      default: '#101923',
      paper: '#1b2d3e',
    },
    warning: {
      main: system.color.status.caution, // tooltip color / config button on spectrum analyzer (why does this exist twice in this file?)
    },
    info: {
      main: system.color.status.standby,
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
  reference: { ...reference },
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
  component: {
    card: {
      cardColorBorder: 'var(--card-color-border)',
    },
    progress: {
      borderRadius: 'var(--progress-radius-outer)',
    },
    tooltip: {
      tooltipRadius: 'var(--tooltip-radius)',
      tooltipColor: 'var(--tooltip-color-text)',
      tooltipBackgroundColor: 'var(--tooltip-color-background)',
    },
  },
  system: {
    colors: {
      backgroundBaseHeader: 'var(--color-background-base-header)',
      backgroundBaseDefault: 'var(--color-background-base-default)',
      backgroundInteractiveDefault: 'var(--color-background-interactive-default)',
      backgroundInteractiveHover: 'var(--color-background-interactive-hover)',
      backgroundInteractiveMuted: 'var(--color-background-interactive-muted)',
      backgroundSurfaceDefault: 'var(--color-background-surface-default)',
      backgroundSurfaceHover: 'var(--color-background-surface-hover)',
      backgroundSurfaceSelected: 'var(--color-background-surface-selected)',
      borderInteractiveDefault: 'var(--color-border-interactive-default)',
      borderInteractiveHover: 'var(--color-border-interactive-hover)',
      borderInteractiveMuted: 'var(--color-border-interactive-muted)',
      textInteractiveDefault: 'var(--color-text-interactive-default)',
      textInteractiveHover: 'var(--color-text-interactive-hover)',
    },
    shadow: {
      overlay: 'var(--shadow-overlay)',
    },
  },
  components: {
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          // Controls default (unchecked) color for the thumb
          color: 'var(--color-background-surface-default)',
          padding: 0,
          top: 'calc(var(--spacing-2) + 1px)',
          left: 'calc(var(--spacing-2) + 1px)',
          border: '1px solid var(--color-border-interactive-default)',
          '&:hover': {
            border: '1px solid var(--color-border-interactive-hover)',
          },
        },
        colorPrimary: {
          '&.Mui-checked': {
            // Controls checked color for the thumb
            color: 'var(--color-background-surface-default)',
          },
        },
        track: {
          // Controls default (unchecked) color for the track
          border: '1px solid var(--color-border-interactive-default)',
          backgroundColor: 'var(--color-background-surface-default)',
          '.Mui-checked.Mui-checked + &': {
            // Controls checked color for the track
            backgroundColor: 'var(--color-background-interactive-default)',
            opacity: 1,
          },
        },
      },
    },
  },
};

/** Values that do not exist in this file (but should) **/
// color: rgba(0, 0, 0, 0.87)
// color: white;
// color: #fff <--yet another white, why??
// background-color: yellow (IF and PAUSE button on Spetrum Analyzer)
