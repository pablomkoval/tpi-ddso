import './Header.css';
import MenuHeader from './HeaderMenu.jsx';

const Header = (props) => {
  return (
    <header className="header">
        <MenuHeader />
    </header>
  );
};

export default Header;