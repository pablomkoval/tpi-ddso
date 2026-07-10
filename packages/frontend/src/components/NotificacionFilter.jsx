import { Tabs, Tab, Badge } from "@mui/material";

function NotificacionFilter({ filter, setFilter, resumen }) {
  return (
    <Tabs
      value={filter}
      onChange={(_, value) => setFilter(value)}
      variant="scrollable"
      scrollButtons="auto"
      sx={{
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Tab
        value="all"
        label="Todas"
      />

      <Tab
        value="unread"
        label={
          <Badge
            badgeContent={resumen.noLeidas}
            color="error"
            invisible={resumen.noLeidas === 0}
          >
            No leídas
          </Badge>
        }
      />

      <Tab
        value="read"
        label="Leídas"
      />
    </Tabs>
  );
}

export default NotificacionFilter;