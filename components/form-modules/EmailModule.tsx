'use client';
import React from 'react';
import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form';
import { FormModuleProps } from './common'; // Adjust path

// Define your form values interface if not already globally defined
interface MyFormValues {
  [key: string]: string; // Example, adjust as needed
}

export const EmailModule: React.FC<FormModuleProps<MyFormValues>> = ({
  name,
  label,
  control,
  errors,
  required = false,
  className = 'mb-4',
}) => {
  return (
    <div className={className}>
      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? (typeof required === 'string' ? required : '此欄必填。This field is required.') : false,
          pattern: {
            value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
            message: '請輸入有效電郵地址。Please enter a valid email address.',
          },
         }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label={label}
            variant="outlined"
            fullWidth
            required={!!required}
            error={!!fieldState.error}
            helperText={fieldState.error?.message as string || ''}
            className="bg-white" // Example Tailwind styling
          />
        )}
      />
    </div>
  );
};