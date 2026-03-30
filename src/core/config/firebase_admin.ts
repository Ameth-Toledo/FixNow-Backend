type NotificationPayload = {
  title: string;
  body: string;
  data?: Record<string, string>;
};

type FirebaseMessaging = {
  send(message: Record<string, unknown>): Promise<string>;
  sendEachForMulticast(message: Record<string, unknown>): Promise<unknown>;
};

type FirebaseAdminModule = {
  apps: unknown[];
  credential: {
    cert(serviceAccount: Record<string, string>): unknown;
  };
  initializeApp(options: Record<string, unknown>): unknown;
  messaging(): FirebaseMessaging;
};

let firebaseWarningLogged = false;

function getFirebaseAdmin(): FirebaseAdminModule | null {
  try {
    return require('firebase-admin') as FirebaseAdminModule;
  } catch (error) {
    logFirebaseWarning('firebase-admin no esta instalado. Ejecuta npm install para habilitar notificaciones push.');
    return null;
  }
}

function getServiceAccount(): Record<string, string> | null {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (serviceAccountJson) {
    try {
      const parsed = JSON.parse(serviceAccountJson) as Record<string, string>;
      if (parsed.private_key) {
        parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
      }
      return parsed;
    } catch (error) {
      logFirebaseWarning('FIREBASE_SERVICE_ACCOUNT_JSON no contiene un JSON valido.');
      return null;
    }
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    logFirebaseWarning('Firebase no esta configurado. Define FIREBASE_SERVICE_ACCOUNT_JSON o las variables FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL y FIREBASE_PRIVATE_KEY.');
    return null;
  }

  return {
    project_id: projectId,
    client_email: clientEmail,
    private_key: privateKey,
  };
}

function getMessaging(): FirebaseMessaging | null {
  const admin = getFirebaseAdmin();
  if (!admin) {
    return null;
  }

  if (admin.apps.length === 0) {
    const serviceAccount = getServiceAccount();
    if (!serviceAccount) {
      return null;
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  return admin.messaging();
}

function logFirebaseWarning(message: string): void {
  if (firebaseWarningLogged) {
    return;
  }

  firebaseWarningLogged = true;
  console.warn(`⚠️ Firebase Admin: ${message}`);
}

export async function sendNotificationToTopic(topic: string, payload: NotificationPayload): Promise<void> {
  const messaging = getMessaging();
  if (!messaging) {
    return;
  }

  try {
    await messaging.send({
      topic,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: payload.data,
    });
  } catch (error) {
    console.warn('⚠️ Error enviando notificacion FCM al topico:', error);
  }
}

export async function sendNotificationToTokens(tokens: string[], payload: NotificationPayload): Promise<void> {
  const messaging = getMessaging();
  const validTokens = tokens.filter(token => token && token.trim().length > 0);

  if (!messaging || validTokens.length === 0) {
    return;
  }

  try {
    await messaging.sendEachForMulticast({
      tokens: validTokens,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: payload.data,
    });
  } catch (error) {
    console.warn('⚠️ Error enviando notificacion FCM a tokens individuales:', error);
  }
}