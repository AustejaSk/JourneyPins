import { initializeApp } from "firebase/app"

const firebaseConfig = {
  apiKey: "AIzaSyBrmkExIS3_YHP2BTqoNDC14aoupiAGlNM",
  authDomain: "journeypins-7615d.firebaseapp.com",
  projectId: "journeypins-7615d",
  storageBucket: "journeypins-7615d.appspot.com",
  messagingSenderId: "302737192683",
  appId: "1:302737192683:web:cb902cfd1b74d54752b0ae"
}

const app = initializeApp(firebaseConfig)

export { app }