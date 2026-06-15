import { dark } from '@mui/material/styles/createPalette'
import React from 'react'

export const HeaderMenuElement = ({ text }) => {
  return (
    <a sx={{ color: 'palette.primary.main' }}>{text}</a>
  )
}

export default HeaderMenuElement;
