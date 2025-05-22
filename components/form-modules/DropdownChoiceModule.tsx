'use client';
import React from 'react';
import { Select, MenuItem, FormControl, InputLabel, Typography } from '@mui/material';
import { Controller } from 'react-hook-form';
import { FormModuleProps } from './common';

interface Choice {
  value: string | number;
  label: string;
}

interface MyFormValues {
  [key: string]: string | string[];
}

interface DropdownProps<T extends MyFormValues> extends FormModuleProps<T> {
  choices: Choice[];
  multiple?: boolean;
}

export const DropdownChoiceModule: React.FC<DropdownProps<MyFormValues>> = ({
  name,
  label,
  control,
  // errors,
  required = false,
  choices,
  multiple = false,
  className = 'mb-4',
}) => {
  return (
    <div className={className}>
      <FormControl fullWidth required={!!required} variant="outlined" className="bg-white">
        <InputLabel id={`${name}-label`}>{label}</InputLabel>
        <Controller
          name={name}
          control={control}
          defaultValue={multiple ? [] : ''}
          rules={{ required: required ? (typeof required === 'string' ? required : '此欄必填。This field is required.') : false }}
          render={({ field, fieldState }) => (
            <>
              <Select
                {...field}
                labelId={`${name}-label`}
                label={label}
                multiple={multiple}
                error={!!fieldState.error}
              >
                {!multiple && <MenuItem value=""><em>None</em></MenuItem>}
                {choices.map((choice) => (
                  <MenuItem key={choice.value} value={choice.value}>
                    {choice.label}
                  </MenuItem>
                ))}
              </Select>
              {fieldState.error ?
                <Typography
                  variant="subtitle1" gutterBottom component="label" fontSize="0.75rem"
                  htmlFor={`${name}-dropdown`}
                  className={fieldState.error ? 'text-red-600' : ''}
                >
                  {fieldState.error?.message as string || ''}
                </Typography>
              :null}
            </>
          )}
        />
        {/* {errors[name] && <FormHelperText>{errors[name]?.message as string}</FormHelperText>} */}
      </FormControl>
    </div>
  );
};