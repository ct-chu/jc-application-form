'use client';
import React from 'react';
import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form';
import { FormModuleProps } from './common';

interface MyFormValues {
  [key: string]: string;
}

export const PhoneNumberModule: React.FC<FormModuleProps<MyFormValues>> = ({
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
            value: /^[0-9]{8}$/,
            message: '請輸入有效8位號碼，並去除空格及地區碼（+852）。Please enter a valid 8-digit no., without any spaces or country code (+852).',
          },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label={label}
            type="tel"
            variant="outlined"
            fullWidth
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