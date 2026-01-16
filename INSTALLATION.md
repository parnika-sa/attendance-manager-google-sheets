# Installation Guide - Attendance Manager Pro

## Prerequisites
- Google Account
- Google Sheet (new or existing)
- Basic familiarity with Google Sheets

---

## Step-by-Step Installation

### 1️⃣ Create or Open Google Sheet
- Go to [Google Sheets](https://sheets.google.com)
- Click **"+ New"** to create a new spreadsheet
- OR open an existing spreadsheet
- Name it: **"Attendance Manager Pro"**

### 2️⃣ Open Apps Script Editor
- In your Google Sheet, click **Extensions**
- Select **Apps Script**
- A new tab will open with the script editor

### 3️⃣ Copy the Code
- Delete any existing code in the editor
- Copy the entire code from `Attendance-Manager-Pro.gs`
- Paste it into the script editor

### 4️⃣ Save the Project
- Click **💾 Save** button
- Name your project: **"Attendance Manager Pro"**

### 5️⃣ Authorize the Script
- Click the **▶️ Run** button
- A permission dialog will appear
- Click **"Review permissions"**
- Select your Google Account
- Click **"Allow"** to grant access

### 6️⃣ Return to Google Sheet
- Close the Apps Script tab
- Go back to your Google Sheet
- **Refresh the page** (Ctrl+R or Cmd+R)

### 7️⃣ Verify Installation
- You should now see **⚙️ Attendance Manager Pro** menu
- Click the menu to verify it shows all options
- If menu is not visible, try refreshing again

### 8️⃣ Initialize System
- Click **⚙️ Attendance Manager Pro** menu
- Select **🔄 Create / Refresh System**
- Choose month and year (optional)
- Click OK
- System will create all required sheets

### 9️⃣ Add Employee Data
- Go to **Employees** sheet
- Delete sample data if needed
- Add your employees:
  - Name, ID, Department, Salary, Email
- Save the sheet

### 🔟 Start Using
- Mark attendance in **Attendance** sheet
- Generate reports as needed
- Send reports via email

---

## ✅ Installation Checklist

- [ ] Google Account created
- [ ] Google Sheet created
- [ ] Apps Script editor opened
- [ ] Code copied and pasted
- [ ] Project saved
- [ ] Permissions authorized
- [ ] Page refreshed
- [ ] Menu visible in sheet
- [ ] System initialized (sheets created)
- [ ] Sample employees replaced with real data

---

## 🔧 Troubleshooting Installation

### Menu Not Appearing
**Problem**: After refresh, "⚙️ Attendance Manager Pro" menu doesn't show

**Solutions**:
1. Refresh the sheet again (Ctrl+R)
2. Close and reopen the sheet
3. Clear browser cache and try again
4. Check if you're in the correct spreadsheet

### Authorization Error
**Problem**: Permission denied when running script

**Solutions**:
1. Click **Run** again and select your account
2. Make sure you're logged into correct Google Account
3. Grant all requested permissions
4. Try in incognito mode if persistent

### Sheets Not Created
**Problem**: After setup, sheets are empty

**Solutions**:
1. Click **🔄 Create / Refresh System** again
2. Check if "Employees" sheet has data
3. If empty, add sample employee data first
4. Try selecting a different month/year

### Email Not Sending
**Problem**: Email report fails to send

**Solutions**:
1. Check Gmail account is active and accessible
2. Verify email address format (example@gmail.com)
3. If using 2-step verification, create [App Password](https://support.google.com/accounts/answer/185833)
4. Check Gmail quota limits

### Permission Issues
**Problem**: "Authorization required" or "You don't have permission"

**Solutions**:
1. Share the Google Sheet with yourself if needed
2. Go back to Apps Script editor
3. Click **Run** and reauthorize
4. Try running a specific function first

---

## 📞 Getting Help

If installation fails:
1. Check this guide thoroughly
2. Review all permissions granted
3. Verify Apps Script code is complete
4. Try in a different browser
5. Contact support with error message

---

## ⚙️ Post-Installation Configuration

### Change Admin Password (Recommended)
1. Go to **Extensions** → **Apps Script**
2. Find this line (around line 9):
   ```javascript
   ADMIN_PASSWORD: "admin123",
   ```
3. Replace `"admin123"` with your password
4. Save changes
5. Refresh Google Sheet

### Customize Department List
1. In Apps Script, find the `filterByDepartment()` function
2. Modify the prompt text with your departments:
   ```javascript
   'Enter department name (YOUR_DEPT_1/YOUR_DEPT_2/YOUR_DEPT_3):'
   ```
3. Save and refresh

### Adjust Color Scheme
1. Find the `CONFIG` object (lines 5-20)
2. Edit color codes:
   ```javascript
   PRIMARY: "#0d47a1",      // Dark blue
   SECONDARY: "#1976d2",    // Lighter blue
   // ... etc
   ```
3. Save and refresh

---

## 🎨 Customization After Installation

### Add More Sample Employees
1. Open the **Employees** sheet
2. Find rows 2-6 (sample data)
3. Edit or add more employees
4. Keep format: Name, ID, Department, Salary, Email
5. Run **🔄 Create / Refresh System** to update all sheets

### Change Leave Allowance
1. Go to **Extensions** → **Apps Script**
2. Find `setupLeavesSheet()` function
3. Locate: `=12-(B${row}+C${row}+D${row})`
4. Change `12` to your desired number (e.g., `18`)
5. Save and run **🔄 Create / Refresh System**

### Adjust Bonus Percentages
1. In Apps Script, find `setupBonusSheet()` function
2. Modify percentages in formulas:
   - 95%+ → 15% bonus
   - 85-94% → 10% bonus
   - 75-84% → 5% bonus
3. Change these values as needed
4. Save and refresh

---

## 📱 Mobile Access

The script works on mobile devices via:
1. Google Sheets mobile app
2. Mobile web browser
3. May need to zoom to see all columns

**Recommended**: Use desktop for best experience

---

## 🔐 Security Notes

1. **Change default password** immediately
2. Only share sheet with authorized users
3. Review granted permissions quarterly
4. Don't share script with untrusted sources
5. Backup important data regularly

---

## 🎉 Installation Complete!

You're now ready to use **Attendance Manager Pro**. 

**Next Steps**:
1. Add your employee data
2. Mark attendance for current month
3. Generate your first report
4. Try email or chart features

For detailed usage, see **README.md** or **USER_GUIDE.md**

Happy HR management! 📊
