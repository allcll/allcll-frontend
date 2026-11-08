import dom2image from 'dom-to-image';
import { saveAs } from 'file-saver';

export function saveImageFromElement(ref?: Element | null, filename: string = 'image.png'): void {
  if (!ref) {
    console.error('Image reference is not set');
    return;
  }

  dom2image
    .toBlob(ref)
    .then(blob => saveAs(blob, filename))
    .catch(error => {
      console.error('Error saving image:', error);
    });
}
