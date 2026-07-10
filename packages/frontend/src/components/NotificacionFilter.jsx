import SidebarFilter from "./SidebarFilter.jsx";
import InboxIcon from "@mui/icons-material/Inbox";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import DraftsIcon from "@mui/icons-material/Drafts";

function NotificacionFilter({ filter, setFilter, resumen }) {

  const filterOptions = [
    { 
      value: "all", 
      label: "Todas", 
      icon: <InboxIcon fontSize="small" color="action" />,
      count: resumen.total
    },
    { 
      value: "unread", 
      label: "No leídas", 
      icon: <MailOutlineIcon fontSize="small" color="action" />,
      count: resumen.noLeidas
    },
    { 
      value: "read", 
      label: "Leídas", 
      icon: <DraftsIcon fontSize="small" color="action" />,
      count: resumen.leidas
    },
  ];

  return (
    <SidebarFilter
      title="Filtros"
      options={filterOptions}
      activeValue={filter}
      onChange={setFilter}
    />
  );
}

export default NotificacionFilter;