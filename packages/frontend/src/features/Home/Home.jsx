import { Box } from '@mui/material';
import TurnosResults from './TurnosResults.jsx';

const Home = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100%' }}>
      {/* Panel de filtros — componente del compañero */}
      <Box sx={{ width: 280, borderRight: '1px solid', borderColor: 'divider', flexShrink: 0 }} />

      <TurnosResults />
    </Box>
  );
};

export default Home;