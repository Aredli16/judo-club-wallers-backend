import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import * as config from 'src/judoclubwallers-4d9a5-firebase-adminsdk-zsjry-36162d98dc.json';

admin.initializeApp({
  credential: admin.credential.cert({
    ...config,
  } as ServiceAccount),
});
