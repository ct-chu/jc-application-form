'use client';
import React from 'react';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; // or AdapterDayjs
import { Controller } from 'react-hook-form';
import { FormModuleProps } from './common';
import { TextField } from '@mui/material'; // For rendering input

interface MyFormValues {
  [key: string]: Date | null;
}

interface DateSelectionProps<T extends MyFormValues> extends FormModuleProps<T> {
  allowedDates?: string[]; // Array of ISO date strings e.g., "2023-12-25"
  disablePast?: boolean;
  disableFuture?: boolean;
}

export const DateSelectionModule: React.FC<DateSelectionProps<MyFormValues>> = ({
  name,
  label,
  control,
  errors,
  required = false,
  allowedDates,
  disablePast,
  disableFuture,
  className = 'mb-4',
}) => {
  const isDateAllowed = (date: Date | null): boolean => {
    if (!date || !allowedDates || allowedDates.length === 0) return true;
    // Ensure date is compared in YYYY-MM-DD format without time
    const isoDate = date.toISOString().split('T')[0];
    return allowedDates.includes(isoDate);
  };

  return (
    <div className={className}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Controller
          name={name}
          control={control}
          rules={{
            required: required ? (typeof required === 'string' ? required : '此欄必填。This field is required.') : false,
            validate: (value) => (allowedDates ? isDateAllowed(value) || 'Selected date is not allowed' : true),
          }}
          render={({ field, fieldState }) => (
            <DatePicker
              label={label}
              value={field.value || null}
              onChange={(date) => field.onChange(date)}
              disablePast={disablePast}
              disableFuture={disableFuture}
              shouldDisableDate={(date) => allowedDates ? !isDateAllowed(date) : false}
              slots={{
                textField: (params) => (
                    <TextField
                        {...params}
                        fullWidth
                        variant="outlined"
                        required={!!required}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message as string || params.helperText || ''}
                        className="bg-white"
                    />
                ),
              }}

            />
          )}
        />
      </LocalizationProvider>
    </div>
  );
};