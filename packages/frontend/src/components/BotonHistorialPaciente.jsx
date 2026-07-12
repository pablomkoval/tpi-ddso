import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import HistoryIcon from '@mui/icons-material/History';

const BotonHistorialPaciente = ({ pacienteId }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/historial-paciente/${pacienteId}`);
    };

    return (
        <Button size="small" startIcon={<HistoryIcon />} variant="text" color="primary" onClick={handleClick} sx={{ fontWeight: 600, textTransform: 'none' }}>
            Ver Historial Clínico
        </Button>
    );
};

export default BotonHistorialPaciente;