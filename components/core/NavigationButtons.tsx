// components/core/NavigationButtons.tsx
'use client';
import React from 'react';
import { Button } from '@mui/material';
import { useFormContextData } from '@/context/FormContext'; // Adjust path

interface NavigationButtonsProps {
  onNext?: () => Promise<void>; // Handler for "Next" or "Review" button
  onPrevious?: () => Promise<void>;
  isLastPage?: boolean; // True if this is the last data entry page (leading to Review)
  isFirstPage?: boolean;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onNext,
  onPrevious,
  isLastPage = false,
  isFirstPage = false,
}) => {
  const { goToPreviousPage, currentPage } = useFormContextData();

  const handleNextClick = async () => {
    if (onNext) {
      // onNext will be handlePageSpecificNext or handleReview from FormContent.
      // These functions are responsible for their own validation & data update.
      await onNext();
    }
  };

  const handlePreviousClick = async () => {
    if (onPrevious) {
      await onPrevious(); // Allow custom previous behavior if needed
    } else {
      goToPreviousPage();
    }
  };

  return (
    <div className="mt-8 flex justify-between">
      <Button
        variant="outlined"
        onClick={handlePreviousClick}
        disabled={isFirstPage || currentPage === 1}
        className="rounded-md shadow-sm hover:shadow-md transition-shadow"
      >
        Previous
      </Button>

      {/* This button's text and action are determined by FormContent */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleNextClick}
        className="rounded-md shadow-sm hover:shadow-md transition-shadow"
      >
        {isLastPage ? "Review Your Answers" : "Next"}
      </Button>
    </div>
  );
};
