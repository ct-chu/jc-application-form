// components/form-modules/CourseTimeslotModule.tsx
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
    IconButton,
    Box,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; // For date-fns v2.x. For v3.x use AdapterDateFnsV3
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { Controller, useFormContext, FieldPath } from 'react-hook-form';
import { format as formatDateFns, isValid as isValidDate, isEqual as isEqualDate, parse as parseDateFns, startOfDay } from 'date-fns';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PublishIcon from '@mui/icons-material/Publish'; // For default verify state
import TaskAltIcon from '@mui/icons-material/TaskAlt'; // For verified state

// Assuming FormModuleProps is defined in a common file
export interface FormModuleProps<TFormValues extends Record<string, any>> {
    name: FieldPath<TFormValues>;
    label: string;
    control: any; // Control<TFormValues>
    errors: any; // FieldErrors<TFormValues> // This is RHF's top-level errors object
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
}));


interface MyMainFormValuesExample { // Replace with your actual form values type
    "outreach1.timeslot.one"?: string | null;
}

type VerificationStatus = 'idle' | 'verified' | 'error';

export const CourseTimeslotModule: React.FC<
    CourseTimeslotModuleProps<MyMainFormValuesExample> // Use your actual TFormValues
> = ({
    name,
    label,
    control,
    required = false,
    courseTimeslots,
    className = 'mb-4',
    datePickerLabel = '日期 Date (YYYY/MM/DD)',
    ampmPickerLabel = 'AM/PM',
}) => {
        const { setValue, setError, clearErrors, watch, formState: { errors: rhfErrors } } = useFormContext<MyMainFormValuesExample>();

        const [selectedDate, setSelectedDate] = useState<Date | null>(null);
        const [selectedAmPm, setSelectedAmPm] = useState<string>('');
        const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('idle');
        const [verificationMessage, setVerificationMessage] = useState<string>('');

        const rhfFieldValue = watch(name); // This is the course code or null
        const stringifiedCourseTimeslots = JSON.stringify(courseTimeslots || {});

        const availableDatesSet = useMemo(() => {
            const dates = new Set<string>();
            const currentParsedTimeslots = JSON.parse(stringifiedCourseTimeslots);
            Object.values(currentParsedTimeslots).forEach((timeslotString: any) => {
                if (typeof timeslotString === 'string') {
                    const [dateStr] = timeslotString.split('_');
                    dates.add(dateStr);
                }
            });
            return dates;
        }, [stringifiedCourseTimeslots]);

        // Effect: Synchronize internal state FROM RHF field value
        useEffect(() => {
            console.log(`CourseTimeslotModule SYNC EFFECT for '${name}': RHF value (courseCode) is now '${rhfFieldValue}'`);
            const currentParsedTimeslots = JSON.parse(stringifiedCourseTimeslots);

            if (rhfFieldValue && typeof rhfFieldValue === 'string' && currentParsedTimeslots[rhfFieldValue]) {
                // RHF has a valid course code, and it maps to a timeslot string
                const timeslotString = currentParsedTimeslots[rhfFieldValue]; // "YYYY/MM/DD_AMPM"
                const [dateStr, ampmStr] = timeslotString.split('_');
                const newDateFromRHF = parseDateFns(dateStr, 'yyyy/MM/dd', new Date());

                if (isValidDate(newDateFromRHF) && ampmStr) {
                    // Check if internal state already matches to prevent unnecessary updates
                    const internalDateMatches = selectedDate && isValidDate(selectedDate) && isEqualDate(startOfDay(selectedDate), startOfDay(newDateFromRHF));
                    const internalAmPmMatches = selectedAmPm === ampmStr;

                    if (!internalDateMatches || !internalAmPmMatches) {
                        console.log(`CourseTimeslotModule SYNC: Populating pickers from RHF value. Date: ${dateStr}, AM/PM: ${ampmStr}`);
                        setSelectedDate(newDateFromRHF);
                        setSelectedAmPm(ampmStr);
                        setVerificationStatus('verified');
                        setVerificationMessage(`已確認時段。Timeslot confirmed: ${formatDateFns(newDateFromRHF, 'yyyy/MM/dd')} ${ampmStr}`);
                        if (rhfErrors[name]) clearErrors(name);
                    } else {
                        console.log(`CourseTimeslotModule SYNC: Internal state already matches RHF value '${rhfFieldValue}'. No update.`);
                    }
                } else {
                    // RHF value (courseCode) exists but its corresponding timeslot string is invalid/unparsable
                    console.warn(`CourseTimeslotModule SYNC: Timeslot string for courseCode '${rhfFieldValue}' is invalid.`);
                    if (selectedDate !== null || selectedAmPm !== '' || verificationStatus !== 'idle') {
                        setSelectedDate(null);
                        setSelectedAmPm('');
                        setVerificationStatus('idle');
                        setVerificationMessage('');
                    }
                }
            } else if (rhfFieldValue === null || rhfFieldValue === undefined || rhfFieldValue === '') {
                // RHF field is empty.
                // If verificationStatus is not 'idle', it means there was a previous state (verified/error)
                // that is now being cleared externally (e.g., form.reset()). So, reset internal state.
                if (verificationStatus !== 'idle') {
                    console.log(`CourseTimeslotModule SYNC: RHF is empty and status was '${verificationStatus}'. Resetting internal state.`);
                    setSelectedDate(null);
                    setSelectedAmPm('');
                    setVerificationStatus('idle');
                    setVerificationMessage('');
                } else {
                    // RHF is empty and status is 'idle'. This is normal during user input before verification.
                    // Do not clear selectedDate/selectedAmPm here as user might be typing.
                    console.log(`CourseTimeslotModule SYNC: RHF is empty and status is 'idle'. No change to pickers from this effect.`);
                }
            }
        }, [rhfFieldValue, name, stringifiedCourseTimeslots, clearErrors, setValue]); // Removed selectedDate, selectedAmPm, verificationStatus from deps


        const handleVerifyClick = () => {
            console.log(`CourseTimeslotModule VERIFY CLICK for '${name}': Date=${selectedDate}, AM/PM='${selectedAmPm}'`);
            const currentParsedTimeslots = JSON.parse(stringifiedCourseTimeslots);

            if (selectedDate && isValidDate(selectedDate) && selectedAmPm) {
                const formattedDate = formatDateFns(selectedDate, 'yyyy/MM/dd');
                const searchString = `${formattedDate}_${selectedAmPm}`;

                const matchedEntry = Object.entries(currentParsedTimeslots).find(
                    ([_code, timeslot]) => timeslot === searchString
                );

                if (matchedEntry) {
                    const [courseCode] = matchedEntry;
                    setValue(name, courseCode as any, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
                    clearErrors(name);
                    setVerificationStatus('verified');
                    setVerificationMessage(`已確認。Confirmed: ${courseCode} (${formattedDate} ${selectedAmPm})`);
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
            console.log(`CourseTimeslotModule resetVerificationAndRHFValue for '${name}'`);
            setVerificationStatus('idle');
            setVerificationMessage('');
            if (watch(name) !== null) {
                setValue(name, null as any, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
            }
            // Do not call clearErrors(name) here if the field is required.
            // Setting RHF value to null will allow RHF's own 'required' validation to take effect.
            // Only clear specific manual errors if necessary, but usually not needed here.
        };

        const handleDateChange = (date: Date | null) => {
            console.log(`CourseTimeslotModule Input Change for '${name}': Date selected:`, date);
            setSelectedDate(date ? startOfDay(date) : null);
            resetVerificationAndRHFValue();
        };

        const handleAmPmChange = (event: React.ChangeEvent<{ value: unknown }>) => {
            const newAmPm = event.target.value as string;
            console.log(`CourseTimeslotModule Input Change for '${name}': AM/PM selected:`, newAmPm);
            setSelectedAmPm(newAmPm);
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
                        validate: (value) => { // Value here is the courseCode from RHF
                            if (!required) return true;
                            // If required, RHF value must not be null (which means verification was successful)
                            // If RHF value is null, the error message will be the one from RHF (e.g. "required")
                            // or the one from setVerificationMessage if verificationStatus is 'error'.
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
                                                        error={!!fieldState.error} // Error style driven by RHF
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
                            {/* Show verification message if it's an error and RHF doesn't have a more specific error,
                OR if it's a success message and there's no RHF error. */}
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