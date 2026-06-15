import React from 'react'
import { HeaderMenuElement } from './HeaderMenuElement.jsx';
import './HeaderMenu.css';

export const HeaderMenu = () => {
  return (
    <>
      <HeaderMenuElement text="Buscar turnos"/>
      <HeaderMenuElement text="Mis turnos"/>
      <HeaderMenuElement text="Notificaciones"/>
    </>
  )
}

export default HeaderMenu;