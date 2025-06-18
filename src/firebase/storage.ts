import type { Resource } from "../features/types/generalTypes";
import {
  ref,
  uploadBytes,
  deleteObject,
  getDownloadURL,
} from "firebase/storage";

import { collection, addDoc, deleteDoc, doc } from "firebase/firestore";

import { storage, auth, store } from "./index";

export async function uploadPDFResource(
  resource: File | Resource,
  name: string
): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error("Not signed in");

  let url;
  if (resource instanceof File) {
    const fileRef = ref(storage, `users/${user.uid}/pdfs/${name}/rawFile`);
    await uploadBytes(fileRef, resource);
    url = await getDownloadURL(fileRef);
  } else {
    url = resource.url;
  }

  await addDoc(collection(store, `users/${user.uid}/pdfUrls`), {
    url: url,
    name: name,
    createdAt: new Date(),
  });

  return url;
}

export async function deletePDFResource(resource: Resource): Promise<void> {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("Not signed in");

  if (resource.type === "file") {
    const fileRef = ref(
      storage,
      `users/${userId}/pdfs/${resource.title}/rawFile`
    );
    await deleteObject(fileRef);
  }
  const docRef = doc(store, `users/${userId}/pdfUrls/${resource.title}`);
  await deleteDoc(docRef);
}
