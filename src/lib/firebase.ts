import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  updateProfile,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  updateDoc
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Default profile pictures as Base64 (simplified SVG placeholders)
export const defaultImages = {
  Male: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyLDJDNi40NzcsMiwyLDYuNDc3LDIsMTJzNC40NzcsMTAsMTAsMTBzMTAtNC40NzcsMTAtMTBTMTcuNTIzLDIsMTIsMnogTTEyLDQuMjVjMS43MjUsMCwzLjI1LDEuNTI1LDMuMjUsMy4yNXMtMS41MjUsMy4yNS0zLjI1LDMuMjVzLTMuMjUtMS41MjUtMy4yNS0zLjI1UzEwLjI3NSw0LjI1LDEyLDQuMjV6IE0xMiwyMGMtMy41MjUsMC02LjI1LTIuMDEtNi4yNS00LjVjMC0xLjUsMy4yNS00LjUsNi4yNS00LjVzNi4yNSwzLDYuMjUsNC41QzE4LjI1LDE3Ljk5LDE1LjUyNSwyMCwxMiwyMHoiIGZpbGw9IiM1NTU5NkQiLz48L3N2Zz4=',
  Female: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyLDIgQzYuNDc3LDIgMiw2LjQ3NyAyLDEyIHM0LjQ3NywxMCwxMCwxMCBzMTAtNC40NzcsMTAtMTAgUzE3LjUyMywyLDEyLDJ6IE0xMiw0LjI1IGMxLjcyNSwwIDMuMjUsMS41MjUgMy4yNSwzLjI1IHMtMS41MjUsMy4yNS0zLjI1LDMuMjUgcy0zLjI1LTEuNTI1LTMuMjUtMy4yNSBTMTAuMjc1LDQuMjUsMTIsNC4yNXogTTEyLDIwIGMtMy41MjUsMC02LjI1LTIuMDEtNi4yNS00LjUgYzAtMS41IDMuMjUtNC41IDYuMjUtNC41IHM2LjI1LDMgNi4yNSw0LjUgQzE4LjI1LDE3Ljk5LDE1LjUyNSwyMCwxMiwyMHoiIGZpbGw9IiNGRjY2Q0MiLz48L3N2Zz4=',
  Other: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyLDIgQzYuNDc3LDIgMiw2LjQ3NyAyLDEyIHM0LjQ3NywxMCwxMCwxMCBzMTAtNC40NzcsMTAtMTAgUzE3LjUyMywyLDEyLDJ6IE0xMiw0LjI1IGMxLjcyNSwwIDMuMjUsMS41MjUgMy4yNSwzLjI1IHMtMS41MjUsMy4yNS0zLjI1LDMuMjUgcy0zLjI1LTEuNTI1LTMuMjUtMy4yNSBTMTAuMjc1LDQuMjUsMTIsNC4yNXogTTEyLDIwIGMtMy41MjUsMC02LjI1LTIuMDEtNi4yNS00LjUgYzAtMS41IDMuMjUtNC41IDYuMjUtNC41IHM2LjI1LDMgNi4yNSw0LjUgQzE4LjI1LDE3Ljk5LDE1LjUyNSwyMCwxMiwyMHoiIGZpbGw9IiM2RjRDNzUiLz48L3N2Zz4='
};

// Auth functions
export const registerWithEmailAndPassword = async (
  name: string, 
  email: string, 
  password: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user document in Firestore
    await createUserProfile(user.uid, {
      name,
      email,
      gender: 'Male' // Default gender
    });

    // Update auth display name
    await updateProfile(user, {
      displayName: name
    });

    return user;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const loginWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

export const sendPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error sending password reset:', error);
    throw error;
  }
};

// Firestore functions
export const createUserProfile = async (
  userId: string, 
  profileData: { name: string; email: string; gender?: string }
) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      Name: profileData.name,
      Email: profileData.email,
      Gender: profileData.gender || 'Male',
      createdAt: new Date(),
      Preferences: {
        darkMode: true,
        notifications: true,
        emailUpdates: true,
        dataSharing: false
      },
      profilePicture: defaultImages[profileData.gender as keyof typeof defaultImages] || defaultImages.Male
    });
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // Create default profile if it doesn't exist
      const user = auth.currentUser;
      if (user) {
        await createUserProfile(userId, {
          name: user.displayName || 'New User',
          email: user.email || '',
          gender: 'Male'
        });
        const newDoc = await getDoc(docRef);
        return newDoc.exists() ? newDoc.data() : null;
      }
      return null;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (
  userId: string, 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updates: Record<string, any>
) => {
  try {
    await updateDoc(doc(db, 'users', userId), updates);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Auth state listener
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};