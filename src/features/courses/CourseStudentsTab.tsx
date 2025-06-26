import React from 'react';
import { Box, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

interface Student {
  id: number;
  name: string;
}

interface CourseStudentsTabProps {
  students: Student[];
  allStudents: Student[];
  search: string;
  setSearch: (s: string) => void;
  filteredToAdd: Student[];
  onRemove: (student: Student) => void;
  onAdd: (student: Student) => void;
  removeDialogOpen: boolean;
  setRemoveDialogOpen: (open: boolean) => void;
  addDialogOpen: boolean;
  setAddDialogOpen: (open: boolean) => void;
  selectedStudent: Student | null;
  confirmRemove: () => void;
  confirmAdd: () => void;
}

const headerStyle = { fontWeight: 700, fontSize: '1rem', mb: 1 };

const listItemSx = {
  transition: 'border-color 0.2s',
  borderLeft: '3px solid transparent',
  '&:hover, &:focus': {
    borderLeft: '3px solid',
    borderLeftColor: 'primary.main',
    backgroundColor: 'transparent',
    outline: 'none',
  },
  borderRadius: 0,
};

const textFieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 0,
    transition: 'border-color 0.2s',
    '&:hover fieldset, &.Mui-focused fieldset': {
      borderColor: 'primary.main',
    },
  },
};

const CourseStudentsTab: React.FC<CourseStudentsTabProps> = ({
  students, allStudents, search, setSearch, filteredToAdd, onRemove, onAdd,
  removeDialogOpen, setRemoveDialogOpen, addDialogOpen, setAddDialogOpen, selectedStudent, confirmRemove, confirmAdd
}) => (
  <Box border={1} borderColor="#e0e0e0" borderRadius={0} p={2}>
    <Typography sx={headerStyle}>Registered Students</Typography>
    <List disablePadding>
      {students.map(s => (
        <ListItem
          key={s.id}
          divider
          disableGutters
          secondaryAction={
            <IconButton edge="end" color="error" size="small" onClick={() => onRemove(s)} sx={{ borderRadius: 0 }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          }
          sx={listItemSx}
          tabIndex={0}
        >
          <ListItemText primary={s.name} />
        </ListItem>
      ))}
    </List>
    <Box mt={2} mb={1} display="flex" alignItems="center" gap={2}>
      <TextField
        size="small"
        variant="outlined"
        placeholder="Search students to add"
        value={search}
        onChange={e => setSearch(e.target.value)}
        InputProps={{ style: { borderRadius: 0 } }}
        sx={textFieldSx}
      />
      <Typography variant="body2" color="text.secondary">
        {filteredToAdd.length} found
      </Typography>
    </Box>
    <List disablePadding>
      {filteredToAdd.map(s => (
        <ListItem
          key={s.id}
          divider
          disableGutters
          secondaryAction={
            <IconButton edge="end" color="primary" size="small" onClick={() => onAdd(s)} sx={{ borderRadius: 0 }}>
              <PersonAddIcon fontSize="small" />
            </IconButton>
          }
          sx={listItemSx}
          tabIndex={0}
        >
          <ListItemText primary={s.name} />
        </ListItem>
      ))}
    </List>
    {/* Remove Confirmation Dialog */}
    <Dialog open={removeDialogOpen} onClose={() => setRemoveDialogOpen(false)}>
      <DialogTitle>Remove Student</DialogTitle>
      <DialogContent>
        Are you sure you want to remove {selectedStudent?.name} from this course?
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setRemoveDialogOpen(false)}>Cancel</Button>
        <Button color="error" onClick={confirmRemove}>Remove</Button>
      </DialogActions>
    </Dialog>
    {/* Add Confirmation Dialog */}
    <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
      <DialogTitle>Add Student</DialogTitle>
      <DialogContent>
        Add {selectedStudent?.name} to this course?
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
        <Button color="primary" onClick={confirmAdd}>Add</Button>
      </DialogActions>
    </Dialog>
  </Box>
);

export default CourseStudentsTab; 