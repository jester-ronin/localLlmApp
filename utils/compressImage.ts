import * as ImageManipulator from "expo-image-manipulator";

const COMPRESSED_IMAGE_WIDTH = 1024;
const COMPRESSED_IMAGE_QUALITY = 0.7;

export async function compressImageToBase64(uri: string) {
    const context = ImageManipulator.ImageManipulator.manipulate(uri);
    context.resize({ width: COMPRESSED_IMAGE_WIDTH });

    const image = await context.renderAsync();
    const result = await image.saveAsync({
        compress: COMPRESSED_IMAGE_QUALITY,
        format: ImageManipulator.SaveFormat.JPEG,
        base64: true,
    });

    if (!result.base64) {
        return null;
    }

    return `data:image/jpeg;base64,${result.base64.trim()}`;
}
