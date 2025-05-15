'use client';
import React, { useEffect, useState } from 'react';
import { useForm, FormProvider as RHFFormProvider } from 'react-hook-form';
import { Button, Container, Paper, Typography, CircularProgress, Alert } from '@mui/material';
import { FormProvider as AppFormProvider, useFormContextData } from '@/context/FormContext'; // Adjust path

// Import your modules
import { PageWrapper } from '@/components/core/PageWrapper'; // Adjust path
import { NavigationButtons } from '@/components/core/NavigationButtons'; // Adjust path
import { ShortAnswerModule } from '@/components/form-modules/ShortAnswerModule'; // Adjust path
import { NumberAnswerModule } from '@/components/form-modules/NumberAnswerModule'; // Adjust path
import { SingleChoiceCheckboxModule } from '@/components/form-modules/SingleChoiceCheckboxModule'; // Adjust path
import { CourseTimeslotModule } from '@/components/form-modules/CourseTimeslotModule'; // Adjust path
import { EmailModule } from '@/components/form-modules/EmailModule'; // Adjust path
import { PhoneNumberModule } from '@/components/form-modules/PhoneNumberModule';
import { DropdownChoiceModule } from '@/components/form-modules/DropdownChoiceModule';
// ... import other modules
import { CssBaseline } from '@mui/material';

const orgTitle = "嗇色園主辦可觀自然教育中心暨天文館 賽馬會探索科學"
const formTitle = "25-26年度 小學科學外展 報名表格"

// Define a type for your entire form's data
interface MainFormValues {
  // Page 1
  schoolNameChn?: string;
  schoolNameEng?: string;
  isSpecial?: string;
  schoolAddChn?: string;
  schoolAddEng?: string;
  schoolPhone?: number;
  schoolFax?: number;
  teacherNameChn?: string;
  teacherNameEng?: string;
  teacherPhone?: number;
  teacherEmail?: string;
  contactAgree?: string;
  // Page 2
  email?: string;
  appType?: string;
  // Page 3
  outreach1?: {
    theme?: number;
    timeslot?: {
      "one"?: string;
      "two"?: string;
      "three"?: string;
      "four"?: string;
      "five"?: string;
    };
    grade?: number;
    className?: string;
    noOfppl?: number;
  };
  // Page 3 (Review)
  // ... add all fields
}

const formPagesConfig = [
  {
    pageNumber: 1,
    sheetId: 'YOUR_SHEET_ID_1', // For data from this page or group
    fields: [
      'schoolNameChn',
      'schoolNameEng',
      'isSpecial',
      'schoolAddChn',
      'schoolAddEng',
      'schoolPhone',
      'schoolFax',
      'teacherNameChn',
      'teacherNameEng',
      'teacherPhone',
      'teacherEmail',
      'contactAgree'
    ], // Fields on this page for validation trigger
  },
  {
    pageNumber: 2,
    sheetId: 'YOUR_SHEET_ID_1', // Could be same or different
    fields: ['appType'],
  },
  {
    pageNumber: 3,
    sheetId: 'YOUR_SHEET_ID_1', // Could be same or different
    fields: [
      'outreach1.theme',
      'outreach1.timeslot.one',
      'outreach1.timeslot.two',
      'outreach1.timeslot.three',
      'outreach1.timeslot.four',
      'outreach1.timeslot.five',
      'outreach1.grade',
      'outreach1.className',
      'outreach1.noOfppl',
    ],
  },
  {
    pageNumber: 4,
    sheetId: 'YOUR_SHEET_ID_1', // Could be same or different
    fields: [
      'eventTheme',
      'eventTime1',
      'eventTime2',
      'eventTime3',
      'eventTime4',
      'eventTime5',
      'eventGrade',
      'eventClassNo',
      'eventPplNo',
    ],
  },
  // Add more pages
];

const isSpecialChoices = [
  { value: 'no', label: '否 No' },
  { value: 'yes', label: '是 Yes' },
];

const contactAgreeChoices = [
  { value: 'yes', label: '同意 Agree' },
];

const REVIEW_PAGE_NUMBER = formPagesConfig.length + 1;
const TOTAL_PAGES = formPagesConfig.length + 1; // +1 for review page


const FormContent: React.FC = () => {
  const {
    currentPage,
    formData,
    updateFormData,
    goToNextPage,
    goToPage,
    setFormMethods, // From FormContext
  } = useFormContextData();

  const rhfMethods = useForm<MainFormValues>({
    mode: 'onTouched', // 'onTouched' or 'onSubmit'. 'onChange' can be aggressive.
    defaultValues: formData, // Initialize RHF with global state
  });

  const { control, formState: { errors }, getValues, trigger, handleSubmit, reset } = rhfMethods;

  useEffect(() => {
    setFormMethods(rhfMethods); // Make RHF methods available globally via context
  }, [rhfMethods, setFormMethods]);


   useEffect(() => {
    console.log("Syncing RHF with formData. Current Page:", currentPage, "Global formData:", formData);
    // When formData from context changes (e.g., after updateFormData)
    // or when navigating back to a page, reset RHF with the latest global data.
    // This should update field values and clear errors for fields that are now valid.
    reset(formData, {
        keepDirtyValues: true, // Preserve user's unsubmitted changes on the current page if any
        keepErrors: false, // Clear previous errors; new validation will run based on new values
    });
  }, [formData, currentPage, reset]); // Rerun if formData changes OR if currentPage changes


  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  
  // Gets the current page's configuration
  const getCurrentPageConfig = () => formPagesConfig.find(p => p.pageNumber === currentPage);

  // Handles validation and data update for "Next" button on data entry pages
  const handlePageSpecificNext = async () => {
    const currentConfig = getCurrentPageConfig();
    if (!currentConfig) return;

    const fieldsToValidate = currentConfig.fields as (keyof MainFormValues)[];
    console.log(`Page ${currentPage} - Validating fields:`, fieldsToValidate);

    // Trigger validation for only the current page's fields
    const isValid = await trigger(fieldsToValidate.length > 0 ? fieldsToValidate : undefined);
    console.log(`Page ${currentPage} - Validation result:`, isValid, "Errors:", errors);


    if (isValid) {
      const currentPageData: Partial<MainFormValues> = {};
      fieldsToValidate.forEach(field => {
        (currentPageData as any)[field] = getValues(field as Path<MainFormValues>);
      });
      console.log(`Page ${currentPage} - Updating global data with:`, currentPageData);
      updateFormData(currentPageData); // Update global context with current page's data

      // Conditional navigation logic (example, adapt as needed)
      const appTypeValue = getValues("appType");
      const selectedappChoice = appTypeChoices.find(c => c.value === appTypeValue);
      let navigatedConditionally = false;

      // Example: if feedbackType field is on this page and has conditional routing
      if (fieldsToValidate.includes("appType" as keyof MainFormValues) && selectedappChoice?.nextPage && selectedappChoice.nextPage !== currentPage) {
          // Ensure nextPage is different to avoid loop and is a valid page number
          if (selectedappChoice.nextPage <= formPagesConfig.length) {
            console.log(`Page ${currentPage} - Navigating conditionally to page ${selectedappChoice.nextPage}`);
            goToPage(selectedappChoice.nextPage);
            navigatedConditionally = true;
          }
      }

      if (!navigatedConditionally) {
        console.log(`Page ${currentPage} - Navigating to next page.`);
        goToNextPage(); // This will increment currentPage
      }
    } else {
      // Ensure UI updates to show errors if validation fails
      // RHF typically handles this automatically by updating the `errors` object
      console.warn(`Page ${currentPage} - Validation failed. Errors:`, JSON.stringify(errors));
    }
  };

// Handles validation and navigation to the Review page
  const handleReview = async () => {
    const currentConfig = getCurrentPageConfig();
    if (!currentConfig) return;

    const fieldsToValidate = currentConfig.fields as (keyof MainFormValues)[];
    console.log(`Page ${currentPage} (to Review) - Validating fields:`, fieldsToValidate);
    const isValid = await trigger(fieldsToValidate.length > 0 ? fieldsToValidate : undefined);
    console.log(`Page ${currentPage} (to Review) - Validation result:`, isValid);

    if (isValid) {
      const currentPageData: Partial<MainFormValues> = {};
      fieldsToValidate.forEach(field => {
        (currentPageData as any)[field] = getValues(field as Path<MainFormValues>);
      });
      updateFormData(currentPageData);
      console.log(`Page ${currentPage} - Navigating to Review Page.`);
      goToPage(REVIEW_PAGE_NUMBER);
    } else {
      console.warn(`Page ${currentPage} (to Review) - Validation failed. Errors:`, JSON.stringify(errors));
    }
  };

  const onSubmitToGoogleSheets = async (data: MainFormValues) => {
    setIsSubmitting(true);
    setSubmissionStatus(null);
    console.log('Submitting data:', data);

    // Here, you would determine which sheetId to use based on formPagesConfig
    // For simplicity, assuming all data goes to one sheet or you have a primary sheetId
    const targetSheetId = formPagesConfig[0]?.sheetId || 'FALLBACK_SHEET_ID'; // Example

    try {
      const response = await fetch('/api/submit-to-sheet', { // Your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data, sheetId: targetSheetId }), // Send all data
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Submission failed');
      }

      setSubmissionStatus({ type: 'success', message: 'Form submitted successfully!' });
      // Optionally reset form or redirect: reset({}); goToPage(1);
    } catch (error: any) {
      setSubmissionStatus({ type: 'error', message: error.message || 'An error occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const appTypeChoices = [
    { value: 'courses', label: '外展到校課程 | Outreach courses', nextPage: 3}, /* Example: skip to page if needed, or just regular next*/
    { value: 'event', label: '外展 Cool Science Day | Outreach Cool Science Day', nextPage: 2 },
  ];

  const outreachThemes = [
    {value: 1, label: "R1 地球的日與夜",},
    {value: 2, label: "R2 四季之謎：貓貓拯救大作戰 The Mystery of Seasons: Cat Rescue Mission",},
    {value: 3, label: "R3 立竿見影、觀象授時",},
    {value: 4, label: "R4 大行星之旅（課室版） The Planetary Grand Tour",},
    {value: 5, label: "R5 大行星之旅（加長版） The Planetary Grand Tour",},
    {value: 6, label: "R6 太陽的祕密（戶外版） Secrets of Our Sun",},
    {value: 7, label: "R7 小小伽利略",},
    {value: 8, label: "R8 動物隱身術",},
    {value: 9, label: "R9 DeliverBird",},
    {value: 10, label: "R10 花朵解密",},
    {value: 11, label: "R11 生物搜查隊 OR 公民科學家 - 校園動植物搜查?",},
    {value: 12, label: "R12 城市設計師：探究動植物與自然環境的關係",},
    {value: 13, label: "R13 我的理想校園",},
    {value: 14, label: "R14 影子大師",},
    {value: 15, label: "R15 飛嘗航天任務 My Very First Space Mission",},
    {value: 16, label: "R16 星星守護者",},
    {value: 17, label: "R17 機械生物大步走",},
  ]

  const courseTimeslots = {
    "HKP_001": "2025/05/08_AM",
  }


  if (isSubmitting) {
    return <div className="flex justify-center items-center h-screen"><CircularProgress /></div>;
  }

  if (submissionStatus) {
    return (
      <Container maxWidth="sm" className="py-10">
        <Alert severity={submissionStatus.type}>{submissionStatus.message}</Alert>
        {submissionStatus.type === 'success' && (
          <Button onClick={() => { reset({}); goToPage(1); setSubmissionStatus(null); }} className="mt-4">
            Submit Another Response
          </Button>
        )}
      </Container>
    );
  }

  return (
    <RHFFormProvider {...rhfMethods}> {/* Provide RHF methods to children */}
      <form onSubmit={handleSubmit(onSubmitToGoogleSheets)} noValidate>
        <Paper elevation={3} className="p-6 md:p-10 my-10">
          <Typography variant="h6" component="h2" gutterBottom className="text-center">
            {orgTitle}
          </Typography>
          <Typography sx={{ fontWeight: 800 }} variant="h4" component="h1" gutterBottom className="text-center">
            {formTitle}
          </Typography>
          {/* <Typography variant="h6" component="h6" gutterBottom className="text-center">
            Page {currentPage > formPagesConfig.length ? 'Review' : currentPage}
          </Typography> */}

          <PageWrapper pageNumber={1}>
            <Typography variant="h6" gutterBottom>參加學校資料 School info</Typography>
            {/* <GoogleSheetWrapper sheetId="YOUR_SHEET_ID_FOR_PAGE_1"> */}
            <ShortAnswerModule name="schoolNameChn" label="學校名稱（中文）" control={control} errors={errors} />
            <ShortAnswerModule name="schoolNameEng" label="School Name (ENG)" control={control} errors={errors} required />
            <SingleChoiceCheckboxModule
              name="isSpecial"
              label="本校為教育局資助特殊學校。Our school is an aided special school."
              control={control}
              errors={errors} 
              choices={isSpecialChoices}
              required
            />
            <ShortAnswerModule name="schoolAddChn" label="學校地址 （中文）" control={control} errors={errors} />
            <ShortAnswerModule name="schoolAddEng" label="School Address (ENG)" control={control} errors={errors} required />
            <PhoneNumberModule name="schoolPhone" label="學校電話 School phone no." control={control} errors={errors} required />
            <PhoneNumberModule name="schoolFax" label="學校傳真 School Fax no." control={control} errors={errors} required />
            <Typography variant="h6" gutterBottom>負責老師資料 Teacher's contact info </Typography>
            <ShortAnswerModule name="teacherNameChn" label="老師姓名 （中文）" control={control} errors={errors} />
            <ShortAnswerModule name="teacherNameEng" label="Teacher Name (ENG)" control={control} errors={errors} required />
            <PhoneNumberModule name="teacherPhone" label="手提電話 Mobile phone no." control={control} errors={errors} required />
            <EmailModule name="teacherEmail" label="聯絡電郵 Contact email" control={control} errors={errors} required />
            <SingleChoiceCheckboxModule
              name="contactAgree"
              label={"本人同意可觀自然教育中心暨天文館日後以電郵及手提電話短訊聯絡本人，以處理課程報名及協調課程事宜。  I agree to be contacted by HKNEAC via email and text messages regarding course application and implementation."}
              control={control}
              errors={errors}
              choices={contactAgreeChoices}
              required
            />
            {/* </GoogleSheetWrapper> */}
          </PageWrapper>

          <PageWrapper pageNumber={2}>
            <Typography variant="h6" gutterBottom>報名類型  Type of Application</Typography>
            {/* <GoogleSheetWrapper sheetId="YOUR_SHEET_ID_FOR_PAGE_2_OR_SAME"> */}
            <SingleChoiceCheckboxModule
              name="appType"
              label="請選擇報名類型。 Please choose a type of application."
              control={control}
              errors={errors}
              choices={appTypeChoices}
              required
            />
            {/* </GoogleSheetWrapper> */}
          </PageWrapper>

          <PageWrapper pageNumber={3}>
            <Typography variant="h6" gutterBottom>外展到校課程(1) | Outreach courses(1)</Typography>
            {/* <GoogleSheetWrapper sheetId="YOUR_SHEET_ID_FOR_PAGE_2_OR_SAME"> */}
            <DropdownChoiceModule
              name="outreach1.theme"
              label="請選擇課程主題。 Please choose a course theme."
              control={control}
              errors={errors}
              choices={outreachThemes}
              required
            />
            <CourseTimeslotModule
              name="outreach1.timeslot.one"
              label="請選擇課程時段（第一選擇）。 Please choose a course timeslot (1st choice)."
              control={control}
              errors={errors}
              courseTimeslots={courseTimeslots}
              required
            />
            {/* </GoogleSheetWrapper> */}
          </PageWrapper>

          {/* --- Review Page --- */}
          {currentPage === REVIEW_PAGE_NUMBER && (
            <div className="animate-fadeIn">
              <Typography variant="h5" gutterBottom>Review Your Answers</Typography>
              {Object.entries(formData).map(([key, value]) => (
                <div key={key} className="mb-2">
                  <Typography variant="subtitle1" component="span" className="font-semibold">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: </Typography>
                  <Typography variant="body1" component="span">
                    {typeof value === 'object' && value !== null && value instanceof Date
                      ? value.toLocaleDateString()
                      : Array.isArray(value)
                        ? value.join(', ')
                        : String(value)}
                  </Typography>
                </div>
              ))}
              <div className="mt-8 flex justify-between">
                <Button variant="outlined" onClick={() => goToPage(currentPage - 1)}>
                  Back to Edit
                </Button>
                <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                  {isSubmitting ? <CircularProgress size={24} /> : 'Submit Application'}
                </Button>
              </div>
            </div>
          )}

          {/* Navigation (only if not on review page and not submitting) */}
          {currentPage !== REVIEW_PAGE_NUMBER && !isSubmitting && (
            <NavigationButtons
              onNext={handlePageSpecificNext}
              isFirstPage={currentPage === 1}
              isLastPage={currentPage === formPagesConfig.length} // True if current page is the last data entry page
              onReview={handleReview}
            />
          )}
        </Paper>
      </form>
    </RHFFormProvider>
  );
};


// Main exported page component
export default function FormPageContainer() {
  return (
    <AppFormProvider totalFormPages={TOTAL_PAGES}>
      <CssBaseline />
      <Container maxWidth="md">
        <FormContent />
      </Container>
    </AppFormProvider>
  );
}