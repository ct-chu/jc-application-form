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
  errors,
  required = false,
  min,
  max,
  className = 'mb-4',
}) => {
  return (
    <div className={className}>
      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? (typeof required === 'string' ? required : '此欄必填。This field is required.') : false,
          min: min !== undefined ? { value: min, message: `Minimum value is ${min}` } : undefined,
          max: max !== undefined ? { value: max, message: `Maximum value is ${max}` } : undefined,
          validate: value => {
            if (value === null || value === undefined || value === '') return true; // Allow empty if not required
            const num = parseFloat(value);
            return !isNaN(num) || 'Please enter a valid number';
          }
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label={label}
            type="number"
            variant="outlined"
            fullWidth
            required={!!required}
            error={!!errors[name]}
            helperText={errors[name]?.message as string || ''}
            inputProps={{ min, max, step: 'any' }} // HTML5 validation can be a plus
            className="bg-white"
            onChange={(e) => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))} // ensure number or null
            value={field.value === null || field.value === undefined ? '' : field.value}
          />
        )}
      />
    </div>
  );
};