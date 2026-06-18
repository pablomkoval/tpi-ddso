import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  InputAdornment,
  Divider,
} from '@mui/material';
import {
  PersonOutlined as PersonIcon,
  MedicalServicesOutlined as EspecialidadIcon,
  ApartmentOutlined as ConsultorioIcon,
  LocationOnOutlined as UbicacionIcon,
  CalendarMonthOutlined as CalendarIcon,
} from '@mui/icons-material';

const ESPECIALIDADES = [
  'Cardiología',
  'Dermatología',
  'Neurología',
  'Traumatología',
  'Laboratorio',
  'Ecografía',
];

const CONSULTORIOS = ['Clínica Médica', 'Cirugía', 'Diagnóstico por imagen'];

const SEDES = ['Sede Palermo', 'Sede Belgrano', 'Sede Centro'];

export default function FiltrosBusqueda({ filtros, onChange, onAplicar }) {
  const handleSede = (sede) => {
    const actuales = filtros.sedes;
    const nuevas = actuales.includes(sede)
      ? actuales.filter((s) => s !== sede)
      : [...actuales, sede];
    onChange('sedes', nuevas);
  };

  return (
    <Box
      component="aside"
      sx={{
        width: 260,
        flexShrink: 0,
        borderRight: '1px solid',
        borderColor: 'divider',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
      }}
    >
      <Box>
        <Typography variant="h6" color="primary" fontWeight={700}>
          Filtros de Búsqueda
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Refine sus resultados
        </Typography>
      </Box>

      <Divider />

      <SeccionFiltro icon={<PersonIcon fontSize="small" />} label="Profesional">
        <TextField
          size="small"
          placeholder="Nombre del médico..."
          value={filtros.profesional}
          onChange={(e) => onChange('profesional', e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon fontSize="small" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </SeccionFiltro>

      <SeccionFiltro icon={<EspecialidadIcon fontSize="small" />} label="Especialidad">
        <FormControl size="small" fullWidth>
          <Select
            value={filtros.especialidad}
            onChange={(e) => onChange('especialidad', e.target.value)}
            displayEmpty
          >
            <MenuItem value="">Todas las especialidades</MenuItem>
            {ESPECIALIDADES.map((e) => (
              <MenuItem key={e} value={e}>{e}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </SeccionFiltro>

      <SeccionFiltro icon={<ConsultorioIcon fontSize="small" />} label="Consultorio">
        <FormControl size="small" fullWidth>
          <Select
            value={filtros.consultorio}
            onChange={(e) => onChange('consultorio', e.target.value)}
            displayEmpty
          >
            <MenuItem value="">Cualquier práctica</MenuItem>
            {CONSULTORIOS.map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </SeccionFiltro>

      <SeccionFiltro icon={<UbicacionIcon fontSize="small" />} label="Ubicación">
        <FormGroup>
          {SEDES.map((sede) => (
            <FormControlLabel
              key={sede}
              label={<Typography variant="body2">{sede}</Typography>}
              control={
                <Checkbox
                  size="small"
                  checked={filtros.sedes.includes(sede)}
                  onChange={() => handleSede(sede)}
                />
              }
              sx={{ ml: 0 }}
            />
          ))}
        </FormGroup>
      </SeccionFiltro>

      <SeccionFiltro icon={<CalendarIcon fontSize="small" />} label="Fecha">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <TextField
            size="small"
            type="date"
            value={filtros.fechaDesde}
            onChange={(e) => onChange('fechaDesde', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            size="small"
            type="date"
            value={filtros.fechaHasta}
            onChange={(e) => onChange('fechaHasta', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      </SeccionFiltro>

      <Button variant="contained" fullWidth onClick={onAplicar} sx={{ mt: 'auto' }}>
        Aplicar Filtros
      </Button>
    </Box>
  );
}

function SeccionFiltro({ icon, label, children }) {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
        <Box sx={{ color: 'text.secondary', display: 'flex' }}>{icon}</Box>
        <Typography variant="body2" fontWeight={700}>
          {label}
        </Typography>
      </Box>
      {children}
    </Box>
  );
}