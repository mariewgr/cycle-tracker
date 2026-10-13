// Compresse une image côté navigateur (redimensionne + reconvertit en JPEG) pour qu'elle
// reste légère en stockage local et en synchro (limite de 1 Mo par document Firestore).
export function compressImage(file, { maxDimension = 900, quality = 0.6 } = {}) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error("Impossible de lire l'image."))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Fichier image invalide.'))
      img.onload = () => {
        let { width, height } = img
        if (width > maxDimension || height > maxDimension) {
          const scale = maxDimension / Math.max(width, height)
          width = Math.round(width * scale)
          height = Math.round(height * scale)
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d').drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}
