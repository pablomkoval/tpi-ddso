import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Button,
  InputAdornment,
  Divider,
  Autocomplete
} from '@mui/material';

import {
  PersonOutlined as PersonIcon,
  MedicalServicesOutlined as EspecialidadIcon,
  LocationOnOutlined as UbicacionIcon,
  CalendarMonthOutlined as CalendarIcon,
  SortOutlined as SortIcon,
} from '@mui/icons-material';

import {
  buscarEspecialidades,
  buscarMedicos,
  buscarSedes
} from '../../services/filtrosBusquedaService';

export default function FiltrosBusqueda({ filtros, onChange, onAplicar }) {
  const [loading, setLoading] = useState(true);
  const [errorApi, setErrorApi] = useState(false);
  const [medicos, setMedicos] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [cargandoMedicos, setCargandoMedicos] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      setErrorApi(false);
      
      try {
        const especialidadesResponse = await buscarEspecialidades();
        setEspecialidades(especialidadesResponse);
        const sedesResponse = await buscarSedes();
        setSedes(sedesResponse);
      } catch (e) {
        setEspecialidades([]);
        setSedes([]);
        setMedicos([]);
        setErrorApi(true);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  useEffect(() => {
    const especialidadSeleccionada = filtros?.especialidad;

    if (!especialidadSeleccionada) {
      setMedicos([]);
      setCargandoMedicos(false);
      return;
    }

    let ignore = false;

    const cargarMedicos = async () => {
      setMedicos([]);
      setCargandoMedicos(true);
      try {
        const medicosResponse = await buscarMedicos(especialidadSeleccionada);
        if (!ignore) {
          setMedicos(medicosResponse);
        }
      } catch (e) {
        if (!ignore) {
          setMedicos([]);
        }
      } finally {
        if (!ignore) {
          setCargandoMedicos(false);
        }
      }
    };

    cargarMedicos();

    return () => {
      ignore = true;
    };
  }, [filtros?.especialidad]);

 
  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Cargando filtros...</Typography>
      </Box>
    );
  }

  if (errorApi) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">
          Error al cargar filtros
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      component="aside"
      sx={{
        width: 260,
        flexShrink: 0,
        borderRight: { xs: 'none', md: '1px solid' },
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

      {/* SERVICIO */}
      <SeccionFiltro icon={<EspecialidadIcon fontSize="small" />} label="Servicio">
        <FormControl size="small" fullWidth>
          <Select
            value={filtros.especialidad}
            onChange={(e) => {
              onChange('especialidad', e.target.value);
              onChange('profesional', '');
            }}
            displayEmpty
            renderValue={(selected) => {
              if (!selected) {
                return 'Seleccionar Servicio';
              }
              const especialidadSeleccionada = especialidades.find((e) => e.id === selected);
              return especialidadSeleccionada?.nombre || 'Seleccionar Servicio';
            }}
          >
            {especialidades.map((e) => (
              <MenuItem key={e.id} value={e.id}>
                {e.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </SeccionFiltro>



      {/* PROFESIONAL */}
      <SeccionFiltro icon={<PersonIcon fontSize="small" />} label="Profesional">

        <Autocomplete
          size="small"
          fullWidth
          disabled={!filtros?.especialidad}
          options={medicos}
          loading={cargandoMedicos}
          noOptionsText={filtros?.especialidad ? 'No hay médicos para esta especialidad' : 'Seleccione una especialidad primero'}
          getOptionLabel={(option) => option?.nombre || ''}
          value={medicos.find((m) => m.id === filtros?.profesional) || null}
          onChange={(event, nuevoMedico) => {
            const idMedico = nuevoMedico ? nuevoMedico.id : '';
            onChange('profesional', idMedico);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={filtros?.especialidad ? 'Nombre del médico...' : 'Seleccione Especialidad'}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <>
                    <InputAdornment position="start">
                      <PersonIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                    {params.InputProps.startAdornment}
                  </>
                ),
              }}
            />
          )}
        />
        {/* <TextField
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
        /> */}
      </SeccionFiltro>

      
      {/* SEDE */}
      <SeccionFiltro icon={<UbicacionIcon fontSize="small" />} label="Ubicación">
        <FormControl size="small" fullWidth>
          <Select
            value={filtros.sede}
            onChange={(e) => onChange('sede', e.target.value)}
            displayEmpty
          >
            <MenuItem value="">Todas las sedes</MenuItem>
            {sedes.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </SeccionFiltro>

      {/* FECHA */}
      <SeccionFiltro icon={<CalendarIcon fontSize="small" />} label="Fecha">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Desde:
          </Typography>
          <TextField
            size="small"
            type="date"
            value={filtros.fechaDesde}
            onChange={(e) => onChange('fechaDesde', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <Typography variant="body2" color="text.secondary">
            Hasta:
          </Typography>
          <TextField
            size="small"
            type="date"
            value={filtros.fechaHasta}
            onChange={(e) => onChange('fechaHasta', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      </SeccionFiltro>

      {/* ORDENAMIENTO */}
      <SeccionFiltro icon={<SortIcon fontSize="small" />} label="Ordenamiento">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <FormControl size="small" fullWidth>
            <Select
              value={filtros.sortBy}
              onChange={(e) => onChange('sortBy', e.target.value)}
              displayEmpty
            >
              <MenuItem value="">Sin asignar orden</MenuItem>
              <MenuItem value="fechaHora">Fecha y Hora</MenuItem>
              <MenuItem value="costo">Costo del Turno</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth disabled={!filtros.sortBy}>
            <Select
              value={filtros.sortOrder}
              onChange={(e) => onChange('sortOrder', e.target.value)}
              displayEmpty
            >
              <MenuItem value="">Dirección...</MenuItem>
              <MenuItem value="1">Ascendente (Menor a Mayor)</MenuItem>
              <MenuItem value="-1">Descendente (Mayor a Menor)</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </SeccionFiltro>

      <Button variant="contained" fullWidth onClick={onAplicar} sx={{ mt: '2' }}>
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

