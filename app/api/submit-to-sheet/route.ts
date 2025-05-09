// This script will be deployed as a Web App
function doPost(e) {
    try {
      var requestData = JSON.parse(e.postData.contents);
      var data = requestData.data; // The form data object
      var sheetId = requestData.sheetId; // The ID of the target spreadsheet
      var sheetName = requestData.sheetName; // Optional: specific sheet name/tab
  
      var ss = SpreadsheetApp.openById(sheetId);
      var sheet;
  
      if (sheetName) {
        sheet = ss.getSheetByName(sheetName);
        if (!sheet) {
          sheet = ss.insertSheet(sheetName);
           // Potentially add headers if it's a new sheet and data is an object
          if (typeof data === 'object' && !Array.isArray(data) && data !== null) {
              sheet.appendRow(Object.keys(data));
          }
        }
      } else {
        sheet = ss.getSheets()[0]; // Default to the first sheet
      }
  
      // Prepare the row data
      var rowData = [];
      if (Array.isArray(data)) { // If data is already an array (e.g. for specific row structure)
        rowData = data;
      } else if (typeof data === 'object' && data !== null) { // If data is an object, extract values
        // Ensure consistent order of columns if appending multiple times
        // It's better if the client sends data in the correct column order
        // or if headers are already set in the sheet.
        var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
        if (headers && headers.length > 0 && headers.every(h => h !== "")) {
          rowData = headers.map(header => data[header] !== undefined ? data[header] : "");
        } else {
          // Fallback if no headers, just append values in object order (less reliable for consistency)
          rowData = Object.values(data);
           // If no headers, and it's the first data row, prepend headers
          if (sheet.getLastRow() === 0) {
              sheet.appendRow(Object.keys(data));
          }
        }
      } else {
        return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Invalid data format" })).setMimeType(ContentService.MimeType.JSON);
      }
  
      sheet.appendRow(rowData.concat(new Date())); // Add timestamp
  
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Data received" })).setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() })).setMimeType(ContentService.MimeType.JSON);
    }
  }