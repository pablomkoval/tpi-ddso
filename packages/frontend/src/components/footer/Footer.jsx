import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const footerLinks = [
  { text: 'Términos y Condiciones', to: '/terminos' },
  { text: 'Privacidad', to: '/privacidad' },
  { text: 'Ayuda', to: '/ayuda' },
];

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        py: 2,
        px: 4,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: { xs: 2, sm: 0 },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 1.5, textAlign: { xs: 'center', sm: 'left' } }}>
        <Typography variant="body2" fontWeight={700} color="primary">
          Sweet Medical
        </Typography>
        <Typography variant="body2" color="text.secondary">
          © 2026 Sweet Medical. Todos los derechos reservados.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
        {footerLinks.map(({ text, to }) => (
          <Typography
            key={to}
            component={Link}
            to={to}
            variant="body2"
            sx={{
              textDecoration: 'none',
              color: 'text.secondary',
              '&:hover': { color: 'primary.main' },
            }}
          >
            {text}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default Footer;