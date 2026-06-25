import { Box, Skeleton } from '@mui/material';

export const CustomSkeleton = ({ type = 'list', count = 3 }) => {
  const items = Array.from({ length: count });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
      {items.map((_, i) => (
        <Box key={i} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
          {type === 'list' && (
            <>
              <Skeleton variant="text" width="40%" height={30} />
              <Skeleton variant="text" width="25%" />
              <Skeleton variant="rectangular" height={40} sx={{ mt: 2, borderRadius: 1 }} />
            </>
          )}
          
          {type === 'detail' && (
            <>
              <Skeleton variant="circular" width={60} height={60} />
              <Skeleton variant="text" width="80%" height={40} sx={{ mt: 2 }} />
              <Skeleton variant="rectangular" height={200} sx={{ mt: 2, borderRadius: 2 }} />
            </>
          )}
          
          {type === 'table' && (
            <Skeleton variant="rectangular" height={50} sx={{ borderRadius: 1, my: 0.5 }} />
          )}
        </Box>
      ))}
    </Box>
  );
};