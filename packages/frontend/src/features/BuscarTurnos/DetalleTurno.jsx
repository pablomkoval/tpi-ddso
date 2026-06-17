import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CalendarMonth as CalendarIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  VerifiedUser as VerifiedIcon,
  CreditCard as CreditCardIcon,
  InfoOutlined as InfoIcon,
  CheckCircleOutline as CheckCircleIcon,
  PersonSearch as PersonSearchIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { detalleTurnosData } from '../../mockdata/detalleTurnosData';

export default function DetalleTurno() {
  const { id } = useParams();
  const navigate = useNavigate();

  const turno = detalleTurnosData[id];

  if (!turno) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          No se encontró el turno solicitado.
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={() => navigate('/buscar-turnos')}
        >
          Volver a resultados
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: '80px' }}>
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1100, mx: 'auto' }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/buscar-turnos')}
          sx={{ mb: 3, color: 'text.secondary', pl: 0 }}
        >
          Volver a resultados
        </Button>

        {/* Fila superior: Doctor + Agenda */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '3fr 2fr' },
            gap: 2.5,
            mb: 2.5,
          }}
        >
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start' }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'primary.main',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {turno.iniciales}
                </Avatar>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: 1,
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="h5" fontWeight={700}>
                      {turno.nombre}
                    </Typography>
                    <Chip
                      label="Disponible"
                      color="success"
                      size="small"
                      sx={{ fontWeight: 700, flexShrink: 0 }}
                    />
                  </Box>

                  <Typography variant="body2" color="primary" fontWeight={600} sx={{ mb: 1.5 }}>
                    {turno.especialidad}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, lineHeight: 1.7 }}
                  >
                    {turno.descripcion}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <StarIcon sx={{ color: '#f59e0b', fontSize: 18 }} />
                      <Typography variant="body2" fontWeight={700}>
                        {turno.rating}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ({turno.reseñas} reseñas)
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <VerifiedIcon sx={{ color: 'primary.main', fontSize: 18 }} />
                      <Typography variant="body2">Matrícula {turno.matricula}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ bgcolor: 'primary.dark', color: 'white' }}>
            <CardContent sx={{ p: 3, height: '100%', boxSizing: 'border-box' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                <CalendarIcon sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 20 }} />
                <Typography
                  variant="caption"
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: 0.8,
                  }}
                >
                  Agenda del Turno
                </Typography>
              </Box>

              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                Fecha
              </Typography>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                {turno.fecha}
              </Typography>

              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                Horario
              </Typography>
              <Typography variant="h4" fontWeight={700} sx={{ mb: 2.5 }}>
                {turno.hora}
              </Typography>

              <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mb: 2 }} />

              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
                {turno.notaAgenda}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Fila inferior: Ubicación, Pago, Requisitos */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
            gap: 2.5,
          }}
        >
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 3 }}>
              <SeccionHeader
                icon={<LocationIcon fontSize="small" />}
                label="Ubicación"
                color="primary.main"
              />
              <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
                {turno.sede}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {turno.direccion}
              </Typography>
              <Box
                sx={{
                  height: 120,
                  borderRadius: 2,
                  bgcolor: 'primary.light',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <LocationIcon sx={{ fontSize: 52, color: 'primary.main', opacity: 0.35 }} />
              </Box>
            </CardContent>
          </Card>

          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 3 }}>
              <SeccionHeader
                icon={<CreditCardIcon fontSize="small" />}
                label="Información de Pago"
                color="primary.main"
              />

              <Typography variant="caption" color="text.secondary">
                Cobertura
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1 }}>
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: 1,
                    bgcolor: 'primary.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <VerifiedIcon sx={{ color: 'primary.main', fontSize: 18 }} />
                </Box>
                <Typography variant="body1" fontWeight={700}>
                  {turno.cobertura}
                </Typography>
              </Box>

              <Divider sx={{ my: 1.5 }} />

              <Typography variant="caption" color="text.secondary">
                Costo de la Consulta
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                <Typography variant="h5" fontWeight={700} color="primary">
                  ${turno.precio.toLocaleString('es-AR')}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textDecoration: 'line-through' }}
                >
                  ${turno.precioOriginal.toLocaleString('es-AR')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Por plan
                </Typography>
              </Box>
              <Typography variant="caption" color="primary" sx={{ display: 'block', mt: 0.5 }}>
                {turno.notaPago}
              </Typography>
            </CardContent>
          </Card>

          <Card
            elevation={0}
            sx={{ border: '1px solid', borderColor: '#fed7aa', bgcolor: '#fff8f0' }}
          >
            <CardContent sx={{ p: 3 }}>
              <SeccionHeader
                icon={<InfoIcon fontSize="small" />}
                label="Requisitos"
                color="warning.main"
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {turno.requisitos.map((req, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <CheckCircleIcon
                      sx={{ color: 'warning.main', fontSize: 18, mt: 0.15, flexShrink: 0 }}
                    />
                    <Typography variant="body2">{req}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Barra fija inferior */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
          px: { xs: 2, md: 4 },
          py: 1.5,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          zIndex: 100,
          gap: 1.5,
        }}
      >
        <Button
          variant="outlined"
          startIcon={<PersonSearchIcon />}
          onClick={() => console.log('Agregar a preselección', turno.id)}
        >
          Agregar a preselección
        </Button>
        <Button
          variant="contained"
          onClick={() => console.log('Reservar turno', turno.id)}
        >
          Reservar Turno
        </Button>
      </Box>
    </Box>
  );
}

function SeccionHeader({ icon, label, color }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 2 }}>
      <Box sx={{ color, display: 'flex' }}>{icon}</Box>
      <Typography
        variant="caption"
        sx={{ color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}
      >
        {label}
      </Typography>
    </Box>
  );
}