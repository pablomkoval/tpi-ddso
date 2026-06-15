import { Outlet } from "react-router-dom";
import Header from "../../components/headers/header/Header.jsx";
import Navbar from "../../components/headers/Navbar.jsx";

const Layout = ({ carrito }) => {
    return (
        <>
          <Header username="Redondito de ricota"></Header>
          <Outlet />
        </>
    );
};

export default Layout;