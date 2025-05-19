import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Store your Google Apps Script Web App URL in an environment variable
const GOOGLE_APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;

export async function POST(request: NextRequest) {
  if (!GOOGLE_APPS_SCRIPT_URL) {
    console.error("Google Apps Script URL is not configured.");
    return NextResponse.json({ message: 'Server configuration error.' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { data, sheetId, sheetName } = body; // Expecting form data and target sheetId

    if (!data || !sheetId) {
      return NextResponse.json({ message: 'Missing form data or sheetId.' }, { status: 400 });
    }

    // Forward the data to your Google Apps Script
    const response = await axios.post(GOOGLE_APPS_SCRIPT_URL, {
      data,
      sheetId,
      sheetName // Optional
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Google Apps Script web apps often redirect, so handle that
      maxRedirects: 0,
      validateStatus: function (status) {
        return status >= 200 && status < 303; // Accept success and redirect statuses
      },
    });

    // Apps Script usually returns 302 on success if it's a simple text output,
    // or 200 if it's JSON output and correctly configured.
    // The actual content of the success/error is in the Apps Script response,
    // which is harder to get directly if it redirects.
    // A common pattern is to have Apps Script return JSON.
    if (response.status === 200 && response.data && response.data.status === 'success') {
      return NextResponse.json({ message: 'Data submitted successfully to Google Sheet.', details: response.data }, { status: 200 });
    } else if (response.status === 200 && response.data && response.data.status === 'error') {
       return NextResponse.json({ message: 'Error from Google Apps Script.', details: response.data.message || 'Unknown Apps Script error' }, { status: 500 });
    }
    else {
      // If it was a redirect (302), it's often a sign of success for simple doPost scripts.
      // However, it's better if Apps Script returns JSON with a clear status.
      // Assuming success if not an explicit error from a JSON response.
      console.log("Apps Script Response Status:", response.status, "Data:", response.data);
      // This part needs careful handling based on how your Apps Script is configured to respond.
      // If it always returns JSON:
      // return NextResponse.json({ message: 'Unexpected response from Google Sheets integration.', details: response.data }, { status: response.status });

      // For now, let's assume a non-200 from Apps Script (that isn't a redirect) is an issue.
      // Or if the response.data isn't what we expect.
       return NextResponse.json({ message: 'Data submitted, but verify Google Sheet. Apps Script responded.', details: response.data }, { status: 200 }); // Treat as success for now
    }

  } catch (error: any) {
    console.error('Error in /api/submit-to-sheet:', error);
    let errorMessage = 'Failed to submit data.';
    if (axios.isAxiosError(error) && error.response) {
      errorMessage = `Error from Google Sheets integration: ${error.response.status} ${JSON.stringify(error.response.data)}`;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ message: errorMessage, details: error.toString() }, { status: 500 });
  }
}