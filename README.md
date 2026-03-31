# Sentinel-5P SO2 Poland (2018–2025)

Google Earth Engine project for generating 4-month SO2 composites over Poland using Sentinel-5P Level-3 data.

## Overview
This script:
- uses `COPERNICUS/S5P/OFFL/L3_SO2`
- extracts `SO2_column_number_density`
- applies a `cloud_fraction` threshold
- creates 4-month median composites
- exports all composites to Google Drive as GeoTIFF files
- is intended for further cartographic processing in ArcGIS Pro

## File
- `sentinel5p_so2_poland.js` — main Google Earth Engine script

## Dataset
- Sentinel-5P OFFL L3 SO2
- Band: `SO2_column_number_density` (mol/m²)

## Study area
- Poland

## Time period
- 2018 to 2025

## Temporal aggregation
Three 4-month composites per year:
- January–April
- May–August
- September–December

## Main parameters
- Cloud threshold: `0.3`
- Export scale: `10000` meters
- CRS: `EPSG:4326`

## Output
GeoTIFF exports to Google Drive folder:

`GEE_S5P_SO2_POLAND_4MONTH_2018_2025`

## Suggested GitHub repo structure
```text
sentinel5p-so2-poland/
├── README.md
└── sentinel5p_so2_poland.js
```

## How to use
1. Open Google Earth Engine Code Editor.
2. Create a new script.
3. Paste the contents of `sentinel5p_so2_poland.js`.
4. Run the script.
5. Start the export tasks from the Tasks tab.
6. Import the exported GeoTIFFs into ArcGIS Pro for map layout and final figure design.

## Notes
This repository stores the processing script. Final publication-style map layouts can be prepared afterward in GIS software such as ArcGIS Pro.
