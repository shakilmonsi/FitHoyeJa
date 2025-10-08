// src/utils/fcm.js
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../../firebase.config";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_KEY;

export async function getFcmToken() {
  const perm = await Notification.requestPermission();
  if (perm !== "granted") return null;
  try {
    const token = await getToken(messaging, { vapidKey: VAPID_PUBLIC_KEY });
    return token || null;
  } catch (e) {
    console.error("[FCM] getToken error:", e);
    return null;
  }
}

export function onForegroundMessage(cb) {
  return onMessage(messaging, (payload) => {
    console.log("[FCM] foreground:", payload);
    cb?.(payload);
  });
}
