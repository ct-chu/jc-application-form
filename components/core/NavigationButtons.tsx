'use client';
import React from 'react';
import { Button } from '@mui/material';
import { useFormContextData } from '@/context/FormContext'; // Adjust path
import { useForm } from 'react-hook-form'; // We need form instance here

interface NavigationButtonsProps {
  onNext?: () => Promise<boolean | void>; // Async to allow for validation
  onPrevious?: () => void;
  isLastPage?: boolean;
  isFirstPage?: boolean;
  onReview?: () => Promise<boolean | void>;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onNext,
  onPrevious,
  isLastPage = false,
  isFirstPage = false,
  onReview,
}) => {
  const { goToNextPage, goToPreviousPage, currentPage, totalPages, trigger, getValues, updateFormData } = useFormContextData();

  const handleNext = async () => {
    // Trigger validation for the current page's fields
    // This assumes fields are uniquely named or grouped for the current page
    // You'll need a strategy to know which fields belong to the current page.
    // For simplicity, we might trigger all fields and rely on RHF's overall validity.
    const isValid = await trigger();


    if (isValid) {
      // Update global form data with current page's values from RHF
      // This is a bit tricky if RHF controls the whole form.
      // A better approach might be to pass the RHF 'getValues' to the context or update on field blur/change.
      // For now, let's assume updateFormData is called appropriately within each field or on next.
      // updateFormData(getValues()); // Potentially update all values

      if (onNext) {
        await onNext();
      } else {
        goToNextPage();
      }
    } else {
      console.log("Validation failed");
    }
  };

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
    } else {
      goToPreviousPage();
    }
  };

  const handleReview = async () => {
    const isValid = await trigger();
    if (isValid) {
      if (onReview) {
        await onReview();
      }
    } else {
      console.log("Validation failed, cannot proceed to review.");
    }
  }

  return (
    <div className="mt-8 flex justify-between">
      <Button
        variant="outlined"
        onClick={handlePrevious}
        disabled={isFirstPage || currentPage === 1}
      >
        Previous
      </Button>

      {currentPage < totalPages && !isLastPage && ( // Not the review page yet
        <Button variant="contained" color="primary" onClick={handleNext}>
          Next
        </Button>
      )}
      {isLastPage && onReview && ( // On the actual last data entry page, show "Review"
         <Button variant="contained" color="primary" onClick={handleReview}>
          Review
        </Button>
      )}
    </div>
  );
};