import { Paper, Box, Typography, Chip, Divider, Stack, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';

const RentalCard = ({
  rental,
  statuses = [],
  onChangeStatus,
  changingId,
  showStatusSelector = false,
  formatDateOnly
}) => (
  <Paper elevation={3} sx={{ p: 3 }}>
    <Stack spacing={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">
          {rental.vehicle.manufacturer?.name} {rental.vehicle.name}
        </Typography>
        <Chip
          label={rental.status}
          color={rental.status === 'AWAITING_CONFIRMATION' ? 'warning' : 'primary'}
        />
      </Box>
      <Divider />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} divider={<Divider orientation="vertical" flexItem />}>
        <Box>
          <Typography>
            <strong>Rental period:</strong> {formatDateOnly(rental.startDate)} — {formatDateOnly(rental.endDate)}
          </Typography>
          <Typography>
            <strong>License plate:</strong> {rental.vehicle.licensePlate}
          </Typography>
        </Box>
        <Box>
          <Typography>
            <strong>Additional services:</strong>{' '}
            {rental.additionalServices && rental.additionalServices.length > 0
              ? rental.additionalServices.map((s) => s.name).join(', ')
              : 'None'}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <Chip
            label={
              <span>
                <strong>Total:&nbsp;</strong>
                <span style={{ fontWeight: 700, color: '#1976d2' }}>${rental.total}</span>
              </span>
            }
            color="primary"
            sx={{ fontSize: 18, height: 32, px: 2, fontWeight: 600 }}
            variant="outlined"
          />
        </Box>
      </Stack>
      {showStatusSelector && (
        <Box display="flex" alignItems="center" gap={2} justifyContent="flex-end">
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Change Status</InputLabel>
            <Select
              label="Change Status"
              defaultValue=""
              onChange={e => {
                if (e.target.value)
                  onChangeStatus(rental.id, e.target.value);
              }}
              value=""
            >
              <MenuItem value="">Select status</MenuItem>
              {statuses
                .filter(s => s.value !== rental.status)
                .map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.title}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          {changingId === rental.id && <CircularProgress size={24} />}
        </Box>
      )}
    </Stack>
  </Paper>
);

export default RentalCard;