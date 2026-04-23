# 📂 Data Loading Guide

This section explains how to load calibration data into the **Moil Cali Result** system. Data can be loaded from multiple sources depending on your workflow.

---

## 1. Load Excel (Single Round)

Use this option when you want to load data into **one specific Round tab only**.

### Function
- Loads ICT and PCT data from an Excel file  
- Applies only to the **currently selected round**

### Steps
1. Select the desired **Round tab**  
2. Click **`Load Excel`**  
3. Choose the Excel file  
4. The data will appear in the table  

### Notes
- Only accepts **Excel files (.xlsx)**  
- Make sure the file format matches the calibration output  

---

## 2. Load All Excel (Batch Load)

Use this option to load multiple rounds at once.

### Function
- Automatically loads Excel data into **all Round tabs (Round 1–10)**  

### Steps
1. Click **`Load All Excel`**  
2. Select a **folder** (not individual files)  
3. The system will:
   - Scan all Excel files inside  
   - Assign them to corresponding rounds  
   - Populate all available tables  

### Notes
- This feature only reads **folders**  
- File naming should follow round structure (e.g., `1.xlsx`, `2.xlsx`, etc.)  

---

## 3. Load Database

Use this option to retrieve data from the system database.

### Function
- Loads previously stored calibration results  

### Steps
1. Click **`Load Database`**  
2. Use the search filters:
   - Camera brand  
   - Camera name  
   - Camera number  
   - FOV  
   - Resolution  
   - Calibration system  
   - Calibrator name  
   - Calibration date  

3. Right-click on a result:
   - **Load to System** → load data into tables  
   - **Open URL** → open data source (OneDrive)

---

### 3.1 Load to System
- Downloads data from the database  
- Stores it locally (cache)  
- Automatically fills available Round tabs  

⚠️ If only certain rounds exist, only those tabs will be filled  

---

### 3.2 Open URL
- Opens the original file or folder in **OneDrive**  
- Requires confirmation before opening  

---

## 4. Cali Folder (OneDrive Load)

Use this feature to load data directly from a OneDrive folder.

### Function
- Downloads calibration data using a shared link  

### Steps
1. Copy the OneDrive folder link  
2. Paste it into the **Cali Folder** field  
3. Press **Enter**  
4. Wait for the download process  

After download:
1. Data will appear in **Tree View**  
2. Double-click the folder  
3. Confirm data clearing (if prompted)  
4. Data will be loaded into the system  

---

## 5. Load During Calibration (Update Table)

This method is used **during live calibration**.

### Function
- Loads ICT and PCT data directly from the calibration system  

### Steps
1. Perform calibration for one round  
2. Click **`Update Table`**  
3. Data will be inserted into the selected Round tab  

### Use Case
- Real-time calibration workflow  
- Immediate data visualization  

---

## 🔄 Summary

| Method            | Source              | Scope              | Use Case                     |
|------------------|--------------------|--------------------|------------------------------|
| Load Excel       | Excel file         | Single round       | Manual loading               |
| Load All Excel   | Folder             | All rounds         | Batch loading                |
| Load Database    | Internal database  | Multiple rounds    | Retrieve past data           |
| Cali Folder      | OneDrive           | Multiple rounds    | Cloud-based data loading     |
| Update Table     | Calibration system | Current round      | Real-time calibration        |