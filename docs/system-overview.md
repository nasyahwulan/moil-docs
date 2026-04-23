# System Overview – Main Window

The **Main Window** is the central interface of the Moil Fisheye Calibration System.  
It is designed to support the full workflow of multi-round fisheye calibration, from data acquisition to validation.

The GUI is divided into **eight major functional regions**, where each region has a specific role and interacts with others to complete the calibration pipeline.

---

## Main Window Layout



---

## Functional Regions

### 1. Server URL Configuration Panel
This panel is used to configure communication endpoints between the system and external devices.

**Functions:**
- Set Axis Controller URL
- Set Monitor URL
- Set Camera URL
- Update connection dynamically

**Purpose:**
Ensures proper communication between hardware (motor system, camera, monitoring system) and software.

---

### 2. Axis Control Panel (5-Axis Motion Controller)

This panel controls the physical movement of the calibration platform.

**Controlled Axes:**
- X, Y, Z (linear movement)
- Yaw, Pitch (rotational movement)

**Key Features:**
- Real-time axis position display
- Sensor status indicators (Limit, Home)
- Speed selection (Low / High)
- Relative movement control (Positive / Negative direction)
- Adjustable movement distance
- Emergency STOP button
- Alpha (α) and Beta (β) parameter input

**Purpose:**
Allows precise positioning of the fisheye camera during calibration.

---

### 3. Monitor Panel (Pattern Generator & Viewer)

This panel provides visualization and pattern generation.

**Functions:**
- Monitor Viewer (display output)
- Pattern Generator (PCT)

**Purpose:**
Used to generate calibration patterns and visualize them for alignment and validation.

---

### 4. Camera Control Panel (Positive / Negative Shot)

Handles image acquisition and preview.

**Components:**
- Pattern Mode (Positive / Negative)
- Image Path display
- Original Resolution (Org Res)
- Calibration Resolution (Cali Res)
- Image preview area

**Actions:**
- Capture image
- Positive Shot
- Negative Shot
- Load external image

**Purpose:**
Collects calibration images required for multi-round processing.

---

### 5. Centering Panel Configuration

Used to determine and adjust the fisheye center.

**Modes:**
- Auto
- Manual
- Locked

**Parameters:**
- Positive Threshold (PosThr)
- Negative Threshold (NegThr)
- Center ROI

**Outputs:**
- CPX / CPY (center coordinates)
- Edge detection visualization (radius, color, thickness)

**Purpose:**
Ensures accurate center detection of fisheye projection, which is critical for calibration accuracy.

---

### 6. Sub-Window – Calibration Result Panel

Displays calibration results after computation.

**Functions:**
- Show Moil Calibration Result
- Access processed calibration parameters

**Purpose:**
Provides final calibration outputs used for further processing or deployment.

---

### 7. Sub-Window – 3D Verification Panel

Used for validating calibration results in 3D space.

**Functions:**
- 3D visualization of calibration
- Geometry validation

**Purpose:**
Ensures that calibration results are geometrically consistent and accurate.

---

### 8. Symmetry Waveform Histogram (Histogram 1 & Histogram 2)

Displays waveform-based analysis of calibration data.

**Components:**
- Histogram 1
- Histogram 2
- Curve selection (8 directions: N, S, E, W, NE, NW, SE, SW)
- Curve color control

**Purpose:**
Used to analyze symmetry and aggregation behavior of fisheye data.

---

## System Workflow

The overall calibration workflow follows a structured pipeline:

1. **Load Data**
   - Acquire or load calibration images

2. **Select Round**
   - Choose calibration round (multi-round processing)

3. **Apply IH Range**
   - Define IH (Image Height / Intensity Histogram) range

4. **Compute Aggregation**
   - Calculate aggregation index from waveform data

5. **Find Best Distance**
   - Search optimal distance minimizing aggregation

6. **Visualize**
   - Display histogram, curves, and validation results

---

## System Components (Architecture)

The system is composed of several core modules:

- **UI Controller (PyQt)**
  - Handles user interaction and visualization

- **Data Loader**
  - Loads image and calibration data

- **Aggregation Engine**
  - Performs IH-based computation and optimization

- **Visualization Module**
  - Displays histogram, curves, and validation results

---

## Summary

The Main Window integrates:
- Hardware control (axis system)
- Image acquisition (camera)
- Data processing (aggregation engine)
- Visualization (histogram & 3D validation)

This unified interface enables a complete and efficient fisheye calibration workflow.

---
