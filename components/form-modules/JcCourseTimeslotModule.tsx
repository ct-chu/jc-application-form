// components/form-modules/JcCourseTimeslotModule.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect, useMemo } from 'react';
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
  IconButton,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; // For date-fns v2.x. For v3.x use AdapterDateFnsV3
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { Controller, useFormContext, FieldPath } from 'react-hook-form';
import { format as formatDateFns, isValid as isValidDate, isEqual as isEqualDate, parse as parseDateFns, startOfDay } from 'date-fns';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // Not used directly
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PublishIcon from '@mui/icons-material/Publish'; // For default verify state
import TaskAltIcon from '@mui/icons-material/TaskAlt'; // For verified state

// Re-using FormModuleProps definition
export interface FormModuleProps<TFormValues extends Record<string, any>> {
  name: FieldPath<TFormValues>;
  label: string;
  control: any;
  errors: any;
  required?: boolean | string;
  className?: string;
}

export type JcTimeslotData = string[]; // e.g., ["2025/05/08_AM", "2025/05/09_PM"]

// Props for the custom day component
interface CustomPickersDayProps extends PickersDayProps<Date> {
  isAvailable: boolean;
}

const StyledPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== 'isAvailable',
})<CustomPickersDayProps>(({ theme, isAvailable, today, selected }) => ({
  ...(isAvailable && !selected && !today && { // Available, not selected, not today
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.success.main,
    },
  }),
  ...(isAvailable && today && !selected && { // Available, today, not selected
    backgroundColor: theme.palette.success.main, // Darker green for today available
    color: theme.palette.success.contrastText,
    border: `1px solid ${theme.palette.primary.main}` // Keep today's border
  }),
  // Selected days will use MUI's default primary color styling.
  // If a selected day is also available, it will appear as selected.
}));

interface JcCourseTimeslotModuleProps<TFormValues extends Record<string, any>>
  extends FormModuleProps<TFormValues> {
  jcTimeslots: JcTimeslotData;
  datePickerLabel?: string;
  ampmPickerLabel?: string;
}

// Re-using StyledPickersDay (ensure it's accessible, e.g. exported or defined in a shared util)
// For this example, assuming it's defined above or imported.


interface MyMainFormValuesJcExample { // Replace with your actual form values type
  "jcTimeslotField"?: string | null;
}

export const JcCourseTimeslotModule: React.FC<
  JcCourseTimeslotModuleProps<MyMainFormValuesJcExample>
> = ({
  name,
  label,
  control,
  required = false,
  jcTimeslots,
  className = 'mb-4',
  datePickerLabel = '日期 Date (YYYY/MM/DD)',
  ampmPickerLabel = 'AM/PM',
}) => {
    const { setValue, setError, clearErrors, watch, formState: { errors: rhfErrors } } = useFormContext<MyMainFormValuesJcExample>();

    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedAmPm, setSelectedAmPm] = useState<string>('');
    const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('idle');
    const [verificationMessage, setVerificationMessage] = useState<string>('');

    const rhfFieldValue = watch(name); // This is the "YYYY/MM/DD_AMPM" string or null
    const stringifiedJcTimeslots = JSON.stringify(jcTimeslots || []);

    const availableDatesSet = useMemo(() => {
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

    // Effect: Synchronize internal state FROM RHF field value
    useEffect(() => {
      console.log(`JcCourseTimeslotModule SYNC EFFECT for '${name}': RHF value is now '${rhfFieldValue}'`);
      if (rhfFieldValue && typeof rhfFieldValue === 'string') {
        // RHF value is "YYYY/MM/DD_AMPM"
        const [dateStr, ampmStr] = rhfFieldValue.split('_');
        const newDateFromRHF = parseDateFns(dateStr, 'yyyy/MM/dd', new Date());

        if (isValidDate(newDateFromRHF) && ampmStr) {
          const internalDateMatches = selectedDate && isValidDate(selectedDate) && isEqualDate(startOfDay(selectedDate), startOfDay(newDateFromRHF));
          const internalAmPmMatches = selectedAmPm === ampmStr;

          if (!internalDateMatches || !internalAmPmMatches) {
            console.log(`JcCourseTimeslotModule SYNC: Populating pickers from RHF value. Date: ${dateStr}, AM/PM: ${ampmStr}`);
            setSelectedDate(newDateFromRHF);
            setSelectedAmPm(ampmStr);
            setVerificationStatus('verified');
            setVerificationMessage(`已確認時段。Timeslot confirmed: ${formatDateFns(newDateFromRHF, 'yyyy/MM/dd')} ${ampmStr}`);
          } else {
            console.log(`JcCourseTimeslotModule SYNC: Internal state already matches RHF value '${rhfFieldValue}'. No update.`);
          }
          if (rhfErrors[name]) clearErrors(name);
        } else {
          console.warn(`JcCourseTimeslotModule SYNC: RHF value '${rhfFieldValue}' is not a valid timeslot string for parsing.`);
          if (selectedDate !== null || selectedAmPm !== '' || verificationStatus !== 'idle') {
            setSelectedDate(null);
            setSelectedAmPm('');
            setVerificationStatus('idle');
            setVerificationMessage('');
          }
        }
      } else if (rhfFieldValue === null || rhfFieldValue === undefined || rhfFieldValue === '') {
        if (verificationStatus !== 'idle') {
          console.log(`JcCourseTimeslotModule SYNC: RHF is empty and status was '${verificationStatus}'. Resetting internal state.`);
          setSelectedDate(null);
          setSelectedAmPm('');
          setVerificationStatus('idle');
          setVerificationMessage('');
        } else {
          console.log(`JcCourseTimeslotModule SYNC: RHF is empty and status is 'idle'. No change to pickers from this effect.`);
        }
      }
    }, [rhfFieldValue, name, clearErrors, setValue]); // Dependency array refined

    const handleVerifyClick = () => {
      console.log(`JcCourseTimeslotModule VERIFY CLICK for '${name}': Date=${selectedDate}, AM/PM='${selectedAmPm}'`);
      const currentParsedTimeslots: string[] = JSON.parse(stringifiedJcTimeslots);

      if (selectedDate && isValidDate(selectedDate) && selectedAmPm) {
        const formattedDate = formatDateFns(selectedDate, 'yyyy/MM/dd');
        const searchString = `${formattedDate}_${selectedAmPm}`;

        const isMatch = currentParsedTimeslots.includes(searchString);

        if (isMatch) {
          setValue(name, searchString as any, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
          clearErrors(name);
          setVerificationStatus('verified');
          setVerificationMessage(`已確認。Confirmed: ${formattedDate} ${selectedAmPm}`);
        } else {
          setValue(name, null as any, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
          setVerificationStatus('error');
          setVerificationMessage('選擇無效，請重新選擇。Invalid selection, please choose again.');
        }
      } else {
        setValue(name, null as any, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
        setVerificationStatus('error');
        setVerificationMessage('日期或時間未填。Please select date and AM/PM.');
      }
    };

    const resetVerificationAndRHFValue = () => {
      console.log(`JcCourseTimeslotModule resetVerificationAndRHFValue for '${name}'`);
      setVerificationStatus('idle');
      setVerificationMessage('');
      if (watch(name) !== null) {
        setValue(name, null as any, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
      }
    };

    const handleDateChange = (date: Date | null) => {
      setSelectedDate(date ? startOfDay(date) : null);
      resetVerificationAndRHFValue();
    };

    const handleAmPmChange = (event: React.ChangeEvent<{ value: unknown }>) => {
      setSelectedAmPm(event.target.value as string);
      resetVerificationAndRHFValue();
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
            validate: (value) => { // Value here is the "YYYY/MM/DD_AMPM" string from RHF
              if (!required) return true;
              if (value !== null && value !== undefined && value !== '') return true; // Verified
              return verificationStatus === 'error' ? (verificationMessage || '選擇無效。Invalid selection.') : '此欄必填。This field is required.';
            }
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
              <Grid container spacing={1} alignItems="center" className="mt-1">
                <Grid item xs={12} sm={6} md={5}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      enableAccessibleFieldDOMStructure={false}
                      views={['year', 'month', 'day']}
                      // openTo="month"
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
                            className="bg-white"
                          />
                        ),
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={8} sm={4} md={3}>
                  <FormControl sx={{ width: 100 }} fullWidth variant="outlined" error={!!fieldState.error}>
                    <InputLabel id={`${name}-ampm-label`}>{ampmPickerLabel}</InputLabel>
                    <Select
                      labelId={`${name}-ampm-label`} id={`${name}-ampm`}
                      value={selectedAmPm}
                      onChange={handleAmPmChange}
                      label={ampmPickerLabel}
                      className="bg-white"
                    >
                      <MenuItem value=""><em>None</em></MenuItem>
                      <MenuItem value="AM">AM</MenuItem>
                      <MenuItem value="PM">PM</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4} sm={2} md={2} sx={{ textAlign: 'left', pl: 0 }}>
                  <IconButton onClick={handleVerifyClick} color={
                    verificationStatus === 'verified' ? 'success' :
                      verificationStatus === 'error' ? 'error' : 'default'
                  }
                    aria-label="Verify timeslot"
                    title="Verify timeslot"
                    disabled={!selectedDate || !selectedAmPm}
                    sx={{ p: 1.5, mt: 0.5 }}
                  >
                    {verificationStatus === 'verified' ? <TaskAltIcon /> :
                      verificationStatus === 'error' ? <ErrorOutlineIcon /> :
                        <PublishIcon />}
                    <Typography variant='h6'>{verificationStatus === 'verified' ? ' OK' :
                      verificationStatus === 'error' ? ' Error' : ' Confirm'}</Typography>
                  </IconButton>
                </Grid>
              </Grid>
              {fieldState.error?.message && (
                <FormHelperText error className="ml-1 mt-1">
                  {fieldState.error.message}
                </FormHelperText>
              )}
              {verificationMessage &&
                ((verificationStatus === 'error' && !fieldState.error?.message.includes(verificationMessage)) ||
                  (verificationStatus === 'verified' && !fieldState.error)) && (
                  <Typography
                    variant="caption"
                    className="ml-1 mt-1"
                    color={verificationStatus === 'verified' ? 'green' : 'red'}
                    sx={{ display: 'block' }}
                  >
                    {verificationMessage}
                  </Typography>
                )}
            </>
          )}
        />
      </div>
    );
  };
