import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#005eb8',
            light: '#f0f7ff',
            dark: '#004a91'
        },

        secondary: {
            main: '#00a6a6'
        },

        background: {
            default: '#f9f9ff',
            paper: '#ffffff'
        },

        text: {
            primary: '#1b1b1f',
            secondary: '#5e5e62'
        }
    },

    shape: {
        borderRadius: 12
    },

    typography: {
        fontFamily: [
            'Inter',
            'sans-serif'
        ].join(','),

        h4: {
            fontWeight: 700
        },

        h5: {
            fontWeight: 700
        },

        button: {
            fontWeight: 700,
            textTransform: 'none'
        },

        navLink: {
            fontSize: '0.875rem',
            fontWeight: 400,
            lineHeight: 1.5,
        }
    },

    components: {

        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    padding: '12px 24px'
                },

                containedPrimary: {
                    boxShadow:
                        '0 10px 25px rgba(0, 94, 184, 0.15)'
                }
            }
        },

        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
                fullWidth: true
            }
        },

        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16
                }
            }
        }
    }
});

export default theme;