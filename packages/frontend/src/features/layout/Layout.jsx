import { Outlet } from "react-router-dom";
import Header from "../../components/headers/Header.jsx";
import Navbar from "../../components/headers/Navbar.jsx";

const Layout = ({ carrito }) => {
    return (
        <>
          <Header/>
          <Navbar/>
          <Outlet />
        </>
    );
};

export default Layout;