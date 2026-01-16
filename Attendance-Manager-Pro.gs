// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║                   ATTENDANCE MANAGER PRO - Google Apps Script                 ║
// ║                    Advanced Attendance & Payroll Management                    ║
// ║                              Version 2.0                                       ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

// ============= CONSTANTS & CONFIGURATION =============
const CONFIG = {
  ADMIN_PASSWORD: "admin123", // Change this to your secure password
  CURRENCY: "₹",
  TIMEZONE: "Asia/Kolkata",
  COLORS: {
    PRIMARY: "#0d47a1",
    SECONDARY: "#1976d2",
    SUCCESS: "#c8e6c9",
    DANGER: "#ffcdd2",
    WARNING: "#fff9c4",
    HEADER_BG: "#0d47a1"
  },
  SHEETS: {
    EMPLOYEES: "Employees",
    ATTENDANCE: "Attendance",
    SUMMARY: "Summary",
    SALARY: "Salary",
    LEAVES: "Leaves",
    HOURS: "Hours Tracking",
    BONUS: "Bonus Calculation",
    REPORT: "Monthly Report",
    COMPARISON: "Comparison Report"
  }
};

// ============= MAIN MENU =============
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("⚙️ Attendance Manager Pro")
    .addItem("🔄 Create / Refresh System", "createAllTabs")
    .addItem("📅 Select Month & Year", "selectMonthYear")
    .addSeparator()
    .addItem("📊 Generate Monthly Report", "generateReport")
    .addItem("📈 Generate Charts", "generateCharts")
    .addItem("🔗 Compare Months", "compareMonths")
    .addItem("📧 Email Report", "emailReport")
    .addSeparator()
    .addItem("🏢 Filter by Department", "filterByDepartment")
    .addItem("🔐 Admin Settings", "adminSettings")
    .addItem("🧹 Reset All Data", "deleteAllTabs")
    .addToUi();
}

// ============= ADMIN PASSWORD PROTECTION =============
function verifyAdminPassword() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt(
    '🔐 Admin Password Required',
    'Enter admin password to continue:',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (response.getSelectedButton() !== ui.Button.OK) return false;
  if (response.getResponseText() === CONFIG.ADMIN_PASSWORD) return true;
  
  ui.alert('❌ Incorrect password!');
  return false;
}

function adminSettings() {
  if (!verifyAdminPassword()) return;
  
  const ui = SpreadsheetApp.getUi();
  ui.alert(
    `🔐 ADMIN SETTINGS\n\n` +
    `Current Admin Password: ${CONFIG.ADMIN_PASSWORD}\n\n` +
    `Features Enabled:\n` +
    `✅ Email Reports\n` +
    `✅ Charts & Graphs\n` +
    `✅ Leave Management\n` +
    `✅ Hours Tracking\n` +
    `✅ Bonus Calculation\n` +
    `✅ Comparison Reports`
  );
}

// ============= MONTH/YEAR SELECTION =============
function selectMonthYear() {
  const ui = SpreadsheetApp.getUi();
  
  const monthResponse = ui.prompt(
    'Select Month',
    'Enter month number (1-12):\n\n1=January    7=July\n2=February   8=August\n3=March      9=September\n4=April      10=October\n5=May        11=November\n6=June       12=December',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (monthResponse.getSelectedButton() !== ui.Button.OK) return;
  
  const month = parseInt(monthResponse.getResponseText());
  if (month < 1 || month > 12) {
    ui.alert('⚠️ Invalid month! Please enter number between 1-12');
    return;
  }
  
  const currentYear = new Date().getFullYear();
  const yearResponse = ui.prompt(
    'Select Year',
    `Enter year (${currentYear-2} to ${currentYear+2}):`,
    ui.ButtonSet.OK_CANCEL
  );
  
  if (yearResponse.getSelectedButton() !== ui.Button.OK) return;
  
  const year = parseInt(yearResponse.getResponseText());
  if (year < currentYear-2 || year > currentYear+2) {
    ui.alert(`⚠️ Invalid year! Please enter between ${currentYear-2}-${currentYear+2}`);
    return;
  }
  
  PropertiesService.getScriptProperties().setProperties({
    'selectedMonth': (month - 1).toString(),
    'selectedYear': year.toString()
  });
  
  ui.alert(`✅ Selected: ${getMonthName(month-1)} ${year}\n\nClick "Create / Refresh System" to apply changes`);
}

function getMonthName(monthIndex) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
  return months[monthIndex];
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// ============= CREATE/SETUP SHEETS =============
function createAllTabs() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  const properties = PropertiesService.getScriptProperties();
  const now = new Date();
  const selectedMonth = parseInt(properties.getProperty('selectedMonth')) || now.getMonth();
  const selectedYear = parseInt(properties.getProperty('selectedYear')) || now.getFullYear();
  
  // Create all sheets
  const sheets = {};
  for (const [key, name] of Object.entries(CONFIG.SHEETS)) {
    sheets[key] = ss.getSheetByName(name) || ss.insertSheet(name);
  }
  
  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  
  setupEmployeesSheet(sheets.EMPLOYEES);
  const employeeData = getEmployeeData(sheets.EMPLOYEES);
  
  setupAttendanceSheetPreserveData(sheets.ATTENDANCE, employeeData, selectedYear, selectedMonth, daysInMonth);
  setupSummarySheetComplete(sheets.SUMMARY, employeeData, selectedYear, selectedMonth);
  setupSalarySheetComplete(sheets.SALARY, employeeData, selectedYear, selectedMonth);
  setupLeavesSheet(sheets.LEAVES, employeeData);
  setupHoursSheet(sheets.HOURS, employeeData, daysInMonth);
  setupBonusSheet(sheets.BONUS, employeeData, selectedYear, selectedMonth);
  
  SpreadsheetApp.getUi().alert(`✅ System refreshed for ${getMonthName(selectedMonth)} ${selectedYear}`);
}

function getEmployeeData(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  
  const data = sheet.getRange("A2:E" + lastRow).getValues();
  return data.filter(row => row[0]);
}

// ============= EMPLOYEES SHEET =============
function setupEmployeesSheet(sheet) {
  sheet.getRange("A1:E1").setValues([["👤 Name", "🆔 ID", "🏢 Department", "💰 Salary", "📧 Email"]]);
  
  const headerRange = sheet.getRange("A1:E1");
  headerRange
    .setBackground(CONFIG.COLORS.PRIMARY)
    .setFontColor("#ffffff")
    .setFontWeight("bold")
    .setFontSize(11)
    .setHorizontalAlignment("center")
    .setWrap(true);
  
  sheet.setRowHeight(1, 55);
  
  if (sheet.getLastRow() < 2) {
    const sampleData = [
      ["Ankit Maurya", "EMP001", "Sales", 30000, "ankit@company.com"],
      ["Harman Singh", "EMP002", "Sales", 24000, "harman@company.com"],
      ["Varun Kumar", "EMP003", "IT", 35000, "varun@company.com"],
      ["Priya Singh", "EMP004", "HR", 28000, "priya@company.com"],
      ["Rajesh Patel", "EMP005", "Finance", 32000, "rajesh@company.com"]
    ];
    sheet.getRange("A2:E6").setValues(sampleData);
  }
  
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    for (let i = 2; i <= lastRow; i++) {
      const rowRange = sheet.getRange(i, 1, 1, 5);
      rowRange.setBackground((i % 2) === 0 ? "#f5f5f5" : "#ffffff");
      sheet.setRowHeight(i, 35);
    }
    
    sheet.getRange(2, 4, lastRow - 1, 1).setNumberFormat("₹#,##0");
    sheet.getRange(2, 2, lastRow - 1, 2).setHorizontalAlignment("center");
  }
  
  sheet.setColumnWidth(1, 180);
  sheet.setColumnWidth(2, 120);
  sheet.setColumnWidth(3, 140);
  sheet.setColumnWidth(4, 150);
  sheet.setColumnWidth(5, 180);
  
  sheet.setFrozenRows(1);
  
  const dataRange = sheet.getRange(1, 1, lastRow, 5);
  dataRange.setBorder(true, true, true, true, true, true, "#757575", SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
}

// ============= ATTENDANCE SHEET =============
function setupAttendanceSheetPreserveData(sheet, employeeData, year, month, daysInMonth) {
  const existingData = {};
  
  if (sheet.getLastRow() > 1) {
    const existingNames = sheet.getRange("A2:A").getValues().flat().filter(name => name);
    existingNames.forEach((name, index) => {
      if (name) {
        const rowData = sheet.getRange(index + 2, 2, 1, sheet.getLastColumn() - 1).getValues()[0];
        existingData[name] = rowData.filter(cell => cell !== "");
      }
    });
  }
  
  sheet.clear();
  
  const dateHeader = ["👤 Employee"];
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    dateHeader.push(`${i}\n${dayName}`);
  }
  
  sheet.getRange(1, 1, 1, dateHeader.length).setValues([dateHeader]);
  
  const headerRange = sheet.getRange(1, 1, 1, dateHeader.length);
  headerRange
    .setBackground("#283593")
    .setFontColor("#ffffff")
    .setFontWeight("bold")
    .setFontSize(10)
    .setHorizontalAlignment("center")
    .setWrap(true);
  
  sheet.setRowHeight(1, 50);
  sheet.setColumnWidth(1, 180);
  
  employeeData.forEach((employee, i) => {
    const name = employee[0];
    const row = i + 2;
    const nameCell = sheet.getRange(row, 1);
    nameCell.setValue(name);
    nameCell
      .setBackground("#1a237e")
      .setFontColor("#ffffff")
      .setFontWeight("bold")
      .setFontSize(11)
      .setVerticalAlignment("middle");
    
    if (existingData[name]) {
      const dataToRestore = existingData[name];
      const maxCols = Math.min(dataToRestore.length, daysInMonth);
      if (maxCols > 0) {
        const restoreRange = sheet.getRange(row, 2, 1, maxCols);
        restoreRange.setValues([dataToRestore.slice(0, maxCols)]);
      }
    }
  });
  
  const dataRange = sheet.getRange(2, 2, employeeData.length, daysInMonth);
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["✅", "🔴", "🟡"], true)
    .setHelpText("✅ Present | 🔴 Absent | 🟡 Half Day")
    .build();
  dataRange.setDataValidation(rule);
  dataRange.setHorizontalAlignment("center");
  dataRange.setVerticalAlignment("middle");
  dataRange.setFontSize(16);
  
  const rules = [
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("✅")
      .setBackground("#c8e6c9")
      .setFontColor("#1b5e20")
      .setRanges([dataRange]).build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("🔴")
      .setBackground("#ffcdd2")
      .setFontColor("#b71c1c")
      .setRanges([dataRange]).build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("🟡")
      .setBackground("#fff9c4")
      .setFontColor("#f57f17")
      .setRanges([dataRange]).build()
  ];
  sheet.setConditionalFormatRules(rules);
  
  highlightWeekends(sheet, year, month, daysInMonth, employeeData.length);
  
  sheet.setFrozenColumns(1);
  sheet.setFrozenRows(1);
  
  for (let i = 2; i <= daysInMonth + 1; i++) {
    sheet.setColumnWidth(i, 60);
  }
  
  sheet.setRowHeights(2, employeeData.length, 40);
  
  const allDataRange = sheet.getRange(1, 1, employeeData.length + 1, dateHeader.length);
  allDataRange.setBorder(true, true, true, true, true, true, "#9e9e9e", SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
}

function highlightWeekends(sheet, year, month, daysInMonth, nameCount) {
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    const dayOfWeek = date.getDay();
    
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      const col = i + 1;
      const headerCell = sheet.getRange(1, col);
      const dataRange = sheet.getRange(2, col, nameCount, 1);
      
      headerCell.setBackground("#d32f2f").setFontColor("#ffffff");
      dataRange.setBackground("#ffebee");
    }
  }
}

// ============= SUMMARY SHEET =============
function setupSummarySheetComplete(sheet, employeeData, year, month) {
  sheet.clear();
  
  const workingDays = getDaysInMonth(year, month);
  
  sheet.getRange("A1:F1").setValues([[
    "👤 Employee Name", "✅ Present Days", "🔴 Absent Days", "🟡 Half Days", "📊 Attendance %", "⭐ Rating"
  ]]);
  
  const headerRange = sheet.getRange("A1:F1");
  headerRange
    .setBackground(CONFIG.COLORS.PRIMARY)
    .setFontColor("#ffffff")
    .setFontWeight("bold")
    .setFontSize(12)
    .setHorizontalAlignment("center")
    .setWrap(true);
  
  sheet.setRowHeight(1, 60);
  
  employeeData.forEach((employee, i) => {
    const name = employee[0];
    const row = i + 2;
    
    sheet.getRange(row, 1).setValue(name);
    sheet.getRange(row, 2).setFormula(`=COUNTIF(Attendance!B${row}:AZ${row},"✅")`);
    sheet.getRange(row, 3).setFormula(`=COUNTIF(Attendance!B${row}:AZ${row},"🔴")`);
    sheet.getRange(row, 4).setFormula(`=COUNTIF(Attendance!B${row}:AZ${row},"🟡")`);
    sheet.getRange(row, 5).setFormula(`=ROUND((B${row}+(D${row}*0.5))/${workingDays}*100,1)`);
    sheet.getRange(row, 6).setFormula(
      `=IF(E${row}>=95,"🟢 Excellent",IF(E${row}>=85,"🟡 Good",IF(E${row}>=75,"🟠 Average","🔴 Poor")))`
    );
  });
  
  if (employeeData.length > 0) {
    for (let i = 0; i < employeeData.length; i++) {
      const row = i + 2;
      const rowRange = sheet.getRange(row, 1, 1, 6);
      rowRange.setBackground((i % 2) === 0 ? "#e3f2fd" : "#ffffff");
      sheet.setRowHeight(row, 45);
    }
    
    sheet.getRange(2, 2, employeeData.length, 3)
      .setHorizontalAlignment("center")
      .setFontSize(12)
      .setFontWeight("bold");
    
    sheet.getRange(2, 5, employeeData.length, 1)
      .setNumberFormat("0.0\"%\"")
      .setHorizontalAlignment("center")
      .setFontSize(13)
      .setFontWeight("bold")
      .setFontColor(CONFIG.COLORS.PRIMARY);
    
    sheet.getRange(2, 6, employeeData.length, 1)
      .setHorizontalAlignment("center")
      .setFontSize(11)
      .setFontWeight("bold");
  }
  
  sheet.setColumnWidth(1, 200);
  for (let i = 2; i <= 6; i++) {
    sheet.setColumnWidth(i, 140);
  }
  
  const dataRange = sheet.getRange(1, 1, employeeData.length + 1, 6);
  dataRange.setBorder(true, true, true, true, true, true, "#1976d2", SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  
  sheet.setFrozenRows(1);
}

// ============= SALARY SHEET =============
function setupSalarySheetComplete(sheet, employeeData, year, month) {
  sheet.clear();
  
  const workingDays = getDaysInMonth(year, month);
  
  sheet.getRange("A1:E1").setValues([[
    "👤 Employee Name", "💵 Daily Rate", "📅 Working Days", "✅ Effective Days", "💰 Final Salary"
  ]]);
  
  const headerRange = sheet.getRange("A1:E1");
  headerRange
    .setBackground(CONFIG.COLORS.PRIMARY)
    .setFontColor("#ffffff")
    .setFontWeight("bold")
    .setFontSize(12)
    .setHorizontalAlignment("center")
    .setWrap(true);
  
  sheet.setRowHeight(1, 60);
  
  employeeData.forEach((employee, i) => {
    const row = i + 2;
    const name = employee[0];
    
    sheet.getRange(row, 1).setValue(name);
    sheet.getRange(row, 2).setFormula(`=Employees!D${row}/${workingDays}`);
    sheet.getRange(row, 3).setValue(workingDays);
    sheet.getRange(row, 4).setFormula(`=Summary!B${row}+(Summary!D${row}*0.5)`);
    sheet.getRange(row, 5).setFormula(`=B${row}*D${row}`);
  });
  
  if (employeeData.length > 0) {
    for (let i = 0; i < employeeData.length; i++) {
      const row = i + 2;
      const rowRange = sheet.getRange(row, 1, 1, 5);
      rowRange.setBackground((i % 2) === 0 ? "#e3f2fd" : "#ffffff");
      sheet.setRowHeight(row, 45);
    }
    
    sheet.getRange(2, 2, employeeData.length, 1).setNumberFormat("₹#,##0.00");
    sheet.getRange(2, 5, employeeData.length, 1).setNumberFormat("₹#,##0");
    sheet.getRange(2, 2, employeeData.length, 3)
      .setHorizontalAlignment("center")
      .setFontSize(12);
    sheet.getRange(2, 5, employeeData.length, 1)
      .setFontWeight("bold")
      .setFontSize(13)
      .setHorizontalAlignment("center")
      .setFontColor(CONFIG.COLORS.PRIMARY);
  }
  
  const dataRange = sheet.getRange(1, 1, employeeData.length + 1, 5);
  dataRange.setBorder(true, true, true, true, true, true, "#1976d2", SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  
  sheet.setColumnWidth(1, 200);
  for (let i = 2; i <= 5; i++) {
    sheet.setColumnWidth(i, 140);
  }
  
  sheet.setFrozenRows(1);
}

// ============= LEAVES SHEET =============
function setupLeavesSheet(sheet, employeeData) {
  sheet.clear();
  
  sheet.getRange("A1:E1").setValues([[
    "👤 Employee", "🏥 Sick Leave", "🎉 Casual Leave", "🚀 Special Leave", "📊 Total Balance"
  ]]);
  
  const headerRange = sheet.getRange("A1:E1");
  headerRange
    .setBackground(CONFIG.COLORS.PRIMARY)
    .setFontColor("#ffffff")
    .setFontWeight("bold")
    .setFontSize(12)
    .setHorizontalAlignment("center");
  
  sheet.setRowHeight(1, 50);
  
  employeeData.forEach((employee, i) => {
    const row = i + 2;
    sheet.getRange(row, 1).setValue(employee[0]);
    sheet.getRange(row, 2).setValue(0); // Sick leave used
    sheet.getRange(row, 3).setValue(0); // Casual leave used
    sheet.getRange(row, 4).setValue(0); // Special leave used
    sheet.getRange(row, 5).setFormula(`=12-(B${row}+C${row}+D${row})`);
    
    const rowRange = sheet.getRange(row, 1, 1, 5);
    rowRange.setBackground((i % 2) === 0 ? "#e3f2fd" : "#ffffff");
    sheet.setRowHeight(row, 35);
  });
  
  sheet.getRange(2, 2, employeeData.length, 3)
    .setHorizontalAlignment("center")
    .setNumberFormat("0");
  sheet.getRange(2, 5, employeeData.length, 1)
    .setHorizontalAlignment("center")
    .setFontWeight("bold")
    .setFontColor(CONFIG.COLORS.PRIMARY);
  
  sheet.setColumnWidth(1, 200);
  for (let i = 2; i <= 5; i++) {
    sheet.setColumnWidth(i, 140);
  }
  
  const dataRange = sheet.getRange(1, 1, employeeData.length + 1, 5);
  dataRange.setBorder(true, true, true, true, true, true, "#1976d2", SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  
  sheet.setFrozenRows(1);
}

// ============= HOURS TRACKING SHEET =============
function setupHoursSheet(sheet, employeeData, daysInMonth) {
  sheet.clear();
  
  const dateHeader = ["👤 Employee"];
  for (let i = 1; i <= daysInMonth; i++) {
    dateHeader.push(`Day ${i}`);
  }
  
  sheet.getRange(1, 1, 1, dateHeader.length).setValues([dateHeader]);
  
  const headerRange = sheet.getRange(1, 1, 1, dateHeader.length);
  headerRange
    .setBackground("#283593")
    .setFontColor("#ffffff")
    .setFontWeight("bold")
    .setFontSize(10)
    .setHorizontalAlignment("center");
  
  sheet.setRowHeight(1, 40);
  sheet.setColumnWidth(1, 180);
  
  employeeData.forEach((employee, i) => {
    const row = i + 2;
    sheet.getRange(row, 1).setValue(employee[0]);
    
    const rowRange = sheet.getRange(row, 1, 1, dateHeader.length);
    rowRange.setBackground((i % 2) === 0 ? "#f5f5f5" : "#ffffff");
    sheet.setRowHeight(row, 35);
  });
  
  const dataRange = sheet.getRange(2, 2, employeeData.length, daysInMonth);
  dataRange.setNumberFormat("0.00");
  dataRange.setHorizontalAlignment("center");
  
  for (let i = 2; i <= daysInMonth + 1; i++) {
    sheet.setColumnWidth(i, 70);
  }
  
  sheet.setFrozenColumns(1);
  sheet.setFrozenRows(1);
}

// ============= BONUS CALCULATION SHEET =============
function setupBonusSheet(sheet, employeeData, year, month) {
  sheet.clear();
  
  sheet.getRange("A1:F1").setValues([[
    "👤 Employee", "⭐ Attendance %", "📊 Performance", "💯 Base Salary", "🎁 Bonus Amount", "💰 Total with Bonus"
  ]]);
  
  const headerRange = sheet.getRange("A1:F1");
  headerRange
    .setBackground(CONFIG.COLORS.PRIMARY)
    .setFontColor("#ffffff")
    .setFontWeight("bold")
    .setFontSize(12)
    .setHorizontalAlignment("center");
  
  sheet.setRowHeight(1, 60);
  
  employeeData.forEach((employee, i) => {
    const row = i + 2;
    sheet.getRange(row, 1).setValue(employee[0]);
    sheet.getRange(row, 2).setFormula(`=Summary!E${row}`);
    sheet.getRange(row, 3).setFormula(`=IF(B${row}>=95,0.15,IF(B${row}>=85,0.1,IF(B${row}>=75,0.05,0)))`);
    sheet.getRange(row, 4).setFormula(`=Salary!E${row}`);
    sheet.getRange(row, 5).setFormula(`=D${row}*C${row}`);
    sheet.getRange(row, 6).setFormula(`=D${row}+E${row}`);
    
    const rowRange = sheet.getRange(row, 1, 1, 6);
    rowRange.setBackground((i % 2) === 0 ? "#e3f2fd" : "#ffffff");
    sheet.setRowHeight(row, 40);
  });
  
  sheet.getRange(2, 2, employeeData.length, 2)
    .setHorizontalAlignment("center");
  sheet.getRange(2, 3, employeeData.length, 1)
    .setNumberFormat("0%");
  sheet.getRange(2, 4, employeeData.length, 2)
    .setNumberFormat("₹#,##0")
    .setHorizontalAlignment("right")
    .setFontWeight("bold");
  sheet.getRange(2, 6, employeeData.length, 1)
    .setNumberFormat("₹#,##0")
    .setFontColor(CONFIG.COLORS.PRIMARY)
    .setFontWeight("bold");
  
  sheet.setColumnWidth(1, 200);
  for (let i = 2; i <= 6; i++) {
    sheet.setColumnWidth(i, 140);
  }
  
  const dataRange = sheet.getRange(1, 1, employeeData.length + 1, 6);
  dataRange.setBorder(true, true, true, true, true, true, "#1976d2", SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  
  sheet.setFrozenRows(1);
}

// ============= GENERATE MONTHLY REPORT =============
function generateReport() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const reportSheet = ss.getSheetByName(CONFIG.SHEETS.REPORT) || ss.insertSheet(CONFIG.SHEETS.REPORT);
    
    reportSheet.clear();
    
    const properties = PropertiesService.getScriptProperties();
    const now = new Date();
    const selectedMonth = parseInt(properties.getProperty('selectedMonth')) || now.getMonth();
    const selectedYear = parseInt(properties.getProperty('selectedYear')) || now.getFullYear();
    const monthName = getMonthName(selectedMonth);
    const workingDays = getDaysInMonth(selectedYear, selectedMonth);
    
    // Title
    const titleRange = reportSheet.getRange("A1:G1");
    titleRange.merge();
    titleRange.setValue(`📊 COMPREHENSIVE MONTHLY REPORT - ${monthName.toUpperCase()} ${selectedYear}`);
    titleRange
      .setBackground(CONFIG.COLORS.PRIMARY)
      .setFontColor("#ffffff")
      .setFontWeight("bold")
      .setFontSize(16)
      .setHorizontalAlignment("center");
    
    reportSheet.setRowHeight(1, 60);
    
    // Report details
    reportSheet.getRange("A3:G3").merge();
    reportSheet.getRange("A3").setValue("📋 REPORT DETAILS");
    reportSheet.getRange("A3").setBackground("#1565c0").setFontColor("#ffffff").setFontWeight("bold").setFontSize(13);
    reportSheet.setRowHeight(3, 40);
    
    const metaRange = reportSheet.getRange("A4:B7");
    metaRange.setValues([
      ["📅 Report Generated:", new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })],
      ["🗓️ Report Period:", `${monthName} ${selectedYear}`],
      ["📊 Total Working Days:", workingDays],
      ["⚙️ System:", "Attendance Manager Pro v2.0"]
    ]);
    
    metaRange.setBackground("#e3f2fd").setFontWeight("bold");
    reportSheet.setRowHeights(4, 4, 35);
    
    // Attendance Summary
    let currentRow = 9;
    
    reportSheet.getRange(currentRow, 1, 1, 7).merge();
    reportSheet.getRange(currentRow, 1).setValue("📊 ATTENDANCE SUMMARY");
    reportSheet.getRange(currentRow, 1).setBackground("#1565c0").setFontColor("#ffffff").setFontWeight("bold").setFontSize(13);
    reportSheet.setRowHeight(currentRow, 40);
    
    currentRow++;
    
    const summaryHeaderRange = reportSheet.getRange(currentRow, 1, 1, 6);
    summaryHeaderRange.setValues([["👤 Employee", "✅ Present", "🔴 Absent", "🟡 Half", "📊 Attendance %", "⭐ Rating"]]);
    summaryHeaderRange.setBackground("#1976d2").setFontColor("#ffffff").setFontWeight("bold").setHorizontalAlignment("center").setFontSize(12);
    reportSheet.setRowHeight(currentRow, 50);
    
    currentRow++;
    
    const summarySheet = ss.getSheetByName(CONFIG.SHEETS.SUMMARY);
    if (summarySheet && summarySheet.getLastRow() > 1) {
      const summaryData = summarySheet.getRange("A2:F" + summarySheet.getLastRow()).getValues();
      const reportDataRange = reportSheet.getRange(currentRow, 1, summaryData.length, 6);
      reportDataRange.setValues(summaryData);
      
      reportSheet.getRange(currentRow, 2, summaryData.length, 4).setHorizontalAlignment("center").setFontSize(12);
      
      for (let i = 0; i < summaryData.length; i++) {
        const rowRange = reportSheet.getRange(currentRow + i, 1, 1, 6);
        rowRange.setBackground((i % 2) === 0 ? "#e3f2fd" : "#ffffff");
        reportSheet.setRowHeight(currentRow + i, 40);
      }
      
      currentRow += summaryData.length + 1;
    }
    
    // Leave Summary
    reportSheet.getRange(currentRow, 1, 1, 7).merge();
    reportSheet.getRange(currentRow, 1).setValue("🏥 LEAVE SUMMARY");
    reportSheet.getRange(currentRow, 1).setBackground("#1565c0").setFontColor("#ffffff").setFontWeight("bold").setFontSize(13);
    reportSheet.setRowHeight(currentRow, 40);
    
    currentRow++;
    
    const leaveHeaderRange = reportSheet.getRange(currentRow, 1, 1, 5);
    leaveHeaderRange.setValues([["👤 Employee", "🏥 Sick", "🎉 Casual", "🚀 Special", "📊 Balance"]]);
    leaveHeaderRange.setBackground("#1976d2").setFontColor("#ffffff").setFontWeight("bold").setHorizontalAlignment("center");
    reportSheet.setRowHeight(currentRow, 40);
    
    currentRow++;
    
    const leavesSheet = ss.getSheetByName(CONFIG.SHEETS.LEAVES);
    if (leavesSheet && leavesSheet.getLastRow() > 1) {
      const leaveData = leavesSheet.getRange("A2:E" + leavesSheet.getLastRow()).getValues();
      const leaveDataRange = reportSheet.getRange(currentRow, 1, leaveData.length, 5);
      leaveDataRange.setValues(leaveData);
      
      reportSheet.getRange(currentRow, 2, leaveData.length, 4).setHorizontalAlignment("center").setFontSize(11);
      
      for (let i = 0; i < leaveData.length; i++) {
        reportSheet.getRange(currentRow + i, 1, 1, 5).setBackground((i % 2) === 0 ? "#e3f2fd" : "#ffffff");
        reportSheet.setRowHeight(currentRow + i, 35);
      }
      
      currentRow += leaveData.length + 2;
    }
    
    // Salary Summary
    reportSheet.getRange(currentRow, 1, 1, 7).merge();
    reportSheet.getRange(currentRow, 1).setValue("💰 SALARY SUMMARY");
    reportSheet.getRange(currentRow, 1).setBackground("#1565c0").setFontColor("#ffffff").setFontWeight("bold").setFontSize(13);
    reportSheet.setRowHeight(currentRow, 40);
    
    currentRow++;
    
    const salaryHeaderRange = reportSheet.getRange(currentRow, 1, 1, 5);
    salaryHeaderRange.setValues([["👤 Employee", "💵 Daily Rate", "📅 Work Days", "✅ Effective Days", "💰 Final Salary"]]);
    salaryHeaderRange.setBackground("#1976d2").setFontColor("#ffffff").setFontWeight("bold").setHorizontalAlignment("center").setFontSize(12);
    reportSheet.setRowHeight(currentRow, 50);
    
    currentRow++;
    
    const salarySheet = ss.getSheetByName(CONFIG.SHEETS.SALARY);
    if (salarySheet && salarySheet.getLastRow() > 1) {
      const salaryData = salarySheet.getRange("A2:E" + salarySheet.getLastRow()).getValues();
      const salaryDataRange = reportSheet.getRange(currentRow, 1, salaryData.length, 5);
      salaryDataRange.setValues(salaryData);
      
      reportSheet.getRange(currentRow, 2, salaryData.length, 1).setNumberFormat("₹#,##0.00");
      reportSheet.getRange(currentRow, 5, salaryData.length, 1).setNumberFormat("₹#,##0");
      reportSheet.getRange(currentRow, 2, salaryData.length, 4).setHorizontalAlignment("center").setFontSize(12);
      reportSheet.getRange(currentRow, 5, salaryData.length, 1).setFontWeight("bold").setFontSize(13).setFontColor(CONFIG.COLORS.PRIMARY);
      
      for (let i = 0; i < salaryData.length; i++) {
        reportSheet.getRange(currentRow + i, 1, 1, 5).setBackground((i % 2) === 0 ? "#e3f2fd" : "#ffffff");
        reportSheet.setRowHeight(currentRow + i, 40);
      }
      
      currentRow += salaryData.length + 1;
    }
    
    // Bonus Summary
    reportSheet.getRange(currentRow, 1, 1, 7).merge();
    reportSheet.getRange(currentRow, 1).setValue("🎁 BONUS CALCULATION");
    reportSheet.getRange(currentRow, 1).setBackground("#1565c0").setFontColor("#ffffff").setFontWeight("bold").setFontSize(13);
    reportSheet.setRowHeight(currentRow, 40);
    
    currentRow++;
    
    const bonusHeaderRange = reportSheet.getRange(currentRow, 1, 1, 6);
    bonusHeaderRange.setValues([["👤 Employee", "⭐ Attendance %", "📊 Performance", "💯 Base", "🎁 Bonus", "💰 Total"]]);
    bonusHeaderRange.setBackground("#1976d2").setFontColor("#ffffff").setFontWeight("bold").setHorizontalAlignment("center").setFontSize(11);
    reportSheet.setRowHeight(currentRow, 50);
    
    currentRow++;
    
    const bonusSheet = ss.getSheetByName(CONFIG.SHEETS.BONUS);
    if (bonusSheet && bonusSheet.getLastRow() > 1) {
      const bonusData = bonusSheet.getRange("A2:F" + bonusSheet.getLastRow()).getValues();
      const bonusDataRange = reportSheet.getRange(currentRow, 1, bonusData.length, 6);
      bonusDataRange.setValues(bonusData);
      
      reportSheet.getRange(currentRow, 2, bonusData.length, 5).setHorizontalAlignment("center").setFontSize(11);
      reportSheet.getRange(currentRow, 4, bonusData.length, 3).setNumberFormat("₹#,##0").setFontWeight("bold");
      
      for (let i = 0; i < bonusData.length; i++) {
        reportSheet.getRange(currentRow + i, 1, 1, 6).setBackground((i % 2) === 0 ? "#e3f2fd" : "#ffffff");
        reportSheet.setRowHeight(currentRow + i, 40);
      }
    }
    
    reportSheet.autoResizeColumns(1, 7);
    reportSheet.setFrozenRows(1);
    
    SpreadsheetApp.getUi().alert("✅ Monthly Report generated successfully!");
    
  } catch (e) {
    SpreadsheetApp.getUi().alert("❌ Error generating report: " + e.message);
  }
}

// ============= EMAIL REPORT FUNCTION =============
function emailReport() {
  const ui = SpreadsheetApp.getUi();
  
  const emailResponse = ui.prompt(
    '📧 Email Report',
    'Enter email address to send report:',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (emailResponse.getSelectedButton() !== ui.Button.OK) return;
  
  const email = emailResponse.getResponseText();
  if (!email.includes('@')) {
    ui.alert('❌ Invalid email address!');
    return;
  }
  
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const reportSheet = ss.getSheetByName(CONFIG.SHEETS.REPORT);
    
    if (!reportSheet) {
      ui.alert('⚠️ Please generate report first!');
      return;
    }
    
    const pdf = DriveApp.getFileById(ss.getId()).getAs('application/pdf');
    const subject = `📊 Attendance Report - ${new Date().toLocaleDateString()}`;
    const body = `Dear HR Team,\n\nPlease find attached the comprehensive monthly attendance report.\n\nBest regards,\nAttendance Manager Pro`;
    
    GmailApp.sendEmail(email, subject, body, { attachments: [pdf] });
    ui.alert('✅ Report sent successfully to ' + email);
    
  } catch (e) {
    ui.alert('❌ Error sending email: ' + e.message);
  }
}

// ============= GENERATE CHARTS =============
function generateCharts() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let chartSheet = ss.getSheetByName("📈 Charts") || ss.insertSheet("📈 Charts");
    chartSheet.clear();
    
    const summarySheet = ss.getSheetByName(CONFIG.SHEETS.SUMMARY);
    const salarySheet = ss.getSheetByName(CONFIG.SHEETS.SALARY);
    
    if (!summarySheet || !salarySheet) {
      SpreadsheetApp.getUi().alert('⚠️ Please create sheets first!');
      return;
    }
    
    // Attendance Chart
    const attendanceChart = chartSheet.newChart()
      .setChartType(Charts.ChartType.COLUMN)
      .addRange(summarySheet.getRange("A1:B" + summarySheet.getLastRow()))
      .setPosition(2, 1, 0, 0)
      .setOption('title', '📊 Employee Attendance Distribution')
      .setOption('hAxis', { title: 'Employee' })
      .setOption('vAxis', { title: 'Days Present' })
      .setOption('colors', ['#4CAF50'])
      .build();
    
    chartSheet.insertChart(attendanceChart);
    
    // Attendance Percentage Pie Chart
    const pieChart = chartSheet.newChart()
      .setChartType(Charts.ChartType.PIE)
      .addRange(summarySheet.getRange("A1:F" + summarySheet.getLastRow()))
      .setPosition(20, 1, 0, 0)
      .setOption('title', '📈 Attendance Percentage Distribution')
      .setOption('pieHole', 0.4)
      .build();
    
    chartSheet.insertChart(pieChart);
    
    // Salary Chart
    const salaryChart = chartSheet.newChart()
      .setChartType(Charts.ChartType.BAR)
      .addRange(salarySheet.getRange("A1:E" + salarySheet.getLastRow()))
      .setPosition(2, 8, 0, 0)
      .setOption('title', '💰 Employee Salary Breakdown')
      .setOption('hAxis', { title: 'Salary Amount' })
      .setOption('vAxis', { title: 'Employee' })
      .setOption('colors', ['#2196F3'])
      .build();
    
    chartSheet.insertChart(salaryChart);
    
    SpreadsheetApp.getUi().alert('✅ Charts generated successfully!');
    
  } catch (e) {
    SpreadsheetApp.getUi().alert('❌ Error generating charts: ' + e.message);
  }
}

// ============= COMPARE MONTHS =============
function compareMonths() {
  const ui = SpreadsheetApp.getUi();
  
  const month1Response = ui.prompt(
    '📊 Compare Months',
    'Enter first month (1-12):',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (month1Response.getSelectedButton() !== ui.Button.OK) return;
  
  const month2Response = ui.prompt(
    '📊 Compare Months',
    'Enter second month (1-12):',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (month2Response.getSelectedButton() !== ui.Button.OK) return;
  
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const comparisonSheet = ss.getSheetByName(CONFIG.SHEETS.COMPARISON) || ss.insertSheet(CONFIG.SHEETS.COMPARISON);
    comparisonSheet.clear();
    
    const title = `📊 ATTENDANCE COMPARISON - Month ${month1Response.getResponseText()} vs ${month2Response.getResponseText()}`;
    comparisonSheet.getRange("A1:E1").merge();
    comparisonSheet.getRange("A1").setValue(title);
    comparisonSheet.getRange("A1").setBackground(CONFIG.COLORS.PRIMARY).setFontColor("#ffffff").setFontWeight("bold").setFontSize(14);
    comparisonSheet.setRowHeight(1, 50);
    
    comparisonSheet.getRange("A3:E3").setValues([["👤 Employee", `📊 Month ${month1Response.getResponseText()}`, `📊 Month ${month2Response.getResponseText()}`, "📈 Difference", "🔄 Trend"]]);
    comparisonSheet.getRange("A3:E3").setBackground(CONFIG.COLORS.SECONDARY).setFontColor("#ffffff").setFontWeight("bold");
    
    comparisonSheet.setColumnWidth(1, 200);
    for (let i = 2; i <= 5; i++) {
      comparisonSheet.setColumnWidth(i, 140);
    }
    
    ui.alert('✅ Comparison sheet created! Add data to compare attendance.');
    
  } catch (e) {
    ui.alert('❌ Error: ' + e.message);
  }
}

// ============= FILTER BY DEPARTMENT =============
function filterByDepartment() {
  const ui = SpreadsheetApp.getUi();
  
  const deptResponse = ui.prompt(
    '🏢 Filter by Department',
    'Enter department name (Sales/IT/HR/Finance):',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (deptResponse.getSelectedButton() !== ui.Button.OK) return;
  
  const department = deptResponse.getResponseText();
  
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const employeesSheet = ss.getSheetByName(CONFIG.SHEETS.EMPLOYEES);
    
    if (!employeesSheet) {
      ui.alert('⚠️ Employees sheet not found!');
      return;
    }
    
    const data = employeesSheet.getDataRange().getValues();
    const filtered = data.filter(row => 
      row[0] === '👤 Name' || (row[2] && row[2].toString().toLowerCase() === department.toLowerCase())
    );
    
    let filterSheet = ss.getSheetByName(`🏢 ${department}`);
    if (!filterSheet) {
      filterSheet = ss.insertSheet(`🏢 ${department}`);
    } else {
      filterSheet.clear();
    }
    
    if (filtered.length > 1) {
      filterSheet.getRange(1, 1, filtered.length, filtered[0].length).setValues(filtered);
      filterSheet.getRange("A1:E1").setBackground(CONFIG.COLORS.PRIMARY).setFontColor("#ffffff").setFontWeight("bold");
      ui.alert(`✅ Found ${filtered.length - 1} employees in ${department} department`);
    } else {
      ui.alert(`⚠️ No employees found in ${department} department`);
    }
    
  } catch (e) {
    ui.alert('❌ Error: ' + e.message);
  }
}

// ============= DELETE ALL TABS =============
function deleteAllTabs() {
  if (!verifyAdminPassword()) return;
  
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    '🧹 RESET ALL DATA',
    'Are you sure you want to delete all data? This action cannot be undone!',
    ui.ButtonSet.YES_NO
  );
  
  if (response !== ui.Button.YES) return;
  
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = ss.getSheets();
    
    const sheetsToKeep = [];
    sheets.forEach(sheet => {
      const sheetName = sheet.getName();
      if (!Object.values(CONFIG.SHEETS).includes(sheetName) && 
          sheetName !== "📈 Charts" &&
          !sheetName.startsWith("🏢")) {
        sheetsToKeep.push(sheet);
      }
    });
    
    sheets.forEach(sheet => {
      const sheetName = sheet.getName();
      if (Object.values(CONFIG.SHEETS).includes(sheetName) || 
          sheetName === "📈 Charts" || 
          sheetName.startsWith("🏢")) {
        if (ss.getSheets().length > 1) {
          ss.deleteSheet(sheet);
        }
      }
    });
    
    ui.alert('✅ All data has been reset. Click "Create / Refresh System" to start fresh.');
    
  } catch (e) {
    ui.alert('❌ Error deleting sheets: ' + e.message);
  }
}

// ============= UTILITIES =============
function onInstall() {
  onOpen();
}
