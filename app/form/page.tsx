/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react/no-unescaped-entities */
'use client';
import React, { useEffect, useState } from 'react';
import { useForm, FormProvider as RHFFormProvider, Path, FieldValues } from 'react-hook-form';
import { Button, Container, Paper, Typography, CircularProgress, Alert } from '@mui/material';
import { FormProvider as AppFormProvider, useFormContextData } from '@/context/FormContext'; // Adjust path

// Import your modules
import { PageWrapper } from '@/components/core/PageWrapper'; // Adjust path
// import { GoogleSheetWrapper } from '@/components/core/GoogleSheetWrapper';
import { NavigationButtons } from '@/components/core/NavigationButtons'; // Adjust path
import { ShortAnswerModule } from '@/components/form-modules/ShortAnswerModule'; // Adjust path
import { NumberAnswerModule } from '@/components/form-modules/NumberAnswerModule'; // Adjust path
import { SingleChoiceCheckboxModule } from '@/components/form-modules/SingleChoiceCheckboxModule'; // Adjust path
import { JcCourseTimeslotModule } from '@/components/form-modules/JcCourseTimeslotModule'; // Adjust path
import { EmailModule } from '@/components/form-modules/EmailModule'; // Adjust path
import { PhoneNumberModule } from '@/components/form-modules/PhoneNumberModule';
import { DropdownChoiceModule } from '@/components/form-modules/DropdownChoiceModule';
// ... import other modules
import { CssBaseline } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// const orgTitle = "嗇色園主辦可觀自然教育中心暨天文館 賽馬會探索科學"
// const orgTitleEng = "Ho Koon Nature Education Cum Astronomical Centre  JC Cool Science"
const formTitle = "25-26年度 小學科學外展 報名表格"
const formTitleEng = "Application for 25-26 Primary Science Outreach activities"
const SHEET_ID_1 = process.env.NEXT_PUBLIC_SHEET_ID_1

interface outreachDetail extends FieldValues {
  theme?: number;
    timeslot?: {
      "1"?: string;
      "2"?: string;
      "3"?: string;
      "4"?: string;
      "5"?: string;
    };
    grade?: number;
    whichClass?: string;
    noOfPpl?: number;
}

// Define a type for your entire form's data
interface MainFormValues extends FieldValues {
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
  outreach1?: outreachDetail;
  // Page 4
  outreach2?: outreachDetail;
  // Page 5
  outreach3?: outreachDetail;
  // Page 6
  outreach4?: outreachDetail;
  // Page 7
  outreach5?: outreachDetail;
  // Page 8
  outreach6?: outreachDetail;
  // Page 9
  event?: outreachDetail;
  // Page 10 (Review)
  // ... add all fields
}

const outreachs = [
  {n: 1, sheetId: `${SHEET_ID_1}`},
  {n: 2, sheetId: `${SHEET_ID_1}`},
  {n: 3, sheetId: `${SHEET_ID_1}`},
  {n: 4, sheetId: `${SHEET_ID_1}`},
  {n: 5, sheetId: `${SHEET_ID_1}`},
  {n: 6, sheetId: `${SHEET_ID_1}`},
]

const formPagesConfig = [
  {
    pageNumber: 1,
    sheetId: SHEET_ID_1, // For data from this page or group
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
    sheetId: SHEET_ID_1, // Could be same or different
    fields: ['appType'],
  },
  {
    pageNumber: 3,
    sheetId: SHEET_ID_1,
    fields: [
      'outreach1.theme',
      'outreach1.timeslot[1]',
      'outreach1.timeslot[2]',
      'outreach1.timeslot[3]',
      'outreach1.timeslot[4]',
      'outreach1.timeslot[5]',
      'outreach1.grade',
      'outreach1.whichClass',
      'outreach1.noOfPpl',
    ],
  },
  {
    pageNumber: 4,
    sheetId: SHEET_ID_1,
    fields: [
      'outreach2.theme',
      'outreach2.timeslot[1]',
      'outreach2.timeslot[2]',
      'outreach2.timeslot[3]',
      'outreach2.timeslot[4]',
      'outreach2.timeslot[5]',
      'outreach2.grade',
      'outreach2.whichClass',
      'outreach2.noOfPpl',
    ],
  },
  {
    pageNumber: 5,
    sheetId: SHEET_ID_1,
    fields: [
      'outreach3.theme',
      'outreach3.timeslot[1]',
      'outreach3.timeslot[2]',
      'outreach3.timeslot[3]',
      'outreach3.timeslot[4]',
      'outreach3.timeslot[5]',
      'outreach3.grade',
      'outreach3.whichClass',
      'outreach3.noOfPpl',
    ],
  },
  {
    pageNumber: 6,
    sheetId: SHEET_ID_1,
    fields: [
      'outreach4.theme',
      'outreach4.timeslot[1]',
      'outreach4.timeslot[2]',
      'outreach4.timeslot[3]',
      'outreach4.timeslot[4]',
      'outreach4.timeslot[5]',
      'outreach4.grade',
      'outreach4.whichClass',
      'outreach4.noOfPpl',
    ],
  },
  {
    pageNumber: 7,
    sheetId: SHEET_ID_1,
    fields: [
      'outreach5.theme',
      'outreach5.timeslot[1]',
      'outreach5.timeslot[2]',
      'outreach5.timeslot[3]',
      'outreach5.timeslot[4]',
      'outreach5.timeslot[5]',
      'outreach5.grade',
      'outreach5.whichClass',
      'outreach5.noOfPpl',
    ],
  },
  {
    pageNumber: 8,
    sheetId: SHEET_ID_1,
    fields: [
      'outreach6.theme',
      'outreach6.timeslot[1]',
      'outreach6.timeslot[2]',
      'outreach6.timeslot[3]',
      'outreach6.timeslot[4]',
      'outreach6.timeslot[5]',
      'outreach6.grade',
      'outreach6.whichClass',
      'outreach6.noOfPpl',
    ],
  },
  {
    pageNumber: 9,
    sheetId: SHEET_ID_1,
    fields: [
      'event.theme',
      'event.timeslot[1]',
      'event.timeslot[2]',
      'event.timeslot[3]',
      'event.timeslot[4]',
      'event.timeslot[5]',
      'event.grade',
      'event.whichClass',
      'event.noOfPpl',
    ],
  },
  // Add more pages
];

//labels for review page
let labels = {
  'schoolNameChn': "學校名稱（中文）",
  'schoolNameEng': "School name (ENG)",
  'isSpecial': "本校為教育局資助特殊學校。Our school is an aided special school.",
  'schoolAddChn': "學校地址 （中文）",
  'schoolAddEng': "School address (ENG)",
  'schoolPhone': "學校電話 School phone no.",
  'schoolFax': "學校傳真 School fax no.",
  'teacherNameChn': "老師姓名 （中文）",
  'teacherNameEng': "Teacher name (ENG)",
  'teacherPhone': "手提電話 Mobile phone no.",
  'teacherEmail': "聯絡電郵 Contact email",
  'contactAgree': "同意聯絡本人 Agreed to be contacted",
  'appType': "報名類型  Type of application",
  'event.theme': `活動主題 Event theme`,
  'event.timeslot[1]': `活動時段（第一選擇） Event timeslot (1st choice)`,
  'event.timeslot[2]': `活動時段（第二選擇） Event timeslot (2nd choice)`,
  'event.timeslot[3]': `活動時段（第三選擇） Event timeslot (3rd choice)`,
  'event.timeslot[4]': `活動時段（第四選擇） Event timeslot (4th choice)`,
  'event.timeslot[5]': `活動時段（第五選擇） Event timeslot (5th choice)`,
  'event.grade': `學生年級 Student grade`,
  'event.whichClass': `班別 Class`,
  'event.noOfPpl': `學生人數 No. of students`,
}

// outreach courses labels for review page
for (let i = 0; i < 7; i++) {
  labels = Object.assign({[`outreach${i}.theme`] : `課程主題 Course theme` },labels)
  labels = Object.assign({[`outreach${i}.timeslot[1]`] : `課程時段（第一選擇） Course timeslot (1st choice)` },labels)
  labels = Object.assign({[`outreach${i}.timeslot[2]`] : `課程時段（第二選擇） Course timeslot (2nd choice)` },labels)
  labels = Object.assign({[`outreach${i}.timeslot[3]`] : `課程時段（第三選擇） Course timeslot (3rd choice)` },labels)
  labels = Object.assign({[`outreach${i}.timeslot[4]`] : `課程時段（第四選擇） Course timeslot (4th choice)` },labels)
  labels = Object.assign({[`outreach${i}.timeslot[5]`] : `課程時段（第五選擇） Course timeslot (5th choice)` },labels)
  labels = Object.assign({[`outreach${i}.grade`] : `學生年級 Student grade` },labels)
  labels = Object.assign({[`outreach${i}.whichClass`] : `班別 Class` },labels)
  labels = Object.assign({[`outreach${i}.noOfPpl`] : `學生人數 No. of students` },labels)
}

const isSpecialChoices = [
  { value: 'no', label: '否 No' },
  { value: 'yes', label: '是 Yes' },
];

const contactAgreeChoices = [
  { value: 'yes', label: '同意 Agree' },
];

const appTypeChoices = [
  { value: 'courses', label: '外展到校課程 | Outreach courses', nextPage: 3}, /* Example: skip to page if needed, or just regular next*/
  { value: 'event', label: '外展 Cool Science Day | Outreach Cool Science Day', nextPage: 9 },
];

const studentgrades = [
  {value: 1, label: "小一 P.1",},
  {value: 2, label: "小二 P.2",},
  {value: 3, label: "小三 P.3",},
  {value: 4, label: "小四 P.4",},
  {value: 5, label: "小五 P.5",},
  {value: 6, label: "小六 P.6",},
]

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

const eventThemes = [
  {value: 1, label: "Theme1",},
  {value: 2, label: "Theme2",},
  {value: 3, label: "Theme3",},
  {value: 4, label: "Theme4",},
  {value: 5, label: "Theme5",},
]

const eventTimeslots = [
  "2025/11/04_AM",
  "2025/11/04_PM",
  "2025/11/07_AM",
  "2025/11/07_PM",
  "2025/11/11_AM",
  "2025/11/11_PM",
  "2025/11/20_AM",
  "2025/11/20_PM",
  "2025/11/27_AM",
  "2025/11/27_PM",
  "2026/02/25_AM",
  "2026/02/25_PM",
  "2026/06/22_AM",
  "2026/06/23_AM",
  "2026/06/24_AM",
  "2026/06/25_AM",
  "2026/06/26_AM",
  "2026/07/03_AM",
  "2026/07/06_AM",
  "2026/07/07_AM",
  "2026/07/08_AM",
  "2026/07/09_AM",
  "2026/07/10_AM",
  "2026/07/13_AM",
  "2026/07/14_AM",
  ]

const courseTimeslots = [
  "2025/09/16_AM",
  "2025/09/16_PM",
  "2025/09/17_AM",
  "2025/09/17_PM",
  "2025/09/18_AM",
  "2025/09/18_PM",
  "2025/09/19_AM",
  "2025/09/19_PM",
  "2025/09/22_AM",
  "2025/09/22_PM",
  "2025/09/23_AM",
  "2025/09/23_PM",
  "2025/09/24_AM",
  "2025/09/24_PM",
  "2025/09/25_AM",
  "2025/09/25_PM",
  "2025/09/29_AM",
  "2025/09/29_PM",
  "2025/09/30_AM",
  "2025/09/30_PM",
  "2025/10/09_AM",
  "2025/10/09_PM",
  "2025/10/13_AM",
  "2025/10/13_PM",
  "2025/10/14_AM",
  "2025/10/14_PM",
  "2025/10/15_AM",
  "2025/10/15_PM",
  "2025/10/16_AM",
  "2025/10/16_PM",
  "2025/10/20_AM",
  "2025/10/20_PM",
  "2025/10/21_AM",
  "2025/10/21_PM",
  "2025/10/22_AM",
  "2025/10/22_PM",
  "2025/10/23_AM",
  "2025/10/23_PM",
  "2025/10/27_AM",
  "2025/10/27_PM",
  "2025/10/28_AM",
  "2025/10/28_PM",
  "2025/11/03_AM",
  "2025/11/03_PM",
  "2025/11/05_AM",
  "2025/11/05_PM",
  "2025/11/06_AM",
  "2025/11/06_PM",
  "2025/11/10_AM",
  "2025/11/10_PM",
  "2025/11/12_AM",
  "2025/11/12_PM",
  "2025/11/17_AM",
  "2025/11/17_PM",
  "2025/11/18_AM",
  "2025/11/18_PM",
  "2025/11/19_AM",
  "2025/11/19_PM",
  "2025/11/21_AM",
  "2025/11/21_PM",
  "2025/11/24_AM",
  "2025/11/24_PM",
  "2025/11/25_AM",
  "2025/11/25_PM",
  "2025/11/26_AM",
  "2025/11/26_PM",
  "2025/12/01_AM",
  "2025/12/01_PM",
  "2025/12/02_AM",
  "2025/12/02_PM",
  "2025/12/03_AM",
  "2025/12/03_PM",
  "2025/12/04_AM",
  "2025/12/04_PM",
  "2025/12/05_AM",
  "2025/12/05_PM",
  "2025/12/08_AM",
  "2025/12/08_PM",
  "2025/12/09_AM",
  "2025/12/09_PM",
  "2025/12/10_AM",
  "2025/12/10_PM",
  "2025/12/11_AM",
  "2025/12/11_PM",
  "2025/12/12_AM",
  "2025/12/12_PM",
  "2025/12/15_AM",
  "2025/12/15_PM",
  "2025/12/16_AM",
  "2025/12/16_PM",
  "2025/12/17_AM",
  "2025/12/17_PM",
  "2026/01/12_AM",
  "2026/01/12_PM",
  "2026/01/13_AM",
  "2026/01/13_PM",
  "2026/01/14_AM",
  "2026/01/14_PM",
  "2026/01/15_AM",
  "2026/01/15_PM",
  "2026/01/16_AM",
  "2026/01/16_PM",
  "2026/01/19_AM",
  "2026/01/19_PM",
  "2026/01/20_AM",
  "2026/01/20_PM",
  "2026/01/26_AM",
  "2026/01/26_PM",
  "2026/01/27_AM",
  "2026/01/27_PM",
  "2026/02/04_AM",
  "2026/02/04_PM",
  "2026/02/05_AM",
  "2026/02/05_PM",
  "2026/02/10_AM",
  "2026/02/10_PM",
  "2026/02/11_AM",
  "2026/02/11_PM",
  "2026/02/12_AM",
  "2026/02/12_PM",
  "2026/02/26_AM",
  "2026/02/26_PM",
  "2026/03/02_AM",
  "2026/03/02_PM",
  "2026/03/03_AM",
  "2026/03/03_PM",
  "2026/03/05_AM",
  "2026/03/05_PM",
  "2026/03/10_AM",
  "2026/03/10_PM",
  "2026/03/11_AM",
  "2026/03/11_PM",
  "2026/03/12_AM",
  "2026/03/12_PM",
  "2026/03/16_AM",
  "2026/03/16_PM",
  "2026/03/17_AM",
  "2026/03/17_PM",
  "2026/03/18_AM",
  "2026/03/18_PM",
  "2026/03/19_AM",
  "2026/03/19_PM",
  "2026/03/23_AM",
  "2026/03/23_PM",
  "2026/03/24_AM",
  "2026/03/24_PM",
  "2026/03/25_AM",
  "2026/03/25_PM",
  "2026/03/26_AM",
  "2026/03/26_PM",
  "2026/03/30_AM",
  "2026/03/30_PM",
  "2026/03/31_AM",
  "2026/03/31_PM",
  "2026/04/09_AM",
  "2026/04/09_PM",
  "2026/04/10_AM",
  "2026/04/10_PM",
  "2026/04/14_AM",
  "2026/04/14_PM",
  "2026/04/15_AM",
  "2026/04/15_PM",
  "2026/04/16_AM",
  "2026/04/16_PM",
  "2026/04/17_AM",
  "2026/04/17_PM",
  "2026/04/20_AM",
  "2026/04/20_PM",
  "2026/04/21_AM",
  "2026/04/21_PM",
  "2026/04/22_AM",
  "2026/04/22_PM",
  "2026/04/23_AM",
  "2026/04/23_PM",
  "2026/04/24_AM",
  "2026/04/24_PM",
  "2026/04/27_AM",
  "2026/04/27_PM",
  "2026/04/28_AM",
  "2026/04/28_PM",
  "2026/04/29_AM",
  "2026/04/29_PM",
  "2026/05/05_AM",
  "2026/05/05_PM",
  "2026/05/06_AM",
  "2026/05/06_PM",
  "2026/05/07_AM",
  "2026/05/07_PM",
  "2026/05/08_AM",
  "2026/05/08_PM",
  "2026/05/11_AM",
  "2026/05/11_PM",
  "2026/05/12_AM",
  "2026/05/12_PM",
  "2026/05/13_AM",
  "2026/05/13_PM",
  "2026/05/15_AM",
  "2026/05/15_PM",
  "2026/05/18_AM",
  "2026/05/18_PM",
  "2026/05/19_AM",
  "2026/05/19_PM",
  "2026/06/15_AM",
  "2026/06/15_PM",
  "2026/06/16_AM",
  "2026/06/16_PM",
  "2026/06/17_AM",
  "2026/06/17_PM",
  "2026/07/02_AM",
  "2026/07/02_PM",
]

const REVIEW_PAGE_NUMBER = formPagesConfig.length + 1;
const TOTAL_PAGES = formPagesConfig.length + 1; // +1 for review page


const FormContent: React.FC = () => {
  const {
    currentPage,
    formData,
    updateFormData,
    goToPreviousPage,
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

  const [sheetName, setSheetName] = useState("response")
  
  const [reviewFormData, setReviewFormData] = useState(formData);

  const [jumpToReview, setJumpToReview] = useState(false);
  const NextJumpToReview = () =>{
    setJumpToReview(true)
    return null
  }
  
  // Gets the current page's configuration
  const getCurrentPageConfig = () => formPagesConfig.find(p => p.pageNumber === currentPage);

  // Handles validation and data update for "Next" button on data entry pages
  const handlePageSpecificNext = async () => {
    const currentConfig = getCurrentPageConfig();
    if (!currentConfig) return;

    // The `fields` from `formPagesConfig` are `readonly string[]` due to `as const`.
    // These strings should be valid FieldPath<MainFormValues>.
    const fieldsToValidateFromConfig = currentConfig.fields;
    // Convert to a mutable string array to satisfy some overloads of `trigger` more easily.
    // This is safe because FieldPath<MainFormValues> resolves to strings.
    const fieldsToValidate: string[] = [...fieldsToValidateFromConfig];
    console.log(`Page ${currentPage} - Validating fields:`, fieldsToValidate);
    const argumentForTrigger = fieldsToValidate.length > 0 ? fieldsToValidate : undefined;
    const isValid = await trigger(argumentForTrigger);
    console.log(`Page ${currentPage} - Validation result:`, isValid, "Errors:", JSON.stringify(errors));

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
      if (fieldsToValidate.includes("appType") && selectedappChoice?.nextPage && selectedappChoice.nextPage !== currentPage) {
          // Ensure nextPage is different to avoid loop and is a valid page number
          if (selectedappChoice.nextPage <= formPagesConfig.length) {
            console.log(`Page ${currentPage} - Navigating conditionally to page ${selectedappChoice.nextPage}`);
            goToPage(selectedappChoice.nextPage);
            navigatedConditionally = true;
          }
      }

      if (jumpToReview && currentPage !== REVIEW_PAGE_NUMBER) {
        console.log(`Page ${currentPage} - Navigating conditionally to last page ${REVIEW_PAGE_NUMBER}`);
        setReviewFormData(formData)
        console.log("reviewFormData", reviewFormData);
        formData.appType == "event" ? setSheetName("event") : formData.appType == "courses" ? setSheetName("courses") : null;
        console.log("setSheetName", sheetName)
        goToPage(REVIEW_PAGE_NUMBER);
        navigatedConditionally = true;
      }

      if (!navigatedConditionally) {
        console.log(`Page ${currentPage} - Navigating to next page.`);
        if (currentPage+1 == REVIEW_PAGE_NUMBER) {
          setReviewFormData(formData)
          console.log("reviewFormData", reviewFormData)
          formData.appType == "event" ? setSheetName("event") : formData.appType == "courses" ? setSheetName("courses") : null;
          console.log("formData.appType", formData.appType)
          console.log("setSheetName", sheetName)
        }
        goToNextPage(); // This will increment currentPage
      }
    } else {
      // Ensure UI updates to show errors if validation fails
      // RHF typically handles this automatically by updating the `errors` object
      console.warn(`Page ${currentPage} - Validation failed. Errors:`, JSON.stringify(errors));
    }
  };

  const handlePageSpecificPrevious = async () => {
  if (formData.appType == "event") {
    if (currentPage == 9){
      goToPage(2);
    } else goToPreviousPage();
  } else if (formData.appType == "courses"){
    if (currentPage == REVIEW_PAGE_NUMBER) {
      goToPage(REVIEW_PAGE_NUMBER - 2);
    } else goToPreviousPage();
  } else goToPreviousPage();
  };

// Handles validation and navigation to the Review page
  const handleReview = async () => {
    const currentConfig = getCurrentPageConfig();
    if (!currentConfig) return;

    // The `fields` from `formPagesConfig` are `readonly string[]` due to `as const`.
    // These strings should be valid FieldPath<MainFormValues>.
    const fieldsToValidateFromConfig = currentConfig.fields;
    // Convert to a mutable string array to satisfy some overloads of `trigger` more easily.
    // This is safe because FieldPath<MainFormValues> resolves to strings.
    const fieldsToValidate: string[] = [...fieldsToValidateFromConfig];
    console.log(`Page ${currentPage} (to Review) - Validating fields:`, fieldsToValidate);
    const argumentForTrigger = fieldsToValidate.length > 0 ? fieldsToValidate : undefined;
    const isValid = await trigger(argumentForTrigger);
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
    const targetSheetId = formPagesConfig[0]?.sheetId || SHEET_ID_1; // Example

    try {
      const response = await fetch('/api/submit-to-sheet', { // Your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          { data, sheetId: targetSheetId, sheetName: sheetName },
          (k, v) => v === undefined ? null : v ), // replace undefined with null so that all columns will be sent
          // Send all data
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Submission failed');
      }

      setSubmissionStatus({ type: 'success', message: '你已成功遞交表格。Form submitted successfully.' });
      // Optionally reset form or redirect: reset({}); goToPage(1);
    } catch (error: any) {
      setSubmissionStatus({ type: 'error', message: error.message || '發生錯誤。An error occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <Typography sx={{ fontWeight: 800 }} variant="h4" component="h1" gutterBottom className="text-center">
            {formTitle}
          </Typography>
          <Typography sx={{ fontWeight: 800 }} variant="h6" component="h2" gutterBottom className="text-center">
            {formTitleEng}
          </Typography>
          {/* <Typography variant="h6" component="h6" gutterBottom className="text-center">
            Page {currentPage > formPagesConfig.length ? 'Review' : currentPage}
          </Typography> */}

          <PageWrapper pageNumber={1}>
            <Typography variant="body1" fontSize="1rem" color="#4c566a">
              注意事項 Notices<br />
              1. 所有資料必須填寫。All data should be filled in.<br />
              2. 若錯漏填報資料, 可導致申請不被考慮。Missing or incorrect data could lead to rejection of the application.<br />
              3. 申請人所提供的資料將予保密，並只作申請有關課程用途。 All data will remain confidential and used only for course application.
            </Typography>
            <Typography align="center" variant="h5" className='pt-4 pb-3' fontWeight={700} color="#2e3440" gutterBottom>參加學校資料 School info</Typography>
            {/* <GoogleSheetWrapper sheetId={SHEET_ID_1} sheetName={sheetName}> */}
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
            <Typography align="center" variant="h5" className='pt-5 pb-3' fontWeight={700} color="#2e3440" gutterBottom>負責老師資料 Teacher's contact info </Typography>
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
            <Typography variant="body1" fontSize="1rem" color="#4c566a" className="pb-5">
              每間學校可在 25-26年度<strong>「外展到校課程」</strong>和<strong>「 外展Cool Science Day 」</strong>之間 <u><strong>選擇其一，不可重複</strong></u>。<br />
              若選擇 <strong>「外展到校課程」</strong> ，學校可以為 <u><strong>最多6班</strong></u> 學生報名課程。<br />
              若選擇 <strong>「 外展Cool Science Day 」</strong> ，學校可以為 <u><strong>最多1次</strong></u> 活動報名，大約能讓一級學生參加（因學生人數而異）。<br />
              <br />
              In the 25-26 school year,  each school can make <u><strong>one choice, without repetition</strong></u>, between <strong>"Outreach courses"</strong> and <strong>"Outreach Cool Science Day"</strong>.<br />
              If <strong>"Outreach courses"</strong>  is chosen, the school can apply for a <u><strong>maximum of 6 classes</strong></u> of students.<br />
              If <strong>"Outreach Cool Science Day"</strong> is chosen, the school can apply for a <u><strong>maximum of 1 event</strong></u>, and roughly 1 grade of students would be able to participate (subject to change according to the no. of students in a grade).
            </Typography>
            <Typography align="center" variant="h5" className='pb-3' fontWeight={700} color="#2e3440" gutterBottom>報名類型  Type of Application</Typography>
            {/* <GoogleSheetWrapper sheetId={SHEET_ID_1} sheetName={sheetName}> */}
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

          {outreachs.map((outreach) => (
            <PageWrapper pageNumber={outreach.n + 2} key={`outreach-page-${outreach.n}`}>
              {/* <GoogleSheetWrapper sheetId={outreach.sheetId} sheetName={sheetName}> */}
                <Typography align="center" variant="h5" className='pb-3' fontWeight={700} color="#2e3440" gutterBottom>
                  外展到校課程({outreach.n})<br />
                  Outreach courses ({outreach.n})
                </Typography>
                <Typography variant="h6" className='pb-3 pt-5' gutterBottom>報名須知 Notice for application</Typography>
                <Accordion defaultExpanded={outreach.n == 1 ? true : false }>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`outreach${outreach.n}-theme-content`}
                    id="outreach${outreach.n}-theme-content-header"
                  >
                    <Typography variant="body1" fontWeight={500} gutterBottom>課程主題列表 List of course themes</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1" fontSize="1rem" color="#4c566a">
                      請按以下 URL 以閱讀課程主題列表與詳細介紹。<br/>
                      Please refer to the URL below for the list of course themes and details.
                    </Typography>
                  </AccordionDetails>
                  <AccordionActions sx={{ justifyContent: 'flex-start' }}>
                    <Button>URL</Button>
                  </AccordionActions>
                </Accordion>
                <Accordion defaultExpanded={outreach.n == 1 ? true : false }>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`outreach${outreach.n}-timeslot-content`}
                    id="outreach${outreach.n}-timeslot-content-header"
                  >
                    <Typography variant="body1" fontWeight={500} gutterBottom>上課時段列表 List of course timeslots</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1" fontSize="1rem" color="#4c566a">
                      外展課程標準長度為70分鐘（2課節）或105分鐘（3課節）。活動時段分為上午（xx:xx 至 xx:xx 之間）或下午 （xx:xx 至 xx:xx 之間）。<br/>
                      The standard length for outreach courses are 70 minutes (2 sessions) or 105 minutes (3 sessions). Timeslots for the event are separated into 2 types: AM (between xx:xx and xx:xx) or PM (between xx:xx and xx:xx).<br/>
                      <br/>
                      學校需為每個課程選擇5個上課時段。如該課程申請成功，上課時間將按剩餘時段空缺及學校的選擇次序分配。<br/>
                      Each school should choose 5 course timeslots for a course application. If the course application is accepted, course time will be assigned according to availability and school's preferences.<br/>
                      <br/>
                      在下面的日期選擇器中，有AM或PM時段可選的日子會以綠色圓圈標記。<br />
                      In the date selector below, dates with AM and/or PM timeslot available are marked in green circles.<br />
                      <br />
                      請按以下 URL 確認上課時段列表。<br/>
                      Please refer to the URL below for the list of course timeslots.<br/>
                    </Typography>
                  </AccordionDetails>
                  <AccordionActions sx={{ justifyContent: 'flex-start' }}>
                    <Button>URL</Button>
                  </AccordionActions>
                </Accordion>
                <Typography variant="h6" className='pb-3 pt-5' gutterBottom>課程資料 Course Details</Typography>
                <DropdownChoiceModule
                  name={`outreach${outreach.n.toString()}.theme`}
                  label="請選擇課程主題。 Please choose a course theme."
                  control={control}
                  errors={errors}
                  choices={outreachThemes}
                  required
                />
                <JcCourseTimeslotModule
                  name={`outreach${outreach.n.toString()}.timeslot[1]`}
                  label="請選擇課程時段（第一選擇）。 Please choose a course timeslot (1st choice)."
                  control={control}
                  errors={errors}
                  jcTimeslots={courseTimeslots}
                  required
                />
                <JcCourseTimeslotModule
                  name={`outreach${outreach.n.toString()}.timeslot[2]`}
                  label="請選擇課程時段（第二選擇）。 Please choose a course timeslot (2nd choice)."
                  control={control}
                  errors={errors}
                  jcTimeslots={courseTimeslots}
                  required
                />
                <JcCourseTimeslotModule
                  name={`outreach${outreach.n.toString()}.timeslot[3]`}
                  label="請選擇課程時段（第三選擇）。 Please choose a course timeslot (3rd choice)."
                  control={control}
                  errors={errors}
                  jcTimeslots={courseTimeslots}
                  required
                />
                <JcCourseTimeslotModule
                  name={`outreach${outreach.n.toString()}.timeslot[4]`}
                  label="請選擇課程時段（第四選擇）。 Please choose a course timeslot (4th choice)."
                  control={control}
                  errors={errors}
                  jcTimeslots={courseTimeslots}
                  required
                />
                <JcCourseTimeslotModule
                  name={`outreach${outreach.n.toString()}.timeslot[5]`}
                  label="請選擇課程時段（第五選擇）。 Please choose a course timeslot (5th choice)."
                  control={control}
                  errors={errors}
                  jcTimeslots={courseTimeslots}
                  required
                />
                <Typography variant="h6" className='pb-3' gutterBottom>學生資料 Student Details</Typography>
                <SingleChoiceCheckboxModule
                  name={`outreach${outreach.n.toString()}.grade`}
                  label="學生年級 Student grade"
                  control={control}
                  errors={errors}
                  choices={studentgrades}
                  required
                />
                <ShortAnswerModule name={`outreach${outreach.n.toString()}.whichClass`} label="班別 Class" control={control} errors={errors} required />
                <NumberAnswerModule name={`outreach${outreach.n.toString()}.noOfPpl`} label="學生人數 No. of students" min={10} max={40} control={control} errors={errors} required />
                {outreach.n == outreachs.length? <NextJumpToReview /> :null}
              {/* </GoogleSheetWrapper> */}
            </PageWrapper>
          ))}

          {/* --- Page for outreach--- */}
          <PageWrapper pageNumber={9}>
            {/* <GoogleSheetWrapper sheetId="SHEET_ID_1" sheetName={sheetName}> */}
              <Typography align="center" variant="h5" className='pb-3' fontWeight={700} color="#2e3440" gutterBottom>
                  外展 Cool Science Day<br />
                  Outreach Cool Science Day
                </Typography>
                <Typography variant="h6" className='pb-3 pt-5' gutterBottom>報名須知 Notice for application</Typography>
                <Accordion defaultExpanded>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`event-theme-content`}
                    id="event-theme-content-header"
                  >
                    <Typography variant="body1" fontWeight={500} gutterBottom>活動主題列表 List of event themes</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1" fontSize="1rem" color="#4c566a">
                      請按以下 URL 確認活動主題列表與詳細介紹。<br/>
                      Please refer to the URL below for the list of event themes and details.
                    </Typography>
                  </AccordionDetails>
                  <AccordionActions sx={{ justifyContent: 'flex-start' }}>
                    <Button>URL</Button>
                  </AccordionActions>
                </Accordion>
                <Accordion defaultExpanded>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`event-timeslot-content`}
                    id="event-timeslot-content-header"
                  >
                    <Typography variant="body1" fontWeight={500} gutterBottom>活動時段列表 List of event timeslots</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1" fontSize="1rem" color="#4c566a">
                      Cool Science Day 活動標準長度為 x 小時。活動時段分為上午（xx:xx 至 xx:xx 之間）或下午 （xx:xx 至 xx:xx 之間）。<br/>
                      The standard length for "Cool Science Day" event is x hours. Timeslots for the event are separated into 2 types: AM (between xx:xx and xx:xx) or PM (between xx:xx and xx:xx).<br/>

                      學校需為每個活動選擇5個時段。如該活動申請成功， 活動時間將按剩餘時段空缺及學校的選擇次序分配。<br/>
                      Each school should choose 5 event timeslots for an event application. If the event application is accepted, event time will be assigned according to availability and school's preferences.<br/>
                      <br/>
                      在下面的日期選擇器中，有AM或PM時段可選的日子會以綠色圓圈標記。<br />
                      In the date selector below, dates with AM and/or PM timeslot available are marked in green circles.<br />
                      <br />
                      請按以下 URL 確認活動時段列表。<br/>
                      Please refer to the URL below for the list of event timeslots.<br/>
                    </Typography>
                  </AccordionDetails>
                  <AccordionActions sx={{ justifyContent: 'flex-start' }}>
                    <Button>URL</Button>
                  </AccordionActions>
                </Accordion>
              <Typography variant="h6" className='pb-3' gutterBottom>活動資料 | Course Details</Typography>
              <DropdownChoiceModule
                name="event.theme"
                label="請選擇活動主題。 Please choose an event theme."
                control={control}
                errors={errors}
                choices={eventThemes}
                required
              />
              <JcCourseTimeslotModule
                name="event.timeslot[1]"
                label="請選擇活動時段（第一選擇）。 Please choose an event timeslot (1st choice)."
                control={control}
                errors={errors}
                jcTimeslots={eventTimeslots}
                required
              />
              <JcCourseTimeslotModule
                name="event.timeslot[2]"
                label="請選擇活動時段（第二選擇）。 Please choose an event timeslot (2nd choice)."
                control={control}
                errors={errors}
                jcTimeslots={eventTimeslots}
                required
              />
              <JcCourseTimeslotModule
                name="event.timeslot[3]"
                label="請選擇活動時段（第三選擇）。 Please choose an event timeslot (3rd choice)."
                control={control}
                errors={errors}
                jcTimeslots={eventTimeslots}
                required
              />
              <JcCourseTimeslotModule
                name="event.timeslot[4]"
                label="請選擇活動時段（第四選擇）。 Please choose an event timeslot (4th choice)."
                control={control}
                errors={errors}
                jcTimeslots={eventTimeslots}
                required
              />
              <JcCourseTimeslotModule
                name="event.timeslot[5]"
                label="請選擇活動時段（第五選擇）。 Please choose an event timeslot (5th choice)."
                control={control}
                errors={errors}
                jcTimeslots={eventTimeslots}
                required
              />
              <Typography variant="h6" className='pb-3' gutterBottom>學生資料 | Student Details</Typography>
              <DropdownChoiceModule
                name="event.grade"
                label="學生年級 Student grade"
                control={control}
                errors={errors}
                choices={studentgrades}
                required
                multiple
              />
              <ShortAnswerModule name="event.whichClass" label="班別 Class" control={control} errors={errors} required />
              <NumberAnswerModule name="event.noOfPpl" label="學生人數 No. of students" min={10} max={40} control={control} errors={errors} required />
            {/* </GoogleSheetWrapper> */}
          </PageWrapper>



          {/* --- Review Page --- */}
          {currentPage === REVIEW_PAGE_NUMBER && (
            <div className="animate-fadeIn">
              <Typography align="center" className="pt-3 pb-3" variant="h5" gutterBottom>請檢查你的申請內容。Please review your application.</Typography>
              <Typography className="pt-3 pb-2" variant="h6" fontWeight={700} color="#2e3440">報名學校及老師資料 <br />School and Teacher info</Typography>
              {reviewFormData.appType == "event" ? //check if application type is event
                Object.entries(
                  Object.keys(reviewFormData).
                    filter((key) => !key.includes('outreach')).
                    reduce((cur, key) => { return Object.assign(cur, { [key]: reviewFormData[key] }) }, {})
                )
                  .map(([key, value]) => (
                    <div key={key} className="mb-2">
                      {/* <Typography variant="subtitle1" component="span" className="font-semibold">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: </Typography> */}
                      <Typography variant="subtitle1" component="span" fontWeight={500} color="#5e81ac">{labels[key]}: </Typography>
                      <Typography variant="body1" component="span">
                        {value == undefined ? "沒有 N/A" :
                          typeof value === 'object' && value !== null && value instanceof Date
                            ? value.toLocaleDateString()
                            : key == "appType" ? String(appTypeChoices.find(o => o.value === value).label)
                              : key.substring(key.length - 5, key.length) == "theme" ? String(eventThemes.find(o => o.value === value).label)
                                : Array.isArray(value)
                                  ? key.substring(key.length - 5, key.length) == "grade" ? `P. ${value.join(', P.')}`
                                    : value.join(', ')
                                  : String(value)}
                        {/* replace undefined value */}
                      </Typography>
                    </div>
                  ))
                : Object.entries( //if application type is NOT event, should be outreach courses then
                  Object.keys(reviewFormData).
                    filter((key) => !key.includes('event')).
                    reduce((cur, key) => { return Object.assign(cur, { [key]: reviewFormData[key] }) }, {})
                )
                  .map(([key, value], index) => (
                    <div key={key} className="mb-2">
                      {/* <Typography variant="subtitle1" component="span" className="font-semibold">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: </Typography> */}
                      {( (index-12)%9 == 1) ? <Typography className="pt-3 pb-2" variant="h6" fontWeight={700} color="#2e3440">外展到校課程({(index-13)/9+1})<br />Outreach courses ({(index-13)/9+1})</Typography>: null}
                      {/* <Typography variant="body1" component="span" fontWeight={500} color="#5e81ac">{String(index)} | </Typography> */}
                      <Typography variant="subtitle1" component="span" fontWeight={500} color="#5e81ac">{labels[key]}: </Typography>
                      <Typography variant="body1" component="span">
                        {value == undefined ? "沒有 N/A" :
                          typeof value === 'object' && value !== null && value instanceof Date
                            ? value.toLocaleDateString()
                            : key == "appType" ? String(appTypeChoices.find(o => o.value === value).label)
                              : key.substring(key.length - 5, key.length) == "theme" ? String(outreachThemes.find(o => o.value === value).label)
                                : key.substring(key.length - 5, key.length) == "grade" ? `P. ${String(value)}`
                                  : Array.isArray(value)
                                    ? key.substring(key.length - 5, key.length) == "grade" ? `P. ${value.join(', ')}`
                                      : value.join(', ')
                                    : String(value)}
                        {/* replace undefined value */}
                      </Typography>
                    </div>
                  ))
              }
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
              onPrevious={handlePageSpecificPrevious}
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