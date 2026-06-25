import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  const agregarTurno = (turno) => {
    setCarrito((prev) => {
      const existe = prev.find((t) => t.id === turno.id);

      if (existe) return prev;

      return [...prev, turno];
    });
  };

  const eliminarTurno = (id) => {
    setCarrito((prev) =>
      prev.filter((turno) => turno.id !== id)
    );
  };

  const limpiarCarrito = () => {
    setCarrito([]);
  };

  return (
    <CartContext.Provider value={{ carrito, agregarTurno, eliminarTurno, limpiarCarrito }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);