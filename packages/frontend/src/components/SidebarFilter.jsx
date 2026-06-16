import { Box, List, ListItemButton, Typography, Badge } from "@mui/material";

function SidebarFilter({ title, subtitle, options, activeValue, onChange }) {
  return (
    <Box
      component="aside"
      sx={{
        width: { xs: "100%", md: "280px" },
        padding: { xs: 2, md: "24px 16px" },
        backgroundColor: "transparent",
        borderRight: { xs: "none", md: "1px solid" },
        borderBottom: { xs: "1px solid", md: "none" },
        borderColor: "divider", 
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" color="primary" fontWeight="bold">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>

      <List
        sx={{
          display: "flex",
          flexDirection: { xs: "row", md: "column" },
          gap: 1,
          overflowX: { xs: "auto", md: "visible" },
          pb: { xs: 1, md: 0 },
          p: 0,
        }}
      >
        {options.map((option) => {
          const isActive = activeValue === option.value;

          return (
            <ListItemButton
              key={option.value}
              onClick={() => onChange(option.value)}
              selected={isActive}
              sx={{
                borderRadius: "8px",
                display: "flex",
                justifyContent: { xs: "center", md: "space-between" },
                alignItems: "center",
                px: 2,
                py: 1.25,
                transition: "all 0.2s ease-in-out",
                whiteSpace: { xs: "nowrap", md: "normal" },
                "&.Mui-selected": {
                  backgroundColor: "primary.light",
                  "&:hover": {
                    backgroundColor: "primary.light",
                  },
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                {option.icon && (
                  <Box
                    component="span"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: isActive ? "primary.main" : "action.active",
                    }}
                  >
                    {option.icon}
                  </Box>
                )}
                <Typography
                  variant="body2"
                  fontWeight={isActive ? "bold" : "regular"}
                  color={isActive ? "primary.main" : "text.primary"}
                >
                  {option.label}
                </Typography>
              </Box>

              {option.count > 0 && !isActive && (
                <Badge
                  badgeContent={option.count}
                  color="error"
                  sx={{ ml: { xs: 1.5, md: 0 } }} 
                />
              )}
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}

export default SidebarFilter;