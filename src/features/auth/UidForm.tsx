import React from 'react';
import { Box, Button, TextField } from '@mui/material';

type UidFormProps = {
  uid: string;
  setUid: (uid: string) => void;
  onSubmit: (event: React.FormEvent) => void;
};

const UidForm: React.FC<UidFormProps> = ({ uid, setUid, onSubmit }) => {
  return (
    <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 3, width: '100%' }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="uid"
        label="University ID (UID)"
        name="uid"
        autoComplete="uid"
        autoFocus
        value={uid}
        onChange={(e) => setUid(e.target.value)}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={!uid.trim()}
      >
        Continue
      </Button>
    </Box>
  );
};

export default UidForm; 