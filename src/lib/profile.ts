import { db } from './firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { compressAndConvertToBase64 } from './imageUtils';

const DEFAULT_IMAGES = {
  male: 'data:image/png;base64,...', // Your base64 default male image
  female: 'data:image/png;base64,...' // Your base64 default female image
};

export const updateProfilePicture = async (userId: string, file: File | null) => {
  try {
    let imageData;
    
    if (file) {
      // Compress and convert new image
      imageData = await compressAndConvertToBase64(file);
    } else {
      // Use default based on gender
      const userDoc = await getDoc(doc(db, 'users', userId));
      const gender = userDoc.data()?.gender || 'male';
      imageData = DEFAULT_IMAGES[gender as keyof typeof DEFAULT_IMAGES];
    }

    await updateDoc(doc(db, 'users', userId), {
      profilePicture: imageData,
      updatedAt: new Date()
    });

    return imageData;
  } catch (error) {
    console.error('Error updating profile picture:', error);
    throw error;
  }
};

// Usage in your component:
// const handleImageUpload = async (e) => {
//   await updateProfilePicture(user.uid, e.target.files[0]);
// };