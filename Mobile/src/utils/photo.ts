import * as ImageManipulator from 'expo-image-manipulator';

const getFileSize = async (uri: string) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    return (blob.size / 1024).toFixed(2); // Convert bytes to KB
  } catch (error) {
    console.error('Error getting file size:', error);
    return 'Unknown';
  }
};

const estimateQuality = (
  originalSizeKB: number,
  targetSizeKB: number = 50,
  maxQuality: number = 0.9,
  minQuality: number = 0.01,
  referenceSizeKB: number = 200, // Reference size where quality is max (100 KB → 0.99)
  decayFactor: number = 0.5 // Controls the rate of quality decay
): number => {
  // Calculate the ratio of the original size to the reference size
  const sizeRatio = originalSizeKB / referenceSizeKB;

  // Use a power-based decay to smooth the quality reduction
  // Quality decreases as size increases, but more gradually
  let estimatedQuality = maxQuality * Math.pow(sizeRatio, -decayFactor);

  // Clamp the quality between minQuality and maxQuality
  return Math.min(maxQuality, Math.max(minQuality, estimatedQuality));
};

export const resizeImage = async (
  imageUri: string,
  width: number = 400,
  height: number = 670,
  targetSizeKB: number = 50,
  maxQuality: number = 0.90   
): Promise<string> => {
  try {
    // Step 1: Get the original file size
    console.log('Getting original image size...');
    const originalSize = parseFloat(await getFileSize(imageUri));
    console.log(`Original image size: ${originalSize.toFixed(2)} KB`);

    // Step 2: Estimate the quality based on the original size
    const quality = estimateQuality(originalSize, targetSizeKB, maxQuality);
    console.log(`Estimated quality: ${quality.toFixed(2)}`);

    // Step 3: Resize the image with the estimated quality
    console.log('Resizing image...');
    const resizedImage = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width, height } }],
      {
        compress: quality,
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );

    // Step 4: Get the resized file size
    console.log('Getting resized image size...');
    const resizedSize = parseFloat(await getFileSize(resizedImage.uri));
    console.log(`Resized image size: ${resizedSize.toFixed(2)} KB`);

    // Step 5: Log the size difference
    const sizeDifferenceKB = originalSize - resizedSize;
    const sizeReductionPercent = (sizeDifferenceKB / originalSize) * 100;
    console.log(
      'Size reduction:',
      sizeDifferenceKB.toFixed(2),
      'KB (',
      sizeReductionPercent.toFixed(2),
      '%)'
    );

    return resizedImage.uri;
  } catch (error) {
    console.error('Error resizing image:', error);
    throw new Error('Image resizing failed');
  }
};