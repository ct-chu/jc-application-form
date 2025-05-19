/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, FormHelperText } from '@mui/material';
import { Controller } from 'react-hook-form';
import { FormModuleProps } from './common';
import { useFormContextData } from '@/context/FormContext';

interface ChoiceOption {
  value: string;
  label: string;
  nextPage?: number; // Optional: page number to navigate to
}

interface MyFormValues {
  [key: string]: string;
}

interface SingleChoiceProps<T extends MyFormValues> extends FormModuleProps<T> {
  choices: ChoiceOption[]|any;
}

export const SingleChoiceCheckboxModule: React.FC<SingleChoiceProps<MyFormValues>> = ({
  name,
  label,
  control,
  errors,
  required = false,
  choices,
  className = 'mb-4',
}) => {
  const { updateFormData, goToPage } = useFormContextData();

  return (
    <div className={className}>
      <FormControl component="fieldset" error={!!errors[name]} required={!!required}>
        <FormLabel component="legend">{label}</FormLabel>
        <Controller
          name={name}
          control={control}
          rules={{ required: required ? (typeof required === 'string' ? required : '此欄必填。This field is required.') : false }}
          render={({ field }) => (
            <RadioGroup
              {...field}
              onChange={(e) => {
                field.onChange(e);
                const selectedValue = e.target.value;
                const selectedChoice = choices.find((choice: any) => choice.value === selectedValue);
                updateFormData({ [name]: selectedValue }); // Update global context immediately for potential conditional logic
                // Conditional navigation is handled by the NavigationButton's onNext prop
              }}
            >
              {choices.map((choice: any) => (
                <FormControlLabel
                  key={choice.value}
                  value={choice.value}
                  control={<Radio />}
                  label={choice.label}
                />
              ))}
            </RadioGroup>
          )}
        />
        {errors[name] && <FormHelperText>{errors[name]?.message as string}</FormHelperText>}
      </FormControl>
    </div>
  );
};