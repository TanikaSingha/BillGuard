function calculateBillboardDimensions(exifData, distanceMeters = 10) {
  if (!exifData || !distanceMeters) {
    throw new Error("Missing EXIF data or distance to billboard");
  }

  const {
    FocalLength, // in mm
    ExifImageWidth, // in pixels
    ExifImageHeight, // in pixels
    SensorWidth, // in mm (approx, can be derived from camera model)
    SensorHeight, // in mm
  } = exifData;

  if (
    !FocalLength ||
    !ExifImageWidth ||
    !ExifImageHeight ||
    !SensorWidth ||
    !SensorHeight
  ) {
    throw new Error("Incomplete EXIF data for calculation");
  }

  // Field of View (FoV) in radians
  const horizontalFoV = 2 * Math.atan(SensorWidth / (2 * FocalLength));
  const verticalFoV = 2 * Math.atan(SensorHeight / (2 * FocalLength));

  // Billboard real-world dimensions based on FoV
  const billboardWidth = 2 * distanceMeters * Math.tan(horizontalFoV / 2);
  const billboardHeight = 2 * distanceMeters * Math.tan(verticalFoV / 2);

  // Angle of orientation (optional, from EXIF Orientation tag)
  const angle = exifData.Orientation || 0;

  return {
    width: billboardWidth.toFixed(2), // meters
    height: billboardHeight.toFixed(2), // meters
    angle,
  };
}

module.exports = { calculateBillboardDimensions };
