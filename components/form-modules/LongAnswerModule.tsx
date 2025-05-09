'use client';
import React from 'react';
import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form';
import { FormModuleProps } from './common';

interface MyFormValues {
  [key: string]: string;
}

interface LongAnswerProps<T extends MyFormValues> extends FormModuleProps<T> {
  rows?: number;
}

export const LongAnswerModule: React.FC<LongAnswerProps<MyFormValues>> = ({
  name,
  label,
  control,
  errors,
  required = false,
  rows = 4,
  className = 'mb-4',
}) => {
  return (
    <div className={className}>
      <Controller
        name={name}
        control={control}
        rules={{ required: required ? (typeof required === 'string' ? required : '此欄必填。This field is required.') : false }}
        render={({ field }) => (
          <TextField
            {...field}
            label={label}
            variant="outlined"
            fullWidth
            multiline
            rows={rows}
            required={!!required}
            error={!!errors[name]}
            helperText={errors[name]?.message as string || ''}
            className="bg-white"
          />
        )}
      />
    </div>
  );
};