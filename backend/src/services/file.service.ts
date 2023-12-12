import { v4 as uuidv4 } from "uuid";
import { getStorage } from "firebase-admin/storage";

export async function uploadToFirebase(buffer: Buffer, extension: string): Promise<string> {
  const bucket = getStorage().bucket();
  const fileName = `uploads/${uuidv4()}.${extension}`; // Generate a unique file name
  const file = bucket.file(fileName);

  await file.save(buffer);

  // Make the file public and get the URL
  await file.makePublic();
  const url = file.publicUrl();

  return url;
}
