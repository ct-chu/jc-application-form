//Last updated: 2025/05/22
//Google Apps Script for receiving data

function doPost(e) {
  // Allow CORS
  return sendCORSResponse(handleFormSubmission(e));
}

function doGet(e) {
  // Test GET endpoint
  return sendCORSResponse(JSON.stringify({ message: "GET request received" }));
}

function doOptions(e) {
  // Preflight response
  return sendCORSResponse('');
}

function handleFormSubmission(e) {
  try {
    const requestData = JSON.parse(e.postData.contents);
    const { sheetId, sheetName, data } = requestData;

    const ss = SpreadsheetApp.openById(sheetId);
    let sheet = sheetName ? ss.getSheetByName(sheetName) : ss.getSheets()[0];

    if (!sheet && sheetName) {
      sheet = ss.insertSheet(sheetName);
      if (typeof data === 'object' && !Array.isArray(data)) { // remove "&& data !== null" to make data row consistent 
        sheet.appendRow(["Sheet",]);
        sheet.appendRow(["intialisation",]);
        sheet.appendRow(["submissionTime"].concat(Object.keys(data)));
      }
    }

    let rowData = [(new Date()).toLocaleString("zh-TW", { timeZone: "Asia/Hong_Kong" }),]; // Add timestamp 

    if (Array.isArray(data)) {
      rowData = rowData.concat(data);
      sheet.appendRow(rowData);
    } else if (typeof data === 'object') { // remove "&& data !== null" to make data row consistent 
      const headers = sheet.getRange(3, 2, 1, (sheet.getLastColumn()>1)? sheet.getLastColumn():1).getValues()[0];
      if (headers && headers.length && headers.every(h => h !== "")) {
        rowData = headers.map(header => data[header] ?? "");
        sheet.appendRow(rowData);
      } else {
        if (sheet.getLastRow() === 0) {
          sheet.appendRow(["Sheet",]);
          sheet.appendRow(["intialisation",]);
          sheet.appendRow(["submissionTime"].concat(Object.keys(data)));
        }
        rowData = rowData.concat(Object.values(data));
        sheet.appendRow(rowData);
      }
    } else {
      return JSON.stringify({ status: "error", message: "Invalid data format" });
    }

    return JSON.stringify({ status: "success", message: "Data stored" });

  } catch (err) {
    return JSON.stringify({ status: "error", message: err.toString() });
  }
}

function sendCORSResponse(content) {
  const output = ContentService.createTextOutput(content);
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
