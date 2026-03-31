# Sentinel-5P SO₂ over Poland (2018–2025)

Google Earth Engine script for generating **4-month SO₂ composites over Poland** from the **Sentinel-5P OFFL L3 SO₂** product, with exports to **Google Drive** as **GeoTIFF** files for further cartographic design in **ArcGIS Pro**.

## Project overview

This project processes tropospheric sulfur dioxide (SO₂) observations over Poland using Google Earth Engine. The workflow creates **three 4-month median composites per year** for the period **2018–2025**:

- **January–April**
- **May–August**
- **September–December**

The exported rasters can then be imported into GIS software to produce final map layouts, figures, and comparative panels.

## Dataset

- **Source:** `COPERNICUS/S5P/OFFL/L3_SO2`
- **Band used:** `SO2_column_number_density`
- **Unit:** `mol/m²`

## Study area

- **Country:** Poland
- **Boundary source:** `FAO/GAUL/2015/level0`

## Methodology

The script applies the following workflow:

1. Loads the Sentinel-5P SO₂ image collection.
2. Filters images by date and the Poland area of interest.
3. Uses the `cloud_fraction` band to mask pixels with cloud fraction greater than **0.3**.
4. Creates **4-month median composites** for each period.
5. Exports each composite to **Google Drive** as a **GeoTIFF**.
6. Uses the exported rasters later in **ArcGIS Pro** for map composition and figure design.

## Main parameters

- **Time period:** `2018–2025`
- **Temporal aggregation:** `4-month composites`
- **Start months:** `1, 5, 9`
- **Cloud threshold:** `0.3`
- **Export scale:** `10000` meters
- **CRS:** `EPSG:4326`
- **Export folder:** `GEE_S5P_SO2_POLAND_4MONTH_2018_2025`

## Repository structure

```text
sentinel5p-so2-poland/
├── README.md
└── sentinel5p_so2_poland.js
```

## How to run

1. Open the **Google Earth Engine Code Editor**.
2. Create a new script.
3. Copy and paste the contents of `sentinel5p_so2_poland.js`.
4. Run the script.
5. Open the **Tasks** tab.
6. Start the export tasks.
7. Download the exported GeoTIFFs from Google Drive.
8. Import them into **ArcGIS Pro** for visualization and final layout design.

## Output

The script exports GeoTIFF files named in the following style:

```text
S5P_SO2_POLAND_4M_YYYY-MM-DD_to_YYYY-MM-DD_cloud0p3
```

These rasters are intended for:

- temporal comparison
- spatial analysis
- map production in GIS
- figure preparation for reports, theses, or publications
  ## Example output

Below is an example of the final cartographic output created from the exported GeoTIFFs in ArcGIS Pro.

![Spatial distribution of SO2 over Poland](so2.png)

*Figure: Spatial distribution of SO₂ over Poland for selected years.*

## Example use case

This workflow supports the creation of comparative maps showing the spatial distribution of SO₂ over Poland across different years and periods, using a consistent export and processing framework.

## Notes

- The script is designed for **processing and export**, not for final cartographic layout.
- Final map styling, legends, annotations, north arrow, scale bar, and panel composition were prepared separately in **ArcGIS Pro**.
- The visualization shown in Google Earth Engine is only a preview and may differ from the final GIS symbology.

## Author

Repository created for a Google Earth Engine remote sensing workflow focused on SO₂ analysis over Poland.
