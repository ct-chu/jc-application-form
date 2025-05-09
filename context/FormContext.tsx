'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FormData {
  [key: string]: any;
}

interface FormContextType {
  formData: FormData;
  updateFormData: (pageData: Partial<FormData>) => void;
  currentPage: number;
  totalPages: number; // You'll define this based on your form structure
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToPage: (page: number) => void;
  setTotalPages: (count: number) => void;
  getValues: (fields?: string | string[]) => any; // From React Hook Form
  trigger: (fields?: string | string[]) => Promise<boolean>; // From React Hook Form
  formMethods?: any; // To store react-hook-form methods
  setFormMethods: (methods: any) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({ children, totalFormPages }: { children: ReactNode, totalFormPages: number }) => {
  const [formData, setFormData] = useState<FormData>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPagesState] = useState(totalFormPages);
  const [formMethods, setFormMethodsState] = useState<any>(null);

  const updateFormData = (pageData: Partial<FormData>) => {
    setFormData((prevData) => ({ ...prevData, ...pageData }));
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const setTotalPages = (count: number) => {
    setTotalPagesState(count);
  };

  const setFormMethods = (methods: any) => {
    setFormMethodsState(methods);
  }

  const getValues = (fields?: string | string[]) => {
    return formMethods?.getValues(fields);
  }

  const trigger = async (fields?: string | string[]) => {
    return formMethods?.trigger(fields) || Promise.resolve(false);
  }


  return (
    <FormContext.Provider
      value={{
        formData,
        updateFormData,
        currentPage,
        totalPages,
        goToNextPage,
        goToPreviousPage,
        goToPage,
        setTotalPages,
        getValues,
        trigger,
        formMethods,
        setFormMethods
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContextData = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContextData must be used within a FormProvider');
  }
  return context;
};