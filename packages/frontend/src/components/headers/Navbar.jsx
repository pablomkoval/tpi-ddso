import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import './Navbar.css';
import '../../index.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [cantUnidades, setCantUnidades] = useState(0);
  //const carrito;

  const irACheckout = () => {
    navigate('/checkout');
  };

 /*  const cantUnidadesEnCarrito = () => {
    let suma = 0;
    for (const producto of carrito) {
      suma += producto.unidades;
    }
    return suma;
  }; */

  /* useEffect(() => {
    setCantUnidades(cantUnidadesEnCarrito());
  }, [carrito]); */

  return (
    <header className="navbar-bg">
      <nav className="navbar">
        <div className="navbar-section left">
          <button className="menu-icon">☰</button>
        </div>

        <div className="navbar-section center">
          <div className="brand">
            <Link to={`/`} className="link-no-style"><h1 className="brand-text"> SweetMedical.com </h1></Link>
          </div>
        </div>

        <div className="navbar-section right">
          <button className="cart" onClick={irACheckout}>
            <FaShoppingCart color="white" />{/* 
            <span className="cart-count">{cantUnidades}</span> */}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;