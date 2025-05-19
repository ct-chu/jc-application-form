// pages/api/submit-form.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
// import { NextApiRequest, NextApiResponse } from 'next';
// import { google } from 'googleapis';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') {
//     res.setHeader('Allow', ['POST']);
//     return res.status(405).end(`Method ${req.method} Not Allowed`);
//   }

//   const { sheetId: dynamicSheetId, data: formData } = req.body;

//   if (!dynamicSheetId || !formData) {
//     return res.status(400).json({ message: 'Missing sheetId or form data' });
//   }

//   try {
//     const auth = new google.auth.GoogleAuth({
//       credentials: {
//         client_email: process.env.GOOGLE_CLIENT_EMAIL,
//         private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Important for Vercel/Netlify
//       },
//       scopes: ['https://www.googleapis.com/auth/spreadsheets'],
//     });

//     const sheets = google.sheets({ version: 'v4', auth });

//     const spreadsheetId = process.env.GOOGLE_SHEET_ID; // Your main spreadsheet ID

//     // Flatten the formData for easier row insertion.
//     // This creates a single row with all answers.
//     // You might want to customize this based on how you want data in Sheets.
//     let allValues: any[] = [];
//     const headers: string[] = [];

//     // A more structured way to get headers and values:
//     // This assumes formData is an object where keys are page/section keys
//     // and values are objects of fieldName: fieldValue
//     Object.values(formData).forEach((pageData: any) => {
//       if (typeof pageData === 'object' && pageData !== null) {
//         Object.keys(pageData).forEach(key => {
//           if (!headers.includes(key)) { // Avoid duplicate headers if field names are reused
//             headers.push(key);
//           }
//         });
//       }
//     });

//     // Now construct the row based on the collected headers in order
//     // This is a simplified example. You need a consistent order.
//     // It's better to define your headers explicitly.
//     const explicitHeaders = [
//         "Timestamp", "fullName", "email", "age", "productPreference", "comments" // Example Headers
//         // Add all possible field names your form collects, in the order you want them in the sheet
//     ];

//     allValues.push(new Date().toISOString()); // Timestamp

//     explicitHeaders.slice(1).forEach(header => { // Start from index 1 to skip timestamp
//         let valueFound = false;
//         for (const pageKey in formData) {
//             if (formData[pageKey] && typeof formData[pageKey] === 'object' && formData[pageKey][header] !== undefined) {
//                 allValues.push(formData[pageKey][header]);
//                 valueFound = true;
//                 break;
//             }
//         }
//         if (!valueFound) {
//             allValues.push(''); // Add empty string if header not found in data
//         }
//     });


//     // Check if headers exist, if not, add them as the first row
//     // This is a common pattern but might need refinement for multiple sheet tabs (dynamicSheetId)
//     try {
//         const headerRow = await sheets.spreadsheets.values.get({
//             spreadsheetId,
//             range: `${dynamicSheetId}!1:1`, // Check first row of the target sheet/tab
//         });

//         if (!headerRow.data.values || headerRow.data.values.length === 0) {
//             await sheets.spreadsheets.values.append({
//                 spreadsheetId,
//                 range: `${dynamicSheetId}!A1`, // Append to the target sheet/tab
//                 valueInputOption: 'USER_ENTERED',
//                 requestBody: {
//                     values: [explicitHeaders],
//                 },
//             });
//         }
//     } catch (err) {
//       // If sheet/tab doesn't exist or other error, log it.
//       // You might want to create the sheet/tab if it doesn't exist.
//       console.warn(`Could not verify/add headers to sheet "${dynamicSheetId}":`, err);
//     }


//     // Append the new row of data
//     await sheets.spreadsheets.values.append({
//       spreadsheetId,
//       range: `${dynamicSheetId}!A1`, // Append to the target sheet/tab, Google Sheets automatically finds the next empty row
//       valueInputOption: 'USER_ENTERED',
//       requestBody: {
//         values: [allValues],
//       },
//     });

//     return res.status(200).json({ message: 'Form submitted successfully!' });

//   } catch (error: any) {
//     console.error('Error submitting to Google Sheets:', error);
//     return res.status(500).json({ message: 'Internal Server Error', error: error.message });
//   }
// }