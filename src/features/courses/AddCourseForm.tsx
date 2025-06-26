import React, { useState } from 'react';
import {
  Box, Button, Stepper, Step, StepLabel, TextField, Typography, MenuItem
} from '@mui/material';

const steps = ['Basic Info', 'Description & Preamble', 'Offerings'];

const initialState = {
  name: '',
  code: '',
  description: '',
  preamble: '',
  term: '',
  type: '',
  sws: '',
};

const courseTypes = [
  { value: 'SE', label: 'Seminar' },
  { value: 'LE', label: 'Lecture' },
  { value: 'E', label: 'Exercise' },
];

const AddCourseForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState<any>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs: any = {};
    if (activeStep === 0) {
      if (!form.name) errs.name = 'Course name is required';
      if (!form.code) errs.code = 'Course code is required';
      else if (!/^\d{2}\.\d{5}$/.test(form.code)) errs.code = 'Format: 12.00086';
    }
    if (activeStep === 1) {
      if (!form.description) errs.description = 'Description is required';
      if (!form.preamble) errs.preamble = 'Preamble is required';
    }
    if (activeStep === 2) {
      if (!form.term) errs.term = 'Term is required';
      if (!form.type) errs.type = 'Type is required';
      if (!form.sws) errs.sws = 'SWS is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validate()) setActiveStep((s) => s + 1);
  };
  const handleBack = () => setActiveStep((s) => s - 1);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = () => {
    if (validate()) {
      setSubmitted(true);
      setTimeout(onClose, 1200);
    }
  };

  return (
    <Box p={3} bgcolor="#fff" borderRadius={2} boxShadow={3} minWidth={350} maxWidth={420}>
      <Typography variant="h6" mb={2}>Add New Course</Typography>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>
      {submitted ? (
        <Typography color="success.main" align="center" mb={2}>Course created (mock)!</Typography>
      ) : (
        <form>
          {activeStep === 0 && (
            <>
              <TextField
                label="Course Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Course Code"
                name="code"
                value={form.code}
                onChange={handleChange}
                error={!!errors.code}
                helperText={errors.code || 'Format: 12.00086'}
                fullWidth
                margin="normal"
              />
            </>
          )}
          {activeStep === 1 && (
            <>
              <TextField
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description}
                fullWidth
                margin="normal"
                multiline
                minRows={2}
              />
              <TextField
                label="Preamble"
                name="preamble"
                value={form.preamble}
                onChange={handleChange}
                error={!!errors.preamble}
                helperText={errors.preamble}
                fullWidth
                margin="normal"
                multiline
                minRows={2}
              />
            </>
          )}
          {activeStep === 2 && (
            <>
              <TextField
                label="Term"
                name="term"
                value={form.term}
                onChange={handleChange}
                error={!!errors.term}
                helperText={errors.term}
                fullWidth
                margin="normal"
              />
              <TextField
                select
                label="Type"
                name="type"
                value={form.type}
                onChange={handleSelect}
                error={!!errors.type}
                helperText={errors.type}
                fullWidth
                margin="normal"
              >
                {courseTypes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="SWS"
                name="sws"
                value={form.sws}
                onChange={handleChange}
                error={!!errors.sws}
                helperText={errors.sws}
                fullWidth
                margin="normal"
                type="number"
              />
            </>
          )}
        </form>
      )}
      <Box mt={3} display="flex" justifyContent="space-between">
        <Button onClick={onClose}>Cancel</Button>
        {activeStep > 0 && !submitted && <Button onClick={handleBack}>Back</Button>}
        {activeStep < steps.length - 1 && !submitted && <Button variant="contained" onClick={handleNext}>Next</Button>}
        {activeStep === steps.length - 1 && !submitted && <Button variant="contained" onClick={handleSubmit}>Submit</Button>}
      </Box>
    </Box>
  );
};

export default AddCourseForm; 