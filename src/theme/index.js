import { createSystem, customConfig, defaultConfig, defineConfig } from '@kfonbss/bss-ui-components';

const appConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        // Navy — #232F50 family (sidebar, header, dark UI — 224 uses)
        secondary: {
          50: { value: '#eaecf2' },
          100: { value: '#d5d9e5' },
          200: { value: '#aab3cb' },
          300: { value: '#808db1' },
          400: { value: '#556797' },
          500: { value: '#232F50' }, // base
          600: { value: '#1c2640' },
          700: { value: '#1a1030' },
          800: { value: '#0f1121' },
          900: { value: '#0b0b28' }
        },

        // Success — #27AE60 / #1B6B3A family (35+ / 41+ uses)
        success: {
          50: { value: '#eaffb' },
          100: { value: '#d9f0e5' },
          200: { value: '#c5e5d3' },
          300: { value: '#5bbf95' },
          400: { value: '#27ae60' },
          500: { value: '#1c8e52' }, // base
          600: { value: '#1b6b3a' },
          700: { value: '#1f8a4d' },
          800: { value: '#0e723b' },
          900: { value: '#173801' }
        },

        // Warning / Gold — #FF8C00 / #EFDD9D / #9A7800 family
        warning: {
          50: { value: '#fffdf6' },
          100: { value: '#fff9e8' },
          200: { value: '#fdf8dc' },
          300: { value: '#efdd9d' },
          400: { value: '#ffd557' },
          500: { value: '#ffde74' }, // base (table header / amber)
          600: { value: '#c58c10' },
          700: { value: '#9a7800' },
          800: { value: '#9b7809' },
          900: { value: '#7a5800' }
        },

        // Error — #C82020 / #DC2626 family
        error: {
          50: { value: '#fff5f5' },
          100: { value: '#fee2e2' },
          200: { value: '#fbb8b8' },
          300: { value: '#f76c7a' },
          400: { value: '#dc2626' },
          500: { value: '#c82020' }, // base
          600: { value: '#d72d2e' },
          700: { value: '#a3362f' },
          800: { value: '#9b1c1c' },
          900: { value: '#73121c' }
        },

        // Info / Teal — #1A98C2 / #1DAAD9 family
        info: {
          50: { value: '#edfcf9' },
          100: { value: '#d6f2f4' },
          200: { value: '#d6f2f4' },
          300: { value: '#2fb8c6' },
          400: { value: '#1daad9' },
          500: { value: '#1a98c2' }, // base
          600: { value: '#1095c5' },
          700: { value: '#02748d' },
          800: { value: '#027f8d' },
          900: { value: '#0c5a63' }
        },

        // Purple — #5E36EF / #4A3D8E family (tickets, badges — 30+ / 19+ uses)
        purple: {
          50: { value: '#f3efff' },
          100: { value: '#e5e0fa' },
          200: { value: '#f5f0ff' },
          300: { value: '#8b7fd6' },
          400: { value: '#5e36ef' }, // base
          500: { value: '#4a3d8e' },
          600: { value: '#5a5070' },
          700: { value: '#3b2e6e' },
          800: { value: '#2b1a26' },
          900: { value: '#1a1030' }
        },

        // Neutral / Gray — consolidate #5F5F5F, #6B7280, #919191, etc.
        neutral: {
          50: { value: '#f8f8f8' },
          100: { value: '#f0f0f0' },
          200: { value: '#e1e1e1' },
          300: { value: '#d7d7d7' },
          400: { value: '#a0a0a0' },
          500: { value: '#919191' },
          600: { value: '#717171' },
          700: { value: '#5f5f5f' },
          800: { value: '#515151' },
          900: { value: '#292929' }
        }
      }
    }
  }
});

export const system = createSystem(defaultConfig, customConfig, appConfig);
