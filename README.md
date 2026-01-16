# 📊 Attendance Manager Pro
## Advanced Attendance & Payroll Management for Google Sheets

![Version](https://img.shields.io/badge/version-2.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Language](https://img.shields.io/badge/language-Google%20Apps%20Script-yellow.svg)

---

## 🎯 Overview

**Attendance Manager Pro** is a comprehensive Google Apps Script solution for managing employee attendance, leave, working hours, salary calculations, and bonus management. Built with a user-friendly interface and advanced features, it automates HR operations and provides detailed reporting.

### Key Features:
- ✅ **Attendance Tracking** - Mark present, absent, or half-day status
- 📅 **Leave Management** - Track sick leave, casual leave, and special leave
- 💰 **Salary Calculation** - Automatic daily rate and final salary computation
- 🎁 **Bonus Calculation** - Performance-based bonus allocation
- 📊 **Monthly Reports** - Comprehensive attendance and salary reports
- 📈 **Charts & Graphs** - Visual representation of attendance and salary data
- 🔗 **Month-to-Month Comparison** - Compare attendance trends
- 🏢 **Department Filtering** - Filter employees by department
- 📧 **Email Reports** - Send generated reports via email
- 🔐 **Admin Password Protection** - Secure sensitive operations
- ⏱️ **Hours Tracking** - Daily work hours logging
- 🎨 **Professional UI** - Beautiful, emoji-enhanced interface

---

## 📋 Features in Detail

### 1. **Attendance Tracking** 📅
- Mark attendance with three statuses:
  - ✅ Present
  - 🔴 Absent
  - 🟡 Half Day
- Weekend highlighting
- Automatic attendance percentage calculation
- Performance ratings based on attendance

### 2. **Leave Management** 🏥
- Track three types of leaves:
  - 🏥 Sick Leave
  - 🎉 Casual Leave
  - 🚀 Special Leave
- Automatic leave balance calculation
- Total leaves per year: 12 days

### 3. **Salary Management** 💰
- Daily rate calculation based on monthly salary
- Effective days calculation (Present + 0.5 × Half Days)
- Final salary computation
- Currency support: Indian Rupees (₹)

### 4. **Bonus Calculation** 🎁
- Performance-based bonus allocation:
  - **95%+ Attendance**: 15% bonus
  - **85-94% Attendance**: 10% bonus
  - **75-84% Attendance**: 5% bonus
  - **Below 75%**: No bonus
- Automatic total salary with bonus calculation

### 5. **Hours Tracking** ⏱️
- Daily work hours logging
- Track hours for each day of the month
- Integration with attendance data

### 6. **Comprehensive Reports** 📊
The Monthly Report includes:
- **Attendance Summary** - Present, absent, half-days, and percentage
- **Leave Summary** - Breakdown of all leave types and balance
- **Salary Summary** - Daily rate, effective days, and final salary
- **Bonus Calculation** - Attendance %, performance tier, and bonus amount
- **Report Details** - Generation date, period, and system info

### 7. **Charts & Graphs** 📈
- **Attendance Distribution Chart** - Column chart showing present days per employee
- **Attendance Percentage Chart** - Pie chart of attendance distribution
- **Salary Breakdown Chart** - Bar chart of employee salaries

### 8. **Month-to-Month Comparison** 🔗
- Compare attendance between two different months
- Track attendance trends
- Identify improvements and patterns

### 9. **Department Filtering** 🏢
- Filter employees by department
- Generate department-specific reports
- Quick access to team data
- Supported departments: Sales, IT, HR, Finance

### 10. **Email Reports** 📧
- Send generated reports via email
- PDF format attachment
- Professional email template
- Recipient email validation

### 11. **Admin Password Protection** 🔐
- Password-protected admin settings
- Secure data deletion
- Default password: `admin123` (Change this!)
- Admin panel showing all enabled features

---

## 📊 Sheet Structure

| Sheet | Purpose | Contents |
|-------|---------|----------|
| **Employees** | Employee Master Data | Name, ID, Department, Salary, Email |
| **Attendance** | Daily Attendance Record | Employee names + daily status |
| **Summary** | Attendance Analytics | Present, Absent, Half, %, Rating |
| **Salary** | Salary Calculations | Daily Rate, Effective Days, Final Salary |
| **Leaves** | Leave Management | Sick, Casual, Special, Balance |
| **Hours Tracking** | Daily Hours | Work hours per day |
| **Bonus Calculation** | Bonus Analytics | Attendance %, Performance, Bonus % |
| **Monthly Report** | Comprehensive Report | All summaries combined |
| **Comparison Report** | Month Comparison | Data from two months |
| **Charts** | Visual Analytics | Attendance, Salary, Percentage charts |

---

## 🚀 Installation & Setup

### Step 1: Copy the Script to Google Sheets
1. Open a Google Sheet
2. Click **Extensions** → **Apps Script**
3. Copy the entire code from `Attendance-Manager-Pro.gs`
4. Paste it into the script editor
5. Click **Save**

### Step 2: Grant Permissions
1. Click the **Run** button
2. Authorize the application when prompted
3. Grant necessary permissions:
   - Read/write access to spreadsheet
   - Gmail access (for email reports)
   - Drive access (for PDF generation)

### Step 3: Initial Setup
1. Refresh your Google Sheet (Ctrl+R or Cmd+R)
2. You'll see the **⚙️ Attendance Manager Pro** menu
3. Click **🔄 Create / Refresh System** to initialize all sheets
4. Add your employees to the **Employees** sheet

---

## 📖 Usage Guide

### First Time Setup
```
1. Open Attendance Manager Pro menu
2. Select "🔄 Create / Refresh System"
3. Select month and year (optional)
4. System will create all required sheets
5. Edit "Employees" sheet with your data
```

### Recording Attendance
```
1. Go to "Attendance" sheet
2. For each employee, mark:
   - ✅ for Present
   - 🔴 for Absent
   - 🟡 for Half Day
3. Summary sheet updates automatically
```

### Managing Leaves
```
1. Go to "Leaves" sheet
2. Enter used leaves for each type
3. Balance calculates automatically (12 - used)
4. Leaves appear in monthly report
```

### Tracking Work Hours
```
1. Go to "Hours Tracking" sheet
2. Enter daily work hours (decimal format)
3. Example: 8.5 hours, 7.75 hours
4. Track productivity and overtime
```

### Generating Reports
```
1. Select "📊 Generate Monthly Report"
2. Choose desired report type:
   - Full report (all sections)
   - Attendance only
   - Salary only
3. Report generates in "Monthly Report" sheet
```

### Email Reports
```
1. First, generate the report
2. Select "📧 Email Report"
3. Enter recipient email address
4. System sends PDF via Gmail
```

### Creating Charts
```
1. Select "📈 Generate Charts"
2. Automatic chart creation:
   - Attendance distribution
   - Percentage pie chart
   - Salary breakdown
3. View in "📈 Charts" sheet
```

### Comparing Months
```
1. Select "🔗 Compare Months"
2. Enter first month (1-12)
3. Enter second month (1-12)
4. Comparison sheet created with headers
```

### Filtering by Department
```
1. Select "🏢 Filter by Department"
2. Enter department name:
   - Sales
   - IT
   - HR
   - Finance
3. New sheet created with filtered employees
```

---

## 🔐 Admin Functions

### Admin Settings
- **Access**: 🔐 Admin Settings → Enter Password
- **Default Password**: `admin123`
- **Change Password**: Edit `CONFIG.ADMIN_PASSWORD` in script

### Protected Functions
- 🧹 Reset All Data (requires admin password)
- 🔐 Admin Settings (requires admin password)

### Change Admin Password
```javascript
// Edit line 9 in the script:
const CONFIG = {
  ADMIN_PASSWORD: "your_new_password_here",
  // ... rest of config
}
```

---

## 📊 Formulas Used

### Attendance Percentage
```
= (Present Days + Half Days × 0.5) / Working Days × 100
```

### Performance Rating
- 95%+: 🟢 Excellent
- 85-94%: 🟡 Good
- 75-84%: 🟠 Average
- <75%: 🔴 Poor

### Daily Salary Rate
```
= Monthly Salary / Days in Month
```

### Final Salary
```
= Daily Rate × Effective Days
```

### Bonus Amount
```
= Base Salary × Bonus Percentage
- Bonus % based on Attendance %
```

### Leave Balance
```
= 12 - (Sick + Casual + Special)
```

---

## 🎨 Customization

### Change Colors
Edit the `CONFIG` object in the script:
```javascript
COLORS: {
  PRIMARY: "#0d47a1",        // Header color
  SECONDARY: "#1976d2",      // Secondary color
  SUCCESS: "#c8e6c9",        // Green
  DANGER: "#ffcdd2",         // Red
  WARNING: "#fff9c4"         // Yellow
}
```

### Change Bonus Tiers
Locate the `setupBonusSheet()` function and modify:
```javascript
// Change these percentages:
IF(B${row}>=95,0.15,    // 15% for 95%+
IF(B${row}>=85,0.1,     // 10% for 85-94%
IF(B${row}>=75,0.05,0)  // 5% for 75-84%
```

### Change Leave Allowance
In `setupLeavesSheet()`, modify:
```javascript
// Default is 12 days per year
sheet.getRange(row, 5).setFormula(`=12-(B${row}+C${row}+D${row})`);
// Change 12 to your desired number
```

### Change Currency
Edit the `CONFIG` object:
```javascript
CURRENCY: "₹",  // Change to $ or € or your currency
```

---

## 🐛 Troubleshooting

### Issue: "Authorization required"
- **Solution**: Click "Run" in Apps Script editor and grant permissions

### Issue: Charts not generating
- **Solution**: Ensure Summary sheet has employee data with attendance marked

### Issue: Email not sending
- **Solution**: Check Gmail account has 2-step verification (may need App Password)

### Issue: Password not working
- **Solution**: Check exact password in `CONFIG.ADMIN_PASSWORD` (case-sensitive)

### Issue: Missing sheets
- **Solution**: Click "🔄 Create / Refresh System" to recreate all sheets

---

## 📝 Sample Data

The system comes with 5 sample employees:
1. **Ankit Maurya** - Sales - ₹30,000
2. **Harman Singh** - Sales - ₹24,000
3. **Varun Kumar** - IT - ₹35,000
4. **Priya Singh** - HR - ₹28,000
5. **Rajesh Patel** - Finance - ₹32,000

Replace with your actual employee data.

---

## 🔄 Updates & Improvements

### Version 2.0 (Current)
- ✅ All 9 requested features added
- ✅ Admin password protection
- ✅ Comprehensive reporting
- ✅ Email functionality
- ✅ Charts and graphs
- ✅ Leave management
- ✅ Hours tracking
- ✅ Bonus calculation
- ✅ Department filtering
- ✅ Month-to-month comparison

### Planned Features
- 📱 Mobile-friendly view
- 🔔 Notifications and reminders
- 📤 Export to PDF/Excel
- 🌐 Multi-language support
- 🔄 Automated backups
- 📊 Advanced analytics dashboard

---

## ⚖️ License

This project is licensed under the **MIT License** - see LICENSE file for details.

---

## 👨‍💻 Author

**Attendance Manager Pro Team**
- Created for HR and Payroll Management
- Built with Google Apps Script
- Enhanced with modern UI/UX

---

## 📞 Support

For issues, questions, or feature requests:
1. Check the **Troubleshooting** section
2. Review the **Usage Guide**
3. Verify all sheets are created properly
4. Check admin password is correct

---

## ✨ Credits

Built with ❤️ using Google Apps Script
Designed for modern HR management
Emoji-enhanced for better UX

---

## 📚 Additional Resources

- [Google Apps Script Documentation](https://developers.google.com/apps-script)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Gmail API](https://developers.google.com/gmail/api)

---

## 🎯 Quick Links

| Feature | Menu Item |
|---------|-----------|
| Setup System | 🔄 Create / Refresh System |
| Select Period | 📅 Select Month & Year |
| Generate Report | 📊 Generate Monthly Report |
| Create Charts | 📈 Generate Charts |
| Email Report | 📧 Email Report |
| Compare Months | 🔗 Compare Months |
| Filter Dept | 🏢 Filter by Department |
| Admin Settings | 🔐 Admin Settings |
| Reset Data | 🧹 Reset All Data |

---

**Made with ❤️ for efficient HR management**

*Last Updated: January 2026*
*Version: 2.0*
