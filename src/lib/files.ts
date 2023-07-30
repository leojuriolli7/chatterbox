export const isImage = (file: { type: string }) => file.type.includes("image");
export const isVideo = (file: { type: string }) => file.type.includes("video");
