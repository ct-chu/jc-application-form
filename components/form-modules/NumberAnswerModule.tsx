'use client';
import React from 'react';
import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form';
import { FormModuleProps } from './common';

interface MyFormValues {
  [key: string]: number | string; // Can be string then parsed, or number directly
}

interface NumberAnswerProps<T extends MyFormValues> extends FormModuleProps<T> {
  min?: number;
  max?: number;
}

export const NumberAnswerModule: React.FC<NumberAnswerProps<MyFormValues>> = ({
  name,
  label,
  control,
  // errors,
  required = false,
  min,
  max,
  className = 'mb-4',
}) => {
  if ( min !== undefined ||  max !== undefined ) {
    label = label + " ( "
    label = ( min !== undefined ) ? label +`最少 Min. ${min.toString()} ` : label
    label = ( max !== undefined ) ? label +`最多 Max. ${max.toString()} ` : label
    label = label + ")"
  }

  return (
    <div className={className}>
      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? (typeof required === 'string' ? required : '此欄必填。This field is required.') : false,
          min: min !== undefined ? { value: min, message: `數字不得小於 ${min}。Minimum value is ${min}.` } : undefined,
          max: max !== undefined ? { value: max, message: `數字不得大於 ${max}。Maximum value is ${max}.` } : undefined,
          validate: value => {
            if (value === null || value === undefined || value === '') return true; // Allow empty if not required
            const num = parseFloat(value.toString());
            return !isNaN(num) || '請輸入有效數字。Please enter a valid number.';
          }
        }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label={label}
            type="number"
            variant="outlined"
            fullWidth
            required={!!required}
            error={!!fieldState.error}
            helperText={fieldState.error?.message as string || ''}
            inputProps={{
              min, max, step: 'any'
            }} // HTML5 validation can be a plus
            className="bg-white"
            onChange={(e) => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))} // ensure number or null
            value={field.value === null || field.value === undefined ? '' : field.value}
            sx={{
              "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                display: "none",
              },
              "& input[type=number]": {
                MozAppearance: "textfield",
              },
            }}
          />
        )}
      />
    </div>
  );
};