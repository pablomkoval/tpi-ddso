import './Header.css';

const Header = (props) => {
  return (
    <header className="header">
      ¡Hola {props.username}, este es un mensaje de prueba!
    </header>
  );
};

export default Header;