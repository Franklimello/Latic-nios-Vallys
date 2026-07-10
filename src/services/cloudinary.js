export async function uploadToCloudinary(file, folder = "laticinio-vallys") {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  console.log("Cloudinary Upload - Parâmetros:", { cloudName, uploadPreset, folder });

  if (!cloudName || !uploadPreset) {
    throw new Error("Configure Cloudinary em .env.local para enviar imagens.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error?.message || "Nao foi possivel enviar a imagem para o Cloudinary.";
    throw new Error(message);
  }

  return response.json();
}
