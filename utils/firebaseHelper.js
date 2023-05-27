// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

export const getFirebaseApp = () => {
	// TODO: Add SDKs for Firebase products that you want to use
	// https://firebase.google.com/docs/web/setup#available-libraries

	// Your web app's Firebase configuration
	// For Firebase JS SDK v7.20.0 and later, measurementId is optional
	const firebaseConfig = {
		apiKey: "AIzaSyBdGDd170ntaqOLn0otAx-7H4ejs84MjOw",
		authDomain: "whatsapp-4e2fe.firebaseapp.com",
		projectId: "whatsapp-4e2fe",
		storageBucket: "whatsapp-4e2fe.appspot.com",
		messagingSenderId: "847366076074",
		appId: "1:847366076074:web:16d691ba45ded8f0a602d3",
		measurementId: "G-BSXJ0WGMVK",
	};

	// Initialize Firebase
	const app = initializeApp(firebaseConfig);

	return app;
};
