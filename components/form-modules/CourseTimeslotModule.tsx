'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Grid,
  FormHelperText,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { Controller, useFormContext, Path } from 'react-hook-form';
import { format as formatDateFns } from 'date-fns';

// Assuming FormModuleProps is defined in a common file as in the previous example
export interface FormModuleProps<TFormValues extends Record<string, any>> {
  name: Path<TFormValues>;
  label: string;
  control: any; // Control<TFormValues>
  errors: any; // FieldErrors<TFormValues>
  required?: boolean | string;
  className?: string;
}

export interface CourseTimeslotData {
  [courseCode: string]: string; // e.g., "HKP_001": "2025/05/08_AM"
}

interface CourseTimeslotModuleProps<TFormValues extends Record<string, any>>
  extends FormModuleProps<TFormValues> {
  courseTimeslots: CourseTimeslotData;
  datePickerLabel?: string;
  ampmPickerLabel?: string;
}

// Define your main form values interface if not already global
interface MyMainFormValues {
  // ... other fields
  selectedCourseCode?: string | null; // This module will manage this field
  // ... other fields
}

export const CourseTimeslotModule: React.FC<
  CourseTimeslotModuleProps<MyMainFormValues>
> = ({
  name,
  label,
  control,
  errors,
  required = false,
  courseTimeslots,
  className = 'mb-4',
  datePickerLabel = 'Select Date',
  ampmPickerLabel = 'Select Time (AM/PM)',
}) => {
  const { setValue, setError, clearErrors, watch } = useFormContext<MyMainFormValues>(); // Get RHF methods

  // Local state for the individual inputs within this composite module
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedAmPm, setSelectedAmPm] = useState<string>('');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  // Watch the RHF value for this field to reset internal state if RHF value is externally cleared
  const rhfFieldValue = watch(name);

  useEffect(() => {
    if (rhfFieldValue === null || rhfFieldValue === undefined || rhfFieldValue === '') {
        // If the RHF form value for this field is cleared (e.g., by form reset),
        // reset the internal component states too.
        if (selectedDate !== null || selectedAmPm !== '') {
            setSelectedDate(null);
            setSelectedAmPm('');
            setFeedbackMessage('');
            // No need to clearErrors here as RHF's 'required' rule will take over if applicable.
        }
    }
  }, [rhfFieldValue, selectedDate, selectedAmPm]);


  const validateAndSetCourseCode = useCallback(() => {
    if (selectedDate && selectedAmPm) {
      const formattedDate = formatDateFns(selectedDate, 'yyyy/MM/dd');
      const searchString = `${formattedDate}_${selectedAmPm}`;

      const matchedEntry = Object.entries(courseTimeslots).find(
        ([_code, timeslot]) => timeslot === searchString
      );

      if (matchedEntry) {
        const [courseCode, _timeslotValue] = matchedEntry;
        setValue(name, courseCode as any, { shouldValidate: true });
        clearErrors(name);
        setFeedbackMessage(
          `You have chosen ${courseCode} on ${formattedDate} ${selectedAmPm}`
        );
      } else {
        setValue(name, null as any, { shouldValidate: true }); // Set RHF value to null
        // setError will be triggered by RHF's 'required' rule if value is null.
        // For specific error message:
        setError(name, {
          type: 'manual',
          message: 'Please enter a valid timeslot.',
        });
        setFeedbackMessage(''); // Clear success message
      }
    } else {
      // If one of the inputs is cleared, reset the RHF field value
      // and clear any specific "valid timeslot" error.
      // RHF's 'required' validation will handle it if the field becomes empty and is required.
      setValue(name, null as any, { shouldValidate: true });
      clearErrors(name); // Clear the "Please enter a valid timeslot" or other manual errors.
      setFeedbackMessage('');
    }
  }, [selectedDate, selectedAmPm, courseTimeslots, name, setValue, setError, clearErrors]);

  useEffect(() => {
    validateAndSetCourseCode();
  }, [selectedDate, selectedAmPm, validateAndSetCourseCode]);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleAmPmChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedAmPm(event.target.value as string);
  };


  return (
    <div className={className}>
      <Typography variant="subtitle1" gutterBottom component="label" htmlFor={name as string} className={errors[name] ? 'text-red-600' : ''}>
        {label} {required && '*'}
      </Typography>
      {/* Controller is used to connect RHF to this custom grouped input.
          The actual input elements (DatePicker, Select) are controlled by local state,
          which then calls setValue to update RHF.
          This 'Controller' here mainly serves to register the 'name' with RHF
          and display RHF-level errors. The value it receives is what we set via setValue.
      */}
      <Controller
        name={name}
        control={control}
        rules={{
          required: required
            ? typeof required === 'string'
              ? required
              : '此欄必填。This field is required..'
            : false,
        }}
        render={({ field, fieldState }) => (
          <>
            <Grid container spacing={2} className="mt-1">
              <Grid item xs={12} sm={7}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label={datePickerLabel}
                    value={selectedDate}
                    onChange={handleDateChange}
                    slots={{
                      textField: (params) => (
                        <TextField
                          {...params}
                          fullWidth
                          variant="outlined"
                          id={`${name as string}-date`}
                          error={!!fieldState.error} // Can show error state on date too
                        />
                      ),
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={5}>
                <FormControl fullWidth variant="outlined" error={!!fieldState.error}>
                  <InputLabel id={`${name as string}-ampm-label`}>
                    {ampmPickerLabel}
                  </InputLabel>
                  <Select
                    labelId={`${name as string}-ampm-label`}
                    id={`${name as string}-ampm`}
                    value={selectedAmPm}
                    onChange={handleAmPmChange as any} // MUI Select ChangeEvent type
                    label={ampmPickerLabel}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="AM">AM</MenuItem>
                    <MenuItem value="PM">PM</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            {/* Display RHF error or our specific error */}
            {fieldState.error?.message && (
              <FormHelperText error className="ml-3 mt-1">
                {fieldState.error.message}
              </FormHelperText>
            )}
          </>
        )}
      />

      {feedbackMessage && !errors[name] && ( // Only show success message if no RHF error
        <Typography variant="body2" color="green" className="mt-2 ml-1">
          {feedbackMessage}
        </Typography>
      )}
    </div>
  );
};