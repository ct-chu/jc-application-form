import React, { ReactNode } from 'react';
import { useFormContextData } from '@/context/FormContext'; // Adjust path

interface PageWrapperProps {
  children: ReactNode;
  pageNumber: number;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children, pageNumber }) => {
  const { currentPage } = useFormContextData();

  if (currentPage !== pageNumber) {
    return null;
  }

  return <div className="p-4 md:p-8 animate-fadeIn">{children}</div>;
};