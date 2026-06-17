import SidebarFilter from "./SidebarFilter.jsx";
import InboxIcon from "@mui/icons-material/Inbox";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import DraftsIcon from "@mui/icons-material/Drafts";

function NotificacionFilter({ filter, setFilter, unreadCount }) {
  const filterOptions = [
    { value: "all", label: "Todas", icon: <InboxIcon fontSize="small" color="action" /> },
    { value: "unread", label: "No leídas", icon: <MailOutlineIcon fontSize="small" color="action" />, count: unreadCount },
    { value: "read", label: "Leídas", icon: <DraftsIcon fontSize="small" color="action" /> },
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