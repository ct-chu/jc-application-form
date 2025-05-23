// components/form-modules/common.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Control, FieldErrors, Path } from 'react-hook-form';

export interface FormModuleProps<TFormValues extends Record<string, any>> {
  name: Path<TFormValues>;
  label: string;
  control: Control<TFormValues>;
  errors: FieldErrors<TFormValues>;
  required?: boolean | string;
  className?: string;
}