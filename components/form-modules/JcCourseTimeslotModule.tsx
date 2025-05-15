// components/form-modules/JcCourseTimeslotModule.tsx
'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Grid,
  FormHelperText,
  styled,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { Controller, useFormContext, FieldPath } from 'react-hook-form';
import { format as formatDateFns, isValid as isValidDate, isEqual as isEqualDate, parse as parseDateFns, startOfDay } from 'date-fns';

// Re-using FormModuleProps definition
export interface FormModuleProps<TFormValues extends Record<string, any>> {
  name: FieldPath<TFormValues>;
  label: string;
  control: any;
  errors: any;
  required?: boolean | string;
  className?: string;
}

// New data type for this module
export type JcTimeslotData = string[]; // e.g., ["2025/05/08_AM", "2025/05/09_PM"]

interface JcCourseTimeslotModuleProps<TFormValues extends Record<string, any>>
  extends FormModuleProps<TFormValues> {
  jcTimeslots: JcTimeslotData; // Changed prop name and type
  datePickerLabel?: string;
  ampmPickerLabel?: string;
}

// Props for the custom day component (can be shared or defined locally)
interface CustomPickersDayProps extends PickersDayProps<Date> {
  isAvailable: boolean;
}

const StyledPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== 'isAvailable',
})<CustomPickersDayProps>(({ theme, isAvailable, today }) => ({
    ...(isAvailable && !today && {
        backgroundColor: theme.palette.success.light,
        color: theme.palette.success.contrastText,
        '&:hover': {
            backgroundColor: theme.palette.success.main,
        },
        '&.Mui-selected': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            '&:hover': {
                backgroundColor: theme.palette.primary.dark,
            },
        }
    }),
    ...(isAvailable && today && {
        backgroundColor: theme.palette.success.main,
        color: theme.palette.success.contrastText,
        border: `1px solid ${theme.palette.primary.main}`
    })
}));

interface MyMainFormValuesJcExample { // Replace with your actual form values type
  "jcTimeslotField"?: string | null; // Example RHF field name
}

export const JcCourseTimeslotModule: React.FC<
  JcCourseTimeslotModuleProps<MyMainFormValuesJcExample> // Use your actual TFormValues
> = ({
  name,
  label,
  control,
  required = false,
  jcTimeslots, // Changed prop
  className = 'mb-4',
  datePickerLabel = '選擇日期 Select Date (YYYY/MM/DD)',
  ampmPickerLabel = '選擇 Select AM/PM',
}) => {
  const { setValue, setError, clearErrors, watch, formState: { errors: rhfErrors } } = useFormContext<MyMainFormValuesJcExample>();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedAmPm, setSelectedAmPm] = useState<string>('');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  const rhfFieldValue = watch(name); // This will be "YYYY/MM/DD_AMPM" string or null

  const stringifiedJcTimeslots = JSON.stringify(jcTimeslots || []);
  const stringifiedRhfErrors = JSON.stringify(rhfErrors || {});

  const availableDatesSet = useMemo(() => {
    console.log("JcModule: Recalculating availableDatesSet");
    const dates = new Set<string>();
    const currentParsedTimeslots: string[] = JSON.parse(stringifiedJcTimeslots);
    currentParsedTimeslots.forEach((timeslotString) => {
      if (typeof timeslotString === 'string') {
        const [dateStr] = timeslotString.split('_');
        dates.add(dateStr);
      }
    });
    return dates;
  }, [stringifiedJcTimeslots]);

  // Effect 1: Synchronize internal state FROM RHF field value
  useEffect(() => {
    console.log(`JcSYNC EFFECT for '${name}': RHF value is now '${rhfFieldValue}'`);
    if (rhfFieldValue && typeof rhfFieldValue === 'string') {
      // rhfFieldValue is "YYYY/MM/DD_AMPM"
      const [dateStr, ampmStr] = rhfFieldValue.split('_');
      const newDateFromRHF = parseDateFns(dateStr, 'yyyy/MM/dd', new Date());

      const internalDateMatches = selectedDate && isValidDate(selectedDate) && isValidDate(newDateFromRHF) && isEqualDate(startOfDay(selectedDate), startOfDay(newDateFromRHF));
      const internalAmPmMatches = selectedAmPm === ampmStr;

      if (isValidDate(newDateFromRHF) && ampmStr && (!internalDateMatches || !internalAmPmMatches)) {
        console.log(`JcSYNC EFFECT for '${name}': RHF value '${rhfFieldValue}' caused update to internal pickers.`);
        setSelectedDate(newDateFromRHF);
        setSelectedAmPm(ampmStr);
      }
    } else if ((rhfFieldValue === null || rhfFieldValue === undefined || rhfFieldValue === '')) {
      console.log(`JcSYNC EFFECT for '${name}': RHF value is empty. No change to internal pickers from this effect.`);
    }
  }, [rhfFieldValue, name, selectedDate, selectedAmPm]);

  // Effect 2: Validate internal state and update RHF field value
  const validateAndSetTimeslotString = useCallback(() => {
    console.log(`JcVALIDATE EFFECT for '${name}': Internal state: Date=${selectedDate}, AM/PM='${selectedAmPm}'`);
    const currentParsedTimeslots: string[] = JSON.parse(stringifiedJcTimeslots);
    const currentParsedRhfErrors = JSON.parse(stringifiedRhfErrors);

    if (selectedDate && isValidDate(selectedDate) && selectedAmPm) {
      const formattedDate = formatDateFns(selectedDate, 'yyyy/MM/dd');
      const searchString = `${formattedDate}_${selectedAmPm}`; // "YYYY/MM/DD_AMPM"
      console.log(`JcVALIDATE EFFECT for '${name}': Searching for timeslot: '${searchString}'`);

      const isMatch = currentParsedTimeslots.includes(searchString);

      if (isMatch) {
        console.log(`JcVALIDATE EFFECT for '${name}': Match found! Timeslot: '${searchString}'. Setting RHF field.`);
        if (watch(name) !== searchString) {
          setValue(name, searchString as any, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
        }
        clearErrors(name);
        setFeedbackMessage(`你選擇了時段 ${formattedDate} ${selectedAmPm}。You have chosen timeslot ${formattedDate} ${selectedAmPm}.`);
      } else {
        console.log(`JcVALIDATE EFFECT for '${name}': No match for '${searchString}'. Setting RHF field to null.`);
        if (watch(name) !== null) {
          setValue(name, null as any, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
        }
        setError(name, { type: 'manual', message: 'Please enter a valid timeslot.' });
        setFeedbackMessage('');
      }
    } else {
      console.log(`JcVALIDATE EFFECT for '${name}': Inputs incomplete/invalid. Ensuring RHF field is null.`);
      if (watch(name) !== null) {
        setValue(name, null as any, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
      }
      if (currentParsedRhfErrors[name]?.type === 'manual') {
        clearErrors(name);
      }
      setFeedbackMessage('');
    }
  }, [
    selectedDate, selectedAmPm, name, setValue, setError, clearErrors, watch,
    stringifiedJcTimeslots, stringifiedRhfErrors
  ]);

  useEffect(() => {
    validateAndSetTimeslotString();
  }, [selectedDate, selectedAmPm, validateAndSetTimeslotString]);

  const handleDateChange = (date: Date | null) => {
    console.log(`JcInput Change for '${name}': Date selected:`, date);
    setSelectedDate(date ? startOfDay(date) : null);
  };

  const handleAmPmChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newAmPm = event.target.value as string;
    console.log(`JcInput Change for '${name}': AM/PM selected:`, newAmPm);
    setSelectedAmPm(newAmPm);
  };

  return (
    <div className={className}>
      <Controller
        name={name}
        control={control}
        rules={{
          required: required
            ? typeof required === 'string' ? required : '此欄必填。This field is required.'
            : false,
        }}
        render={({ fieldState }) => (
          <>
            <Typography
              variant="subtitle1" gutterBottom component="label"
              htmlFor={`${name}-date`}
              className={fieldState.error ? 'text-red-600' : ''}
            >
              {label} {required && <span className="text-red-500">*</span>}
            </Typography>
            <Grid container spacing={2} className="mt-1">
              <Grid item xs={12} sm={7}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                  enableAccessibleFieldDOMStructure={false}
                    label={datePickerLabel}
                    value={selectedDate}
                    onChange={handleDateChange}
                    format="yyyy/MM/dd"
                    slots={{
                      day: (dayProps) => {
                        const dateString = formatDateFns(dayProps.day, 'yyyy/MM/dd');
                        const isAvailable = availableDatesSet.has(dateString);
                        return (
                          <StyledPickersDay
                            {...dayProps}
                            isAvailable={isAvailable}
                          />
                        );
                      },
                      textField: (params) => (
                        <TextField
                          {...params} fullWidth variant="outlined"
                          id={`${name}-date`}
                          error={!!fieldState.error}
                        />
                      ),
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={5}>
                <FormControl sx={{width: 140}} fullWidth variant="outlined" error={!!fieldState.error}>
                  <InputLabel id={`${name}-ampm-label`}>{ampmPickerLabel}</InputLabel>
                  <Select
                    labelId={`${name}-ampm-label`} id={`${name}-ampm`}
                    value={selectedAmPm}
                    onChange={handleAmPmChange as any}
                    label={ampmPickerLabel}
                  >
                    <MenuItem value=""><em>None</em></MenuItem>
                    <MenuItem value="AM">AM</MenuItem>
                    <MenuItem value="PM">PM</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            {fieldState.error?.message && (
              <FormHelperText error className="ml-1 mt-1">
                {fieldState.error.message}
              </FormHelperText>
            )}
          </>
        )}
      />
      {feedbackMessage && !rhfErrors[name] && (
        <Typography variant="body2" color="green" className="mt-2 ml-1">
          {feedbackMessage}
        </Typography>
      )}
    </div>
  );
};
