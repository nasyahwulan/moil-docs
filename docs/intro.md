---
id: intro
slug: /intro
title: Calibration Result System
sidebar_label: Introduction
sidebar_position: 1
---

# Calibration Result System

Welcome to the **Calibration Result Analysis System** documentation.

This system is designed to support the analysis of fisheye camera calibration results. It helps users load calibration data, compare multiple calibration rounds, evaluate the relationship between **IH**, **Alpha**, **ZFL**, and **distance**, and identify the most suitable calibration distance based on graph visualization and aggregation analysis.

The main purpose of this documentation is to explain how each part of the system works, how the calibration results are processed, and how users can operate the available tools correctly.

---

## System Concept

The Calibration Result System is built around the relationship between camera geometry, monitor position, projection parameters, and calibration result quality.

The figure below summarizes the main calibration concepts used in the system.

<div className="image-center">
  <img
    src={require("@site/docs/assets/images/calibration-result-system-overview.png").default}
    alt="Calibration Result System overview showing IH-Alpha, ZFL-IH, monitor geometry, and gap calculation concepts"
    style={{ width: "100%", maxWidth: "1200px" }}
  />
</div>

---

## 1. IH-Alpha Relationship

The **IH-Alpha** graph describes the relationship between **Image Height (IH)** and **Alpha angle**.

In fisheye camera calibration, every pixel position in the image can be related to an angular value. The IH value represents the image height or pixel distance from the optical center, while Alpha represents the angle in radians.

This graph is important because it helps the system understand how image pixels correspond to real angular positions.

| Term | Meaning |
|---|---|
| **IH** | Image height or pixel distance from the camera center. |
| **Alpha** | Angular value in radians. |
| **Polynomial Curve** | A fitted curve used to describe the IH-Alpha relationship. |
| **Calibration Round** | One set of calibration data processed by the system. |

### Purpose

The IH-Alpha graph is used to:

- Check whether the calibration curve is smooth.
- Compare data points with the fitted polynomial curve.
- Verify whether the Alpha value increases consistently with IH.
- Support later calculations for ZFL, distance, and aggregation.

---

## 2. ZFL-IH Relationship

The **ZFL-IH** graph shows the relationship between **ZFL** and **IH** for multiple calibration rounds.

ZFL is one of the calibration result values used by the system to evaluate the projection behavior of the fisheye camera. By comparing ZFL against IH, users can observe whether the calibration data is stable, smooth, and consistent across different rounds.

| Term | Meaning |
|---|---|
| **ZFL** | Calibration value related to the projected focal behavior. |
| **IH** | Pixel-based image height value. |
| **Round 1 - Round 10** | Multiple calibration datasets used for comparison. |
| **Curve Smoothness** | Indicates whether the calibration result is stable or unstable. |

### Purpose

The ZFL-IH graph is used to:

- Compare calibration results from multiple rounds.
- Detect unstable or abnormal calibration data.
- Support aggregation calculation.
- Help determine the best distance configuration.

---

## 3. Monitor Geometry and Gap Configuration

The monitor geometry section explains how the system calculates the relationship between the camera, monitor, and projected pattern area.

The calibration setup uses monitor gaps and pattern dimensions to estimate angular relationships. These values are required because the physical placement of the monitor affects how the calibration pattern is observed by the fisheye camera.

| Parameter | Meaning |
|---|---|
| **H_Gap** | Horizontal gap or horizontal monitor spacing. |
| **V_Gap** | Vertical gap or vertical monitor spacing. |
| **D** | Distance between the camera and the monitor plane. |
| **PCT_top** | Pattern coordinate or pattern size on the top side. |
| **PCT_side** | Pattern coordinate or pattern size on the side. |
| **Alpha_top** | Angle calculated from the top pattern geometry. |
| **Alpha_side** | Angle calculated from the side pattern geometry. |

### Main Calculation Concept

The system uses the monitor geometry to calculate angular values such as:

```text
alpha_top = atan(PCT_top / D)
```

```text
alpha_side = π / 2 + atan((V_Gap + PCT_side - D) / H_Gap)
```

These calculations connect the real-world monitor setup with the calibration result values shown in the graphs.

---

## 4. Distance Optimization

One of the main goals of the Calibration Result System is to find the best distance value for calibration processing.

The system can test different distance values and calculate the calibration result for each distance. The result is then evaluated using aggregation and graph smoothness.

### Why Distance Is Important

Distance affects the relationship between:

- Camera position
- Monitor position
- Pattern projection
- IH value
- Alpha angle
- ZFL result
- Aggregation value

A poor distance value can produce unstable curves, large jumps, or inconsistent calibration results. A better distance value usually produces a smoother ZFL-IH curve and lower aggregation value.

---

## 5. Aggregation Analysis

Aggregation is used to evaluate the smoothness and stability of the calibration curve.

A lower aggregation value usually means the calibration curve is smoother and more stable. A higher aggregation value can indicate unstable points, large jumps, or poor calibration quality.

| Aggregation Result | Meaning |
|---|---|
| **Low Aggregation** | The calibration curve is smoother and more stable. |
| **High Aggregation** | The calibration curve has larger changes or unstable points. |
| **Minimum Aggregation** | The best candidate result for the selected distance or range. |

### Purpose

Aggregation analysis helps users:

- Compare calibration quality across distances.
- Find the best distance automatically.
- Analyze specific IH ranges.
- Detect unstable calibration results.

---

## Key Features

The Calibration Result System provides several important features for calibration analysis.

| Feature | Description |
|---|---|
| **Multi-round Analysis** | Compare multiple calibration rounds in one system. |
| **IH-Alpha Visualization** | Display the relationship between image height and Alpha angle. |
| **ZFL-IH Visualization** | Display the relationship between ZFL and IH for calibration checking. |
| **Distance Optimization** | Find the best distance value for calibration processing. |
| **Aggregation Calculation** | Evaluate curve smoothness and calibration stability. |
| **Range-based Filtering** | Analyze calibration results within selected IH ranges. |
| **Database Loading** | Load saved calibration records from the database. |
| **Excel Import and Export** | Load and save calibration result data using Excel files. |
| **Graph Tools** | Display result graphs for visual checking and comparison. |
| **Stop and Update Controls** | Stop long calculations and refresh result tables or graphs. |

---

## Documentation Structure

This documentation is divided into several main sections.

| Section | Purpose |
|---|---|
| **Installation** | Explains how to install the client and server environments. |
| **System Overview** | Explains the main window, calibration result view, monitor viewer, pattern generator, and 3D verification tools. |
| **Calibration** | Explains the camera calibration workflow and how to reload calibration data. |
| **Database** | Explains how calibration records are stored, loaded, and maintained. |

---

## Recommended Reading Order

For first-time users, it is recommended to read the documentation in this order:

1. **Installation**  
   Prepare the client and server environments.

2. **System Overview**  
   Understand the main windows and available tools.

3. **Calibration**  
   Learn the camera calibration and reload workflow.

4. **Calibration Result View**  
   Understand how IH, Alpha, ZFL, distance, and aggregation are analyzed.

5. **Database**  
   Learn how saved calibration data is loaded and managed.

---

## Basic Workflow

The general workflow of the Calibration Result System is shown below.

```text
Load calibration data
        ↓
Select calibration rounds
        ↓
Check IH-Alpha and ZFL-IH graphs
        ↓
Set distance, gap, and range parameters
        ↓
Calculate calibration results
        ↓
Run aggregation analysis
        ↓
Find the best distance
        ↓
Update table and graph results
        ↓
Save or export the final result
```

---

## Important Notes

<div className="custom-note custom-important">
  <div className="custom-note-title">📌 Read First</div>
  <div>
    Start with the <strong>Installation</strong> section, then review the <strong>System Overview</strong> before performing your first calibration.
  </div>
</div>

<div className="custom-note custom-warning">
  <div className="custom-note-title">⚠️ Calibration Data Reminder</div>
  <div>
    Always check that the calibration data, monitor geometry, gap values, and distance settings are correct before running the final calculation.
  </div>
</div>

---

## Summary

The **Calibration Result Analysis System** helps users evaluate fisheye camera calibration results through graph visualization, multi-round comparison, distance optimization, and aggregation analysis.

By using the IH-Alpha graph, ZFL-IH graph, monitor geometry calculation, and aggregation tools, users can identify stable calibration results and select the best distance configuration for accurate fisheye camera analysis.