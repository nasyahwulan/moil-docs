---
id: server
slug: /installation/server
title: Server Installation
sidebar_label: Server Installation
---

# Server Installation

This page provides the complete installation procedure for the **Calibration System Server** on **Windows 11 x64**.

The server computer is responsible for running three HTTP services that control the calibration hardware: the **Axis HTTP Server** (axis stage motion), the **Monitor HTTP Server** (calibration pattern display), and the **Camera HTTP Server** (image capture). The calibration client (running on Ubuntu 22.04) connects to these services over the same local network using HTTP requests.

---

## Before You Start

Before beginning the installation, confirm that the server computer meets the following requirements.

| Requirement | Description |
|---|---|
| **Operating System** | Windows 11 x64. |
| **GPU Configuration** | At least **2 GPU cards** with at least **6 video ports** (HDMI / DisplayPort) for 5 calibration monitors + 1 operating monitor. |
| **Network** | Server and client must be connected to the same local network (LAN or switch). |
| **GitHub Access** | GitHub account with read permission to the `moil-fisheye-calisys` repository and its 4 submodules (`moil-axis`, `moil-camera`, `moil-monitor`, `moil-pattern`). |
| **O365 Access** | Required to download `Moildev 2.7.zip`, `Moildev-2.7.0.dist-info.zip`, and the `KOHZU_USB_DRIVER.zip`. Login: `share@moil.com.tw`. |
| **Hardware Access** | Axis stage, 5 calibration monitors, and fisheye camera are connected and powered on. |
| **Administrator Permission** | Required to install drivers and run server CMD terminals. |

<div className="custom-note custom-important">
  <div className="custom-note-title">📌 Read First</div>
  <p>This guide is for the <strong>server-side</strong> computer only. The client-side computer (Ubuntu 22.04) has a separate installation procedure, documented in <strong>Client Installation Guide</strong>.</p>
</div>

---

## Overview

The Calibration System Server runs three independent FastAPI / Uvicorn HTTP services. Each service binds to all network interfaces (`0.0.0.0`) on a dedicated port.

| Service | Source File | Port | Class | Purpose |
|---|---|---:|---|---|
| **Axis HTTP Server** | `mvc_model/moil_axis/axis_http_server.py` | `8000` | `AxisHttpServer(FastAPI)` | Controls the 5-axis calibration stage (X, Y, Z, Yaw, Pitch). |
| **Monitor HTTP Server** | `mvc_model/moil_monitor/monitor_http_server.py` | `8001` | `MonitorHttpServer(FastAPI)` | Displays calibration patterns on each of the 5 calibration monitors. |
| **Camera HTTP Server** | `mvc_model/moil_camera/camera_http_server.py` | `8002` | `CameraHttpServer(FastAPI)` | Captures images from the fisheye camera (USB or IP). |

Each service exposes an interactive FastAPI documentation page at `/docs`.

```text
Axis API     →  http://<Server IP>:8000/docs
Monitor API  →  http://<Server IP>:8001/docs
Camera API   →  http://<Server IP>:8002/docs
```

The two supported hardware vendors (set per-service through the `axis_module` and `camera_module` selection in source code) are:

| Vendor Code | Company | Stage Hardware |
|---|---|---|
| `yuanman` | YuanMan (元滿科技, Changhua) | Arduino board for X/Y/Z + KOHZU CRUX controller for Yaw/Pitch (USB ×2). |
| `yinda` | YinDa (盈達精密機械, Taishan) | YinDa X/Y/Z/Yaw/Pitch stages routed through a USB hub (USB ×1). |

<div className="custom-note custom-warning">
  <div className="custom-note-title">⚠️ Pick One Vendor</div>
  <p>The server cannot be configured for both vendors at the same time. Choose the matching axis module (Section 8) and camera driver (Section 11) for your installed hardware.</p>
</div>

---

## 1. Install Required Software

This section installs the OS-level tools required to clone, build, and run the server services.

### 1.1 Install Git

Git is required to clone the project repository and update submodules.

Download the official installer:

```text
Git-2.46.0-64-bit.exe
```

Run the installer and keep **all default options** unless your administrator has provided different instructions.

After installation, verify by opening Command Prompt and running:

```bat
git --version
```

Expected output should display the installed Git version (for example, `git version 2.46.0.windows.1`).

---

### 1.2 Install Python 3.8.10

The project is locked to **Python 3.8.10**. Other Python versions may break dependency resolution because `requirements.server` pins versions tied to this Python release.

Download the official installer:

```text
python-3.8.10-amd64.exe
```

During installation, enable the option **Add Python 3.8 to PATH** so `python` and `pip` are callable from Command Prompt.

After installation, verify in CMD:

```bat
python --version
```

Expected:

```text
Python 3.8.10
```

<div className="custom-note custom-warning">
  <div className="custom-note-title">⚠️ Version Lock</div>
  <p>Do not install Python 3.9, 3.10, 3.11, or 3.12 on the server. The project uses <code>pip==22.0</code>, <code>setuptools==59.6</code>, and <code>Moildev 2.7</code>, which are only verified against Python 3.8.10.</p>
</div>

---

### 1.3 Install Visual Studio Build Tools

Several Python packages in `requirements.server` (including those that ship native extensions) require a C++ compiler at install time.

Download:

```text
vs_BuildTools.exe
```

In the installer, select the **C++ build tools** workload (Desktop development with C++).

<div className="custom-note custom-important">
  <div className="custom-note-title">🔄 Restart Required</div>
  <p>Restart the computer after Visual Studio Build Tools installation completes. The PATH and environment variables only refresh after restart.</p>
</div>

---

### 1.4 Install Arduino IDE (Yuanman Only)

This step is required **only when using the YuanMan / 元滿** axis stage, because the X/Y/Z axes are driven by an Arduino board.

Download:

```text
arduino-ide_2.3.2_Windows_64bit.exe
```

Run the installer with default options and accept all permission inquiries (driver installation, firewall access).

<div className="custom-note custom-tip">
  <div className="custom-note-title">💡 Skip if YinDa</div>
  <p>If the hardware is from YinDa (盈達), the Arduino IDE is not needed. Continue to Section 1.5 and select the YinDa axis module in Section 8 instead.</p>
</div>

---

### 1.5 Install Axis Stage Driver (Yuanman Only)

The KOHZU CRUX USB driver is required **only for YuanMan** hardware, because the Yaw/Pitch axes are controlled by the KOHZU CRUX controller.

Driver file (download from O365 OneDrive, login `share@moil.com.tw`):

```text
KOHZU_USB_DRIVER.zip
```

Installation steps:

1. Extract `KOHZU_USB_DRIVER.zip`.
2. Open the extracted folder.
3. Navigate to:

   ```text
   KOHZE_USB_DRIVE\CRUX_USB_DRIVE64\Windows7
   ```

4. Right-click `CRUX_USB_DRIVE64.inf`.
5. Select **Install**.

<div className="custom-note custom-important">
  <div className="custom-note-title">🪟 Windows 11 Compatibility</div>
  <p>KOHZU only provides a Windows 7 installer. The Windows 7 driver works on Windows 11 — use the Windows 7 installer directly.</p>
</div>

---

## 2. Open CMD as Administrator

All clone, install, and server startup commands must be executed in **Command Prompt running as Administrator**.

Steps:

1. Press **Windows Key + R**.
2. Type:

   ```text
   cmd
   ```

3. Press **Ctrl + Shift + Enter** (this runs CMD as Administrator).
4. Click **Yes** on the UAC prompt.

The CMD title bar should read **Administrator: Command Prompt**.

---

## 3. Clone the Project

### 3.1 Cache Git Credentials

Enable Git credential caching so the GitHub username and personal access token are remembered during the clone and submodule operations.

```bat
git config --global credential.helper cache
```

The credentials are cached in memory for 15 minutes by default. This avoids being prompted multiple times when cloning the main repository and its submodules.

---

### 3.2 Clone the Main Repository

Move into the user Documents folder:

```bat
cd C:\Users\%USERNAME%\Documents
```

Clone the main repository together with all 4 submodules:

```bat
git clone --recurse-submodules https://github.com/perseverance-tech-tw/moil-fisheye-calisys.git
```

The 4 submodules being cloned are:

| Submodule | Path | Purpose |
|---|---|---|
| `moil-axis` | `mvc_model/moil_axis` | Axis stage control logic and HTTP server. |
| `moil-camera` | `mvc_model/moil_camera` | Camera drivers and HTTP server. |
| `moil-monitor` | `mvc_model/moil_monitor` | Monitor pattern display and HTTP server. |
| `moil-pattern` | `mvc_model/moil_pattern` | Calibration pattern generator. |

<div className="custom-note custom-warning">
  <div className="custom-note-title">⚠️ GitHub Authentication</div>
  <p>GitHub will prompt for credentials. Use a GitHub account or personal access token that has read access to <code>moil-fisheye-calisys</code> and all 4 submodule repositories.</p>
</div>

---

### 3.3 Update Submodules

Move into the project folder:

```bat
cd moil-fisheye-calisys
```

Force-update submodules to their latest tracked commits:

```bat
git submodule update --remote
```

This step is required because the main repository may pin older submodule commits.

---

## 4. Create Python Virtual Environment

Inside the project folder, create a virtual environment named `venv`:

```bat
python -m venv venv
```

Activate the virtual environment:

```bat
venv\Scripts\activate
```

After activation, the CMD prompt should start with `(venv)`:

```text
(venv) C:\Users\YourName\Documents\moil-fisheye-calisys>
```

<div className="custom-note custom-tip">
  <div className="custom-note-title">💡 Activate Every Session</div>
  <p>Every new CMD terminal must re-activate the virtual environment with <code>venv&#92;Scripts&#92;activate</code> before running any server. Without activation, Python will use the system installation and the imports will fail.</p>
</div>

---

## 5. Install Python Modules

With the virtual environment activated, install the server dependencies. The order matters — `pip` and `setuptools` must be pinned before installing `requirements.server`.

```bat
pip install setuptools==59.6
python -m pip install pip==22.0
pip install wheel
pip install -r requirements.server
```

The packages installed from `requirements.server` are:

| Package | Version | Purpose |
|---|---|---|
| `opencv-python` | `4.8.0.76` | Image processing and camera I/O. |
| `netifaces` | `0.10.4` | Detects the server's local IP for URL display. |
| `fastapi` | `0.95.0` | HTTP framework used by all three servers. |
| `uvicorn` | `0.21.1` | ASGI server that runs FastAPI on the configured port. |
| `pyserial` | `3.5` | Serial / USB communication with the axis controllers. |
| `pywin32` | `306` | Windows API access for monitor display number control. |
| `python-multipart` | `0.0.9` | Multipart form parsing (used by `/show_pattern` and pattern upload endpoints). |

<div className="custom-note custom-warning">
  <div className="custom-note-title">⚠️ Pinned Versions</div>
  <p>Do not upgrade these packages. The codebase is tested against the exact versions above. In particular, <code>fastapi==0.95.0</code> and <code>uvicorn==0.21.1</code> use the older response-class API that this project depends on.</p>
</div>

---

## 6. Install Moildev 2.7

`Moildev 2.7` is the proprietary fisheye correction library used by the calibration system. It is **not** available on PyPI and must be copied manually into the virtual environment's `site-packages` directory.

Download both archives from the authorized O365 / OneDrive source (login `share@moil.com.tw`):

```text
Moildev 2.7.zip
Moildev-2.7.0.dist-info.zip
```

Extract both into:

```text
C:\Users\%USERNAME%\Documents\moil-fisheye-calisys\venv\Lib\site-packages\
```

The expected resulting directory tree:

```text
moil-fisheye-calisys/
└── venv/
    └── Lib/
        └── site-packages/
            ├── Moildev 2.7/
            └── Moildev-2.7.0.dist-info/
```

Verify the import (inside the activated virtual environment):

```bat
python -c "import Moildev; print(Moildev)"
```

<div className="custom-note custom-warning">
  <div className="custom-note-title">⚠️ Correct Location</div>
  <p>Extract into <code>venv&#92;Lib&#92;site-packages&#92;</code>, not into the project root, not into the system Python's <code>site-packages</code>, and not into a sub-folder. The two extracted folders must sit directly beside the other installed packages.</p>
</div>

---

## 7. Check Hardware Configuration Before Startup

Before starting any HTTP server, verify that all hardware is powered on, cabled correctly, and discoverable by Windows.

| Hardware | What to Check |
|---|---|
| **Axis Stage** | USB cable(s) connected to the server. Driver installed (KOHZU for YuanMan; built-in for YinDa). Stage power switch is **ON** and emergency lock is **released** (YuanMan only). |
| **Monitor Displays** | All 5 calibration monitors are connected via DisplayPort or HDMI and powered on. Windows **Display Settings** detects all monitors. |
| **Camera** | USB camera: cable connected. IP camera: Ethernet cable connected to the same switch/router as the server. |
| **Network** | The server's IP is reachable from the client computer. Firewall allows inbound traffic on ports `8000`, `8001`, and `8002`. |

<div className="custom-note custom-important">
  <div className="custom-note-title">✅ Hardware-First Rule</div>
  <p>Do not start any HTTP server before the corresponding hardware is connected and recognized by Windows. The server will start but every API call will fail with a serial / display / camera error.</p>
</div>

---

## 8. Configure Axis USB COM Port

The axis HTTP server reads the COM port from the axis module file. Edit the file for your vendor.

### 8.1 YuanMan / 元滿 Axis Module

Open the YuanMan axis module:

```text
moil-fisheye-calisys\mvc_model\moil_axis\axis_module\axis_module_yuanman.py
```

Update the USB COM port assignments to match the ports shown in Windows **Device Manager → Ports (COM & LPT)** for:

- The Arduino board (controls X / Y / Z).
- The KOHZU CRUX controller (controls Yaw / Pitch).

<div className="custom-note custom-warning">
  <div className="custom-note-title">⚙️ Baud Rate</div>
  <p>The baud rate values must follow the document provided by the YuanMan company (available on O365). Changing the baud rate without consulting the document will cause garbled serial communication.</p>
</div>

---

### 8.2 YinDa / 盈達 Axis Module

Open the YinDa axis module:

```text
moil-fisheye-calisys\mvc_model\moil_axis\axis_module\axis_module_yinda.py
```

Update the USB COM port assignments for each axis (X, Y, Z, Yaw, Pitch). All axes connect through a single USB hub, but each stage controller appears as a separate COM port in Windows.

<div className="custom-note custom-tip">
  <div className="custom-note-title">💡 Identifying COM Ports</div>
  <p>To identify which COM port belongs to which axis, unplug one stage at a time and observe which COM port disappears in Device Manager. Document the mapping before editing the module file.</p>
</div>

---

## 9. Start the Axis HTTP Server

Open a **new** CMD terminal as Administrator (Section 2).

Move into the project folder:

```bat
cd C:\Users\%USERNAME%\Documents\moil-fisheye-calisys
```

Activate the virtual environment:

```bat
.\venv\Scripts\activate.bat
```

Start the Axis HTTP server:

```bat
python .\mvc_model\moil_axis\axis_http_server.py
```

The server binds to `0.0.0.0:8000` (all network interfaces, port 8000):

```text
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

The Axis server exposes endpoints such as:

| Endpoint | Method | Purpose |
|---|---|---|
| `/home` | GET | Move all axes to the home position. |
| `/x_left`, `/x_right`, `/y_up`, `/y_down`, `/z_forward`, `/z_back` | GET | Linear axis motion commands. |
| `/yaw_left`, `/yaw_right`, `/pitch_up`, `/pitch_down` | GET | Rotational axis motion commands. |
| `/stop` | GET | Immediate stop of all axes. |
| `/is_sensor_x_org`, `/is_sensor_x_left`, ... | GET | Read limit / home sensor status for each axis. |
| `/close_serial` | GET | Close the serial port (used during shutdown). |

<div className="custom-note custom-important">
  <div className="custom-note-title">🪟 Keep the Terminal Open</div>
  <p>Closing the CMD window stops the server. To run multiple servers, open three separate Administrator CMD terminals — one per service.</p>
</div>

---

## 10. Start the Monitor HTTP Server

Open **another** new Administrator CMD terminal.

```bat
cd C:\Users\%USERNAME%\Documents\moil-fisheye-calisys
.\venv\Scripts\activate.bat
python .\mvc_model\moil_monitor\monitor_http_server.py
```

The Monitor server binds to `0.0.0.0:8001`.

The Monitor server exposes endpoints such as:

| Endpoint | Method | Purpose |
|---|---|---|
| `/show_display_number` | GET | Show the Windows display number on each physical monitor (used to map directions, see Section 14). |
| `/set_display_direction` | GET | Map a Windows display number to a calibration direction (Top / North / South / East / West). |
| `/get_display_direction` | GET | Return the current direction-to-display mapping. |
| `/show_pattern` | POST | Display a single calibration pattern image on a selected direction. |
| `/show_pattern_all` | POST | Display patterns on all directions in one call. |
| `/close_pattern`, `/close_pattern_all` | GET | Close patterns on a single direction or all directions. |
| `/set_brightness`, `/set_brightness_all`, `/get_brightness` | GET | Adjust monitor brightness (YuanMan EV2730Q only — YinDa S1934 does not support programmatic brightness control). |

---

## 11. Start the Camera HTTP Server

The camera server requires selecting the correct **camera driver** in source before startup, because the system supports multiple camera types (USB DirectShow, USB OpenCV, IP via URL, and several special drivers).

### 11.1 Select the Camera Driver

Open:

```text
moil-fisheye-calisys\mvc_model\moil_camera\camera_http_server.py
```

Comment / uncomment the import for the camera module that matches your hardware. Available modules in `mvc_model/moil_camera/camera_module/`:

| Module File | Camera Type |
|---|---|
| `camera_module_opencv_url.py` | IP camera accessed via RTSP / HTTP URL. |
| `camera_module_opencv_usb.py` | Generic USB camera via OpenCV (cross-platform). |
| `camera_module_opencv_usb_dshow.py` | USB camera via DirectShow (Windows-optimized). |
| `__updating__camera_module_ids_u33890cp.py` | IDS U3-3890CP industrial camera (work-in-progress). |
| `__updating__camera_module_intel_t265.py` | Intel RealSense T265 (work-in-progress). |
| `__updating__camera_module_narl_pyspin220.py` | NARL FLIR Spinnaker camera (work-in-progress). |
| `__updating__camera_module_narl_pyueye.py` | NARL IDS pyueye camera (work-in-progress). |

Only **one** module should be imported and instantiated at a time.

### 11.2 Start the Server

Open **another** new Administrator CMD terminal.

```bat
cd C:\Users\%USERNAME%\Documents\moil-fisheye-calisys
.\venv\Scripts\activate.bat
python .\mvc_model\moil_camera\camera_http_server.py
```

The Camera server binds to `0.0.0.0:8002`.

The Camera server exposes endpoints such as:

| Endpoint | Method | Purpose |
|---|---|---|
| `/single_image` | GET | Capture and return a single image frame. |
| `/close_camera` | GET | Release the camera handle. |

---

## 12. Check the Server IP Address

The client needs to know the server's IPv4 address.

Open a regular (non-administrator) CMD terminal and run:

```bat
ipconfig
```

Look for the line **IPv4 Address** under your active network adapter (Ethernet or Wi-Fi). Example output:

```text
Ethernet adapter Ethernet:

   IPv4 Address. . . . . . . . . . . : 192.168.113.52
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.113.1
```

Record the IPv4 address. In the example above, the server IP is `192.168.113.52`.

<div className="custom-note custom-tip">
  <div className="custom-note-title">💡 Static IP Recommended</div>
  <p>For production setups, assign a static IP to the server. DHCP-assigned IPs can change after restart, which forces re-entering URLs on the client.</p>
</div>

---

## 13. Verify the API Documentation Pages

Each of the three servers exposes an interactive FastAPI documentation page at `/docs`. Use this page from a browser to confirm the server is reachable and to manually test endpoints before running the client.

### 13.1 Axis API

```text
http://<Server IP>:8000/docs
```

Example:

```text
http://192.168.113.52:8000/docs
```

The page should list all axis motion endpoints (`/home`, `/x_left`, `/stop`, etc.).

---

### 13.2 Monitor API

```text
http://<Server IP>:8001/docs
```

Example:

```text
http://192.168.113.52:8001/docs
```

The page should list `/show_display_number`, `/set_display_direction`, `/show_pattern`, and brightness endpoints.

---

### 13.3 Camera API

```text
http://<Server IP>:8002/docs
```

Example:

```text
http://192.168.113.52:8002/docs
```

The page should list `/single_image` and `/close_camera`. Calling `/single_image` from the docs page returns a captured frame — this is the quickest way to confirm the selected camera module works.

<div className="custom-note custom-tip">
  <div className="custom-note-title">✅ Verification Checklist</div>
  <p>If all three <code>/docs</code> pages open and respond, the server installation is functionally complete. Proceed to Section 14 to finalize the monitor direction mapping.</p>
</div>

---

## 14. Final Monitor Direction Assignment

The Monitor HTTP Server uses `pywin32` to enumerate Windows display numbers. However, **Windows reassigns display numbers randomly across reboots**, so the mapping between a physical monitor (Top / North / South / East / West) and its Windows display number must be re-confirmed each time the server PC restarts.

### 14.1 Show Display Numbers on Each Monitor

From the Monitor API docs page (`http://<Server IP>:8001/docs`), execute:

```text
GET /show_display_number
```

Each physical monitor will display its Windows display number as a large image. Walk around the calibration room and visually record which number is on each monitor.

---

### 14.2 Record the Monitor → Direction Mapping

Write down the mapping observed in Section 14.1. Example:

| Direction | Windows Display Number |
|---|---:|
| Top | 1 |
| North | 2 |
| South | 3 |
| East | 4 |
| West | 5 |

The actual numbers will be different on your computer — use whatever is shown on the monitors.

---

### 14.3 Set the Direction Mapping on the Server

From the Monitor API docs page, execute:

```text
GET /set_display_direction
```

Provide the parameters matching your recorded mapping. For example, set:

```text
top    = 1
north  = 2
south  = 3
east   = 4
west   = 5
```

After this call, the server stores the mapping in memory. The calibration client can now request patterns by direction name (`top`, `north`, ...) and the server will route them to the correct monitor.

---

### 14.4 Close All Patterns

Before starting calibration, clear the display-number patterns from all monitors:

```text
GET /close_pattern_all
```

The 5 calibration monitors should now be black/empty and ready to receive calibration patterns from the client.

<div className="custom-note custom-warning">
  <div className="custom-note-title">🔄 Re-Run After Every Restart</div>
  <p>Repeat Section 14 (steps 14.1 → 14.4) every time the server PC is restarted, because Windows can reshuffle display numbers on reboot.</p>
</div>

---

## 15. Server URLs Used by the Client

After all three servers are running and the monitor direction mapping is set, configure the calibration client to point at the server. Open the client's main window and enter:

| Client Field | URL Format | Example |
|---|---|---|
| **Axis URL** | `http://<Server IP>:8000` | `http://192.168.113.52:8000` |
| **Monitor URL** | `http://<Server IP>:8001` | `http://192.168.113.52:8001` |
| **Camera URL** | `http://<Server IP>:8002` | `http://192.168.113.52:8002` |

Click the **Update** button next to each field. Each button changes color to indicate connection status:

- **Red** — URL was changed but not yet validated (Update was not clicked).
- **Green** — Server responded successfully; the HTTP client is now connected.

---

## Troubleshooting

| Problem | Likely Cause | Resolution |
|---|---|---|
| `git clone` fails | GitHub authentication missing, or no read access to private repo / submodules. | Log in with a GitHub account that has access to the 4 repositories listed in Section 3.2. |
| `python` not recognized | Python not added to PATH, or Section 1.2 step skipped. | Reinstall Python 3.8.10 with the **Add to PATH** checkbox enabled. |
| `pip install -r requirements.server` fails on a native package | Missing Visual Studio C++ Build Tools. | Complete Section 1.3 and restart the computer. |
| `ImportError: Moildev not found` | `Moildev 2.7` extracted to the wrong location. | Re-extract both ZIPs into `venv\Lib\site-packages\` (Section 6). |
| Axis server starts but `/home` fails with serial error | Wrong COM port, driver not installed, or stage powered off. | Check Device Manager → Ports, update the relevant `axis_module_*.py` file, install the KOHZU driver (YuanMan), and confirm power. |
| Monitor server runs but the wrong physical monitor displays a pattern | Windows reshuffled display numbers since the last `/set_display_direction` call. | Re-run Section 14 (Show → Record → Set). |
| Camera server starts but `/single_image` returns no frame | Wrong camera module imported in `camera_http_server.py`. | Edit `camera_http_server.py` and import the matching module from `camera_module/` (Section 11.1). |
| Browser cannot open `/docs` | Server process crashed, IP wrong, or firewall blocking. | Confirm the CMD terminal still shows `Uvicorn running`; re-check IP via `ipconfig`; allow inbound ports 8000–8002 in Windows Firewall. |
| Client `Update` button stays red after entering URL | Client cannot reach the server. | Confirm both machines are on the same subnet; ping the server IP from the client; check firewall. |

---

## Complete Server Startup Checklist

Use this checklist as the standing operating procedure each time the server is started.

| # | Check | Status |
|---:|---|:---:|
| 1 | Git installed and verified with `git --version`. | ☐ |
| 2 | Python 3.8.10 installed and verified with `python --version`. | ☐ |
| 3 | Visual Studio Build Tools installed, computer restarted. | ☐ |
| 4 | Arduino IDE installed (YuanMan only). | ☐ |
| 5 | KOHZU CRUX USB driver installed (YuanMan only). | ☐ |
| 6 | Project cloned with `--recurse-submodules`. | ☐ |
| 7 | Submodules updated via `git submodule update --remote`. | ☐ |
| 8 | Virtual environment `venv` created and activatable. | ☐ |
| 9 | `requirements.server` installed inside `venv`. | ☐ |
| 10 | `Moildev 2.7` extracted to `venv\Lib\site-packages\`. | ☐ |
| 11 | Axis COM ports configured in the correct `axis_module_*.py`. | ☐ |
| 12 | Camera driver selected in `camera_http_server.py`. | ☐ |
| 13 | Axis HTTP Server running (`http://<IP>:8000/docs` reachable). | ☐ |
| 14 | Monitor HTTP Server running (`http://<IP>:8001/docs` reachable). | ☐ |
| 15 | Camera HTTP Server running (`http://<IP>:8002/docs` reachable). | ☐ |
| 16 | Server IPv4 recorded from `ipconfig`. | ☐ |
| 17 | Monitor direction mapping configured via `/set_display_direction`. | ☐ |
| 18 | `/close_pattern_all` called to clear display-number patterns. | ☐ |

---

## Summary

The Server Installation prepares a Windows 11 x64 computer to run the three HTTP services (Axis, Monitor, Camera) required by the Calibration System Client.

The high-level flow is:

```text
Install required software (Git, Python 3.8.10, VS Build Tools, drivers)
   ↓
Clone repository with submodules
   ↓
Create venv and install requirements.server + Moildev 2.7
   ↓
Configure axis COM ports and camera driver in source
   ↓
Start three HTTP servers (ports 8000, 8001, 8002)
   ↓
Record server IP, verify /docs pages
   ↓
Map Windows display numbers to calibration directions
   ↓
Enter Axis / Monitor / Camera URLs in the client
```

Once all three `/docs` pages respond and the monitor direction mapping is set, continue with the **Client Installation Guide** to install and run the calibration client.
