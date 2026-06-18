import './Header.css';
import { getUsernameFromToken } from '../../utils/authUtils';

const Header = () => {
  const username = getUsernameFromToken();
  return (
    <header className="header">
      ¡Hola {username}, bienvenido a Sweet Medical!
    </header>
  );
};

export default Header;