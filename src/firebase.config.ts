import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import * as config from 'src/judoclubwallers-4d9a5-firebase-adminsdk-zsjry-36162d98dc.json';

const app = admin.initializeApp({
  credential: admin.credential.cert({
    ...config,
  } as ServiceAccount),
});

export const firestore = getFirestore(app);
