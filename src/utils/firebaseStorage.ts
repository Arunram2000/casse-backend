import { bucket } from "../config/firebase";

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
}

export const uploadToFirebase = async (
  file: Express.Multer.File,
  folder: string = "songs"
): Promise<UploadResult> => {
  try {
    const filename = `${folder}/${Date.now()}-${Math.round(Math.random() * 1e9)}${getFileExtension(file.originalname)}`;
    
    const fileUpload = bucket.file(filename);
    
    // Upload the file buffer directly
    await fileUpload.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
        metadata: {
          originalName: file.originalname,
        },
      },
    });

    // Make the file publicly accessible
    await fileUpload.makePublic();
    
    // Get the public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
    
    return {
      url: publicUrl,
      filename,
      size: file.size,
    };
  } catch (error) {
    console.error("Firebase upload error:", error);
    throw error;
  }
};

export const deleteFromFirebase = async (filename: string): Promise<void> => {
  try {
    await bucket.file(filename).delete();
  } catch (error) {
    console.error("Firebase delete error:", error);
    throw error;
  }
};

const getFileExtension = (filename: string): string => {
  return filename.substring(filename.lastIndexOf("."));
};
