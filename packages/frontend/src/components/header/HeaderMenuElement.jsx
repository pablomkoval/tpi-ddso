import { Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const HeaderMenuElement = ({ text, to }) => {
  const { pathname } = useLocation();
  const isActive = pathname === to;

  return (
    <Typography
      component={Link}
      to={to}
      variant="navLink"
      sx={{
        px: 1.5, py: 2,
        textDecoration: 'none',
        color: isActive ? 'primary.main' : 'text.primary',
        fontWeight: isActive ? 600 : undefined,
        borderBottom: '2px solid',
        borderColor: isActive ? 'primary.main' : 'transparent',
        whiteSpace: 'nowrap',
        '&:hover': { color: 'primary.main' },
      }}
    >
      {text}
    </Typography>
  );
};

export default HeaderMenuElement;
