---
id: database-overview
slug: /database/database-overview
title: Database Overview
sidebar_label: Database Overview
---

# Database Overview

This page describes the **Database** used by the Calibration Result System.

The database stores calibration metadata, calibration round data, and file references used by the application.  
In the current system, the database is used to connect camera calibration records with related files stored in OneDrive or SharePoint.

---

## Overview

The Calibration Result System uses a SQLite database file named:

```text
cali_system_v2.db
```

The database is mainly used to store:

| Data Type | Description |
|---|---|
| **Camera Calibration Main Data** | General camera information such as camera brand, product name, resolution, calibration system, calibrator, calibration date, ICX, and ICY. |
| **Calibration Round Data** | File references for each calibration round, including Excel files, captured images, ICT/PCT files, session files, and profile files. |
| **Remote File Metadata** | File information from OneDrive or SharePoint, including file name, file type, web URL, size, created time, and modified time. |

The database does not store the full file content directly.  
Instead, it stores **file IDs and remote file metadata**, so the application can locate and load the correct calibration files when needed.

---

## 1. Database Tables

The database contains the following main tables:

| Table | Purpose |
|---|---|
| `camera_main` | Stores the main calibration record for each camera. |
| `camera_round` | Stores calibration files and data references for each calibration round. |
| `remote_file` | Stores metadata of files located in OneDrive or SharePoint. |
| `sqlite_sequence` | Internal SQLite table used for auto-increment IDs. |

<div className="custom-note custom-important">
  <div className="custom-note-title">📌 Main Database Concept</div>
  <p>
    The main calibration data is stored in <strong>camera_main</strong>.
    Each camera record can have multiple calibration rounds stored in <strong>camera_round</strong>.
    File references from both tables point to records in <strong>remote_file</strong>.
  </p>
</div>

---

## 2. Table: `camera_main`

The `camera_main` table stores the main information of each camera calibration record.

Each row represents one calibration dataset for one camera product, calibration system, and calibration date.

### 2.1 Purpose

This table is used to store camera identity, calibration information, center point values, and references to important calibration files.

### 2.2 Fields

| Field | Type | Description |
|---|---|---|
| `id` | INTEGER | Primary key. Unique ID for each main camera calibration record. |
| `camera_brand` | TEXT | Camera brand name, for example `axis`, `lrcp`, `wxsj`, or other camera brands. |
| `product_name` | TEXT | Camera product or model name. |
| `number` | TEXT | Camera number or camera index. |
| `fov` | REAL | Camera field of view value. This can be empty if the value is not available. |
| `resolution` | TEXT | Camera image resolution, for example `2880x2880`. |
| `calibration_system` | TEXT | Calibration system used for the camera, for example `win7`, `yinda`, or `yuanman`. |
| `calibrator` | TEXT | Name of the person who performed the calibration. |
| `calibration_date` | TEXT | Date when the calibration was performed. |
| `icx` | REAL | Image center X value from the calibration result. |
| `icy` | REAL | Image center Y value from the calibration result. |
| `result_excel_file_id` | INTEGER | Reference ID to the result Excel file in `remote_file`. |
| `url_file_id` | INTEGER | Reference ID to the URL file in `remote_file`. |
| `cali_result_file_id` | INTEGER | Reference ID to the calibration result file in `remote_file`. |
| `params_json_file_id` | INTEGER | Reference ID to the parameter JSON file in `remote_file`. |
| `main_json_file_id` | INTEGER | Reference ID to the main JSON file in `remote_file`. |
| `folder_file_id` | INTEGER | Reference ID to the main folder in `remote_file`. |
| `round1_negative_file_id` | INTEGER | Reference ID to the round 1 negative capture file in `remote_file`. |
| `round1_positive_file_id` | INTEGER | Reference ID to the round 1 positive capture file in `remote_file`. |
| `created_at` | TEXT | Time when the database record was created. |

### 2.3 Example Role in the Application

When the user clicks **Load Database**, the application can use this table to display the list of available calibration records.

The information shown to the user may include:

| Display Information | Database Field |
|---|---|
| Camera brand | `camera_brand` |
| Product name | `product_name` |
| Camera number | `number` |
| Resolution | `resolution` |
| Calibration system | `calibration_system` |
| Calibrator | `calibrator` |
| Calibration date | `calibration_date` |
| ICX | `icx` |
| ICY | `icy` |

---

## 3. Table: `camera_round`

The `camera_round` table stores files and data references for each calibration round.

Each row represents one round that belongs to one main camera calibration record.

### 3.1 Purpose

This table allows the system to organize calibration files by round.

For example, one camera calibration record in `camera_main` can have multiple rounds such as:

```text
Round 1
Round 2
Round 3
...
Round 10
```

Each round may contain its own Excel file, captured image files, ICT/PCT images, session files, and profile text files.

### 3.2 Fields

| Field | Type | Description |
|---|---|---|
| `id` | INTEGER | Primary key. Unique ID for each round record. |
| `main_id` | INTEGER | ID of the related camera record in `camera_main`. |
| `round` | INTEGER | Calibration round number. |
| `excel_file_id` | INTEGER | Reference ID to the round Excel file in `remote_file`. |
| `capture_negative_file_id` | INTEGER | Reference ID to the negative capture image file in `remote_file`. |
| `capture_positive_file_id` | INTEGER | Reference ID to the positive capture image file in `remote_file`. |
| `main_image_file_id` | INTEGER | Reference ID to the main image file in `remote_file`. |
| `ictpctcut_excel_file_id` | INTEGER | Reference ID to the ICT/PCT cut Excel file in `remote_file`. |
| `ictpct_png_file_id` | INTEGER | Reference ID to the ICT/PCT PNG file in `remote_file`. |
| `ictpct_cut_png_file_id` | INTEGER | Reference ID to the ICT/PCT cut PNG file in `remote_file`. |
| `round_main_png_file_id` | INTEGER | Reference ID to the main PNG image for this round in `remote_file`. |
| `session_bmp_file_id` | INTEGER | Reference ID to the session BMP file in `remote_file`. |
| `session_dat_file_id` | INTEGER | Reference ID to the session DAT file in `remote_file`. |
| `session_i_bmp_file_id` | INTEGER | Reference ID to the session I BMP file in `remote_file`. |
| `session_profile_txt_file_id` | INTEGER | Reference ID to the session profile TXT file in `remote_file`. |

### 3.3 Unique Rule

The database uses a unique rule for:

```text
main_id + round
```

This means one camera calibration record cannot have duplicate data for the same round number.

For example:

| `main_id` | `round` | Allowed? |
|---|---|---|
| 1 | 1 | Yes |
| 1 | 2 | Yes |
| 1 | 1 | No, because round 1 already exists for main ID 1 |

---

## 4. Table: `remote_file`

The `remote_file` table stores metadata for files stored outside the database.

Most file references in `camera_main` and `camera_round` point to this table.

### 4.1 Purpose

This table is used as the file reference center of the database.

Instead of saving large images, Excel files, JSON files, and text files directly inside the database, the system stores their metadata here.

### 4.2 Fields

| Field | Type | Description |
|---|---|---|
| `id` | INTEGER | Primary key. Unique ID for each remote file record. |
| `drive_id` | TEXT | Drive ID from OneDrive or SharePoint. |
| `drive_item_id` | TEXT | Unique file item ID from OneDrive or SharePoint. |
| `name` | TEXT | File or folder name. |
| `file_type` | TEXT | File category, such as `image`, `excel`, `json`, `text`, `url`, or `other`. |
| `web_url` | TEXT | Web URL used to open or access the file. |
| `size_bytes` | INTEGER | File size in bytes. |
| `created_time` | TEXT | File creation time from the remote storage. |
| `modified_time` | TEXT | File modification time from the remote storage. |

### 4.3 File Types

The database can store different remote file types, such as:

| File Type | Description |
|---|---|
| `image` | Image files such as PNG, BMP, or captured calibration images. |
| `excel` | Excel files used for calibration result or ICT/PCT data. |
| `json` | JSON files used for calibration parameters or system configuration. |
| `text` | Text files such as profile files. |
| `url` | URL shortcut or link file. |
| `other` | Folder or file type that does not match the categories above. |

---

## 5. Relationship Between Tables

The database relationship can be understood as follows:

```text
camera_main
    │
    │ one camera calibration record
    │
    ├── camera_round
    │       ├── round 1 files
    │       ├── round 2 files
    │       ├── round 3 files
    │       └── ...
    │
    └── remote_file
            ├── folder
            ├── Excel files
            ├── JSON files
            ├── images
            ├── text files
            └── URL files
```

### 5.1 Main Relationship

| Source Table | Field | Target Table | Meaning |
|---|---|---|---|
| `camera_round` | `main_id` | `camera_main.id` | Connects each round to its main calibration record. |
| `camera_main` | `folder_file_id` | `remote_file.id` | Connects the main record to its remote calibration folder. |
| `camera_main` | `params_json_file_id` | `remote_file.id` | Connects the main record to its parameter JSON file. |
| `camera_main` | `cali_result_file_id` | `remote_file.id` | Connects the main record to its calibration result file. |
| `camera_round` | `excel_file_id` | `remote_file.id` | Connects each round to its Excel file. |
| `camera_round` | `main_image_file_id` | `remote_file.id` | Connects each round to its main image file. |
| `camera_round` | `session_profile_txt_file_id` | `remote_file.id` | Connects each round to its profile text file. |

<div className="custom-note custom-warning">
  <div className="custom-note-title">⚠️ Important Database Note</div>
  <p>
    The file ID fields are used like relationships to <strong>remote_file.id</strong>.
    However, the current SQLite schema does not define explicit foreign key constraints.
    Because of this, file records should be deleted or modified carefully.
  </p>
</div>

---

## 6. Indexes

The database includes indexes to make searching faster.

| Index Name | Table | Purpose |
|---|---|---|
| `idx_camera_main_brand_name` | `camera_main` | Speeds up searching by camera brand and product name. |
| `idx_camera_round_main_round` | `camera_round` | Speeds up loading round data by main record ID and round number. |
| `idx_remote_file_drive_item_id` | `remote_file` | Speeds up searching remote files by OneDrive or SharePoint item ID. |

These indexes are important because the application may need to quickly search calibration records, load round data, or find remote files.

---

## 7. Access from the Application

The calibration result window uses the database when the user clicks **Load Database**.

### 7.1 General Loading Flow

```text
User clicks Load Database
        ↓
Application opens cali_system_v2.db
        ↓
Application reads camera_main
        ↓
User selects one camera calibration record
        ↓
Application reads related camera_round records
        ↓
Application reads file information from remote_file
        ↓
Calibration data and related files are loaded into the system
```

### 7.2 Main Data Loading

The application first reads data from `camera_main`.

This allows the system to know:

| Information | Source |
|---|---|
| Which camera brand is being used | `camera_main.camera_brand` |
| Which product is selected | `camera_main.product_name` |
| Which resolution is used | `camera_main.resolution` |
| Which calibration system was used | `camera_main.calibration_system` |
| Who calibrated the camera | `camera_main.calibrator` |
| When calibration was performed | `camera_main.calibration_date` |
| What ICX and ICY values are stored | `camera_main.icx`, `camera_main.icy` |

### 7.3 Round Data Loading

After a main camera record is selected, the application can load all related rounds from `camera_round`.

The round data tells the system which files belong to each round.

For example:

| Round Data | Description |
|---|---|
| Excel file | Used to load round calculation data. |
| Positive capture file | Used for positive calibration image reference. |
| Negative capture file | Used for negative calibration image reference. |
| Main image file | Used as the main round image. |
| ICT/PCT image file | Used for calibration pattern analysis. |
| Session files | Used for stored session information. |
| Profile text file | Used for profile-related calibration information. |

### 7.4 Remote File Loading

When the application needs to open a file, it uses file IDs from `camera_main` or `camera_round`.

Then it searches the matching record in `remote_file`.

For example:

```text
camera_round.excel_file_id
        ↓
remote_file.id
        ↓
remote_file.web_url
        ↓
Application opens or downloads the Excel file
```

---

## 8. Example SQL Queries

This section shows simple examples of how the data can be retrieved.

### 8.1 Show All Main Camera Records

```sql
SELECT
    id,
    camera_brand,
    product_name,
    number,
    resolution,
    calibration_system,
    calibrator,
    calibration_date,
    icx,
    icy
FROM camera_main
ORDER BY calibration_date DESC;
```

### 8.2 Load All Rounds for One Camera Record

```sql
SELECT
    id,
    main_id,
    round,
    excel_file_id,
    capture_negative_file_id,
    capture_positive_file_id,
    main_image_file_id,
    ictpctcut_excel_file_id,
    session_profile_txt_file_id
FROM camera_round
WHERE main_id = ?
ORDER BY round ASC;
```

### 8.3 Get Remote File Information

```sql
SELECT
    id,
    name,
    file_type,
    web_url,
    size_bytes,
    created_time,
    modified_time
FROM remote_file
WHERE id = ?;
```

### 8.4 Join Camera Round with Excel File Information

```sql
SELECT
    cr.main_id,
    cr.round,
    rf.name AS excel_file_name,
    rf.file_type,
    rf.web_url
FROM camera_round cr
LEFT JOIN remote_file rf
    ON cr.excel_file_id = rf.id
WHERE cr.main_id = ?
ORDER BY cr.round ASC;
```

---

## 9. Maintenance

Database maintenance is important because this database connects many calibration records with many remote files.

### 9.1 Backup

Before editing, cleaning, or migrating the database, always create a backup copy of:

```text
cali_system_v2.db
```

Recommended backup naming format:

```text
cali_system_v2_backup_YYYYMMDD.db
```

Example:

```text
cali_system_v2_backup_20260513.db
```

<div className="custom-note custom-warning">
  <div className="custom-note-title">⚠️ Backup First</div>
  <p>
    Always back up the database before performing maintenance, cleanup, or schema changes.
    This is important because deleting records from <strong>remote_file</strong> may break file references in
    <strong>camera_main</strong> or <strong>camera_round</strong>.
  </p>
</div>

### 9.2 Cleanup Notes

When cleaning the database, check these items carefully:

| Maintenance Item | Description |
|---|---|
| Duplicate camera records | Check whether the same camera brand, product name, number, resolution, calibration system, and date are duplicated. |
| Missing remote files | Check whether file ID fields still point to valid records in `remote_file`. |
| Unused remote files | Check whether some records in `remote_file` are no longer used by `camera_main` or `camera_round`. |
| Empty optional fields | Some fields such as `fov`, `icx`, `icy`, or several file ID fields may be empty. Verify whether this is expected. |
| Broken web URLs | Confirm that the `web_url` values still point to valid OneDrive or SharePoint files. |

### 9.3 Migration Notes

If the database structure needs to be updated in the future, consider adding:

| Improvement | Reason |
|---|---|
| Explicit foreign keys | To protect relationships between `camera_main`, `camera_round`, and `remote_file`. |
| Created and updated timestamps for all tables | To track when each record was created or modified. |
| Status field | To mark records as active, archived, or deleted. |
| Calibration result fields | To store final result values directly if needed by the application. |
| More file type validation | To make sure file categories are consistent. |

---

## 10. Current Database Snapshot

Based on the current `cali_system_v2.db` file:

| Table | Current Record Count | Description |
|---|---:|---|
| `camera_main` | 139 | Main camera calibration records. |
| `camera_round` | 747 | Calibration round records. |
| `remote_file` | 5054 | Remote file metadata records. |

The `remote_file` table contains different file categories:

| File Type | Current Count |
|---|---:|
| `image` | 2623 |
| `other` | 1138 |
| `excel` | 763 |
| `json` | 344 |
| `text` | 154 |
| `url` | 32 |

---

## Summary

The database is the central storage system for the Calibration Result System.

It stores:

| Main Function | Table Used |
|---|---|
| Camera calibration metadata | `camera_main` |
| Calibration round file references | `camera_round` |
| OneDrive or SharePoint file metadata | `remote_file` |

The application uses this database to load calibration records, connect each record to its rounds, and find the required files from remote storage.

In simple terms:

```text
camera_main = main camera calibration information
camera_round = calibration data per round
remote_file = file location and metadata
```

This structure allows the Calibration Result System to manage many camera calibration datasets while keeping the actual files organized in remote storage.