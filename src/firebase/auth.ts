import { signInAnonymously } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, store } from "./index";

export async function ensureSignedIn() {
  if (!auth.currentUser) {
    const cred = await signInAnonymously(auth);
    const user = cred.user;
    await setDoc(
      doc(store, `users/${user.uid}`),
      { createdAt: new Date() },
      { merge: true }
    );
  }
}
