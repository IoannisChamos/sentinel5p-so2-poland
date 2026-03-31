// =============================
// Sentinel-5P SO2 | POLAND | 2018-2025 | 4-month composites
// Export ALL 4-month composites to Google Drive (GeoTIFF) for ArcGIS Pro
// Same workflow as NO2: cloud_fraction mask + median composite + fallback to avoid empty images
// Dataset: COPERNICUS/S5P/OFFL/L3_SO2
// Band: SO2_column_number_density (mol/m^2)



var countries = ee.FeatureCollection('FAO/GAUL/2015/level0');
var polandFc = countries.filter(ee.Filter.eq('ADM0_NAME', 'Poland'));
var aoi = polandFc.geometry();

Map.centerObject(polandFc, 6);
Map.addLayer(polandFc, {}, 'Poland boundary', false);


var START_YEAR = 2018;
var END_YEAR   = 2025;

// 4 months period 1 = January, 5 = May 
var startMonths = ee.List([1, 5, 9]);

// Cloud threshold 0 = clear , 1 = foggy
var CLOUD_MAX = 0.3; 

// Export settings
var DRIVE_FOLDER = 'GEE_S5P_SO2_POLAND_4MONTH_2018_2025';
var EXPORT_SCALE = 10000; // km-scale για S5P
var CRS = 'EPSG:4326';    // WGS84

// Preview visualization 
var vis = {
  min: 0.0,
  max: 0.0002,
  palette: [
    '000004','1b0c41','4a0c6b','781c6d','a52c60',
    'cf4446','ed6925','fb9b06','f7d13d','fcffa4'
  ]
};

// Sentinel -5P
var s5p = ee.ImageCollection('COPERNICUS/S5P/OFFL/L3_SO2')
  .select(['SO2_column_number_density', 'cloud_fraction']);

// 1 composite per 4 month (median) with fallback 
function make4MonthComposite(year, startMonth) {
  year = ee.Number(year);
  startMonth = ee.Number(startMonth);

  var start = ee.Date.fromYMD(year, startMonth, 1);
  var end   = start.advance(4, 'month'); // exclusive

  var base = s5p
    .filterDate(start, end)
    .filterBounds(aoi);

  // Cloud-masked
  var masked = base.map(function(img) {
    var so2 = img.select('SO2_column_number_density');
    var cloud = img.select('cloud_fraction');
    return so2.updateMask(cloud.lte(CLOUD_MAX));
  });

  // Fallback: if masked.size = 0, go without cloud mask
  var useMasked = masked.size().gt(0);

  var colToUse = ee.ImageCollection(
    ee.Algorithms.If(useMasked, masked, base.select('SO2_column_number_density'))
  );

  var composite = colToUse.median()
    .clip(aoi)
    .rename('SO2_column')
    .toFloat();

  var startStr = start.format('YYYY-MM-dd');
  var endStr   = end.advance(-1,'day').format('YYYY-MM-dd');
  var label = startStr.cat('_to_').cat(endStr);

  return composite.set({
    'label': label,
    'start': startStr,
    'end': endStr,
    'year': year,
    'startMonth': startMonth,
    'used_cloud_mask': useMasked,
    'n_images_base': base.size()
  });
}

//Create composites 2018-2025 
var years = ee.List.sequence(START_YEAR, END_YEAR);

var imagesList = years.map(function(y) {
  return startMonths.map(function(m) {
    return make4MonthComposite(y, m);
  });
}).flatten();

var composites = ee.ImageCollection.fromImages(imagesList);

print('4-month SO2 composites (Poland):', composites);
print('Count (should be 24):', composites.size());

// First Preview
var first = ee.Image(composites.first());
Map.addLayer(first, vis, 'SO2 first 4-month (preview)');

// Export all 24 images 

var list = composites.toList(composites.size());
var n = composites.size().getInfo(); // 24

var cloudTag = 'cloud' + String(CLOUD_MAX).replace('.', 'p');

for (var i = 0; i < n; i++) {
  var img = ee.Image(list.get(i));
  var label = img.get('label').getInfo();
  var countBase = img.get('n_images_base').getInfo();

  // If no data we move on
  if (countBase === 0) {
    print('SKIP (no images):', label);
    continue;
  }

  var fileName = 'S5P_SO2_POLAND_4M_' + label + '_' + cloudTag;

  Export.image.toDrive({
    image: img,                 // 1 band here the SO2_column
    description: fileName,
    fileNamePrefix: fileName,
    folder: DRIVE_FOLDER,
    region: aoi,
    scale: EXPORT_SCALE,
    crs: CRS,
    maxPixels: 1e13
  });
}
