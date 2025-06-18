import { initializeApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";

import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./config";

type generateSummaryResponse = {
  generatedSummary: string;
  tokensLeft: number;
};
type generateSummaryArgumentType = {
  fileNames: string[];
  additionalInfo: {
    courseName: string;
    language: string;
  };
};

type generateQuizArgumentType = {
  fileNames: string[];
  additionalInfo: {
    courseName: string;
    language: string;
  };
};

type generateQuizReturnType = {
  generatedQuiz: string;
  tokensLeft: number;
};

const app = initializeApp(firebaseConfig);

const functions = getFunctions(app, "me-west1");

const storage = getStorage(app);
const store = getFirestore(app);
const auth = getAuth(app);

const generateSummary = httpsCallable<
  generateSummaryArgumentType,
  generateSummaryResponse
>(functions, "generateSummary");

const generateQuiz = httpsCallable<
  generateQuizArgumentType,
  generateQuizReturnType
>(functions, "generateQuiz");

export { store, storage, auth, generateSummary, generateQuiz };
