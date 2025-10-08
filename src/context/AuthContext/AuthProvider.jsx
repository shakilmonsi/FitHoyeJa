import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { getFcmToken, onForegroundMessage } from "../utils/fcm";

// ======= Debug toggles =======
const DEBUG_AUTH = true;
const SHOW_OTP_IN_CONSOLE = true;

// ======= Logger helpers =======
const log = (...a) => DEBUG_AUTH && console.log("[AUTH]", ...a);
const info = (...a) =>
  DEBUG_AUTH && console.info("%c[AUTH]", "color:#2563eb", ...a);
const warn = (...a) =>
  DEBUG_AUTH && console.warn("%c[AUTH]", "color:#d97706", ...a);
const err = (...a) =>
  DEBUG_AUTH && console.error("%c[AUTH]", "color:#dc2626", ...a);
const group = (t) => DEBUG_AUTH && console.group(`🔹 ${t}`);
const groupEnd = () => DEBUG_AUTH && console.groupEnd();

// ======= Cookie settings =======
const COOKIE_NAME = "token";
const cookieOptions = {
  expires: 7,
  path: "/",
  sameSite: "Lax",
  secure:
    typeof window !== "undefined"
      ? window.location.protocol === "https:"
      : false,
};

// ======= Little helpers =======
const extractOtp = (res) => {
  try {
    const d = res?.data ?? {};
    const candidates = [
      d?.data?.otp,
      d?.otp,
      d?.data?.code,
      d?.code,
      d?.data?.verification_code,
      d?.verification_code,
      d?.data?.debug_otp,
      d?.debug_otp,
    ];
    const otp = candidates.find(
      (v) => typeof v === "string" || typeof v === "number",
    );
    return otp ?? null;
  } catch {
    return null;
  }
};
const logOtp = (ctx, res) => {
  if (!SHOW_OTP_IN_CONSOLE) return;
  const otp = extractOtp(res);
  if (otp) console.log(`[AUTH] 👉 OTP (${ctx}):`, String(otp));
  else console.warn("[AUTH] No OTP field found for", ctx);
};

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!Cookies.get(COOKIE_NAME),
  );
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const didForceLogout = useRef(false);

  // FCM
  const [fcmToken, setFcmToken] = useState(null);

  // ======= Token helpers =======
  const setToken = (token) => {
    group("Set Token");
    if (!token) {
      warn("Empty token received; skip set.");
      groupEnd();
      return;
    }
    Cookies.set(COOKIE_NAME, token, cookieOptions);
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
    info("✅ Token saved in cookie & axios header.");
    groupEnd();
  };

  const clearToken = () => {
    group("Clear Token");
    Cookies.remove(COOKIE_NAME);
    delete axiosInstance.defaults.headers.common.Authorization;
    info("✅ Token cleared from cookie & axios header.");
    didForceLogout.current = true;
    groupEnd();
  };

  // ======= On mount: fetch profile + init FCM =======
  useEffect(() => {
    const fetchUser = async () => {
      group("App Mount: Fetch Profile");
      setLoading(true);

      const token = Cookies.get(COOKIE_NAME);
      if (!token) {
        warn("❌ No token present; skip profile fetch.");
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        groupEnd();
        return;
      }

      axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
      info("✅ Token found; fetching profile...");

      try {
        const res = await axiosInstance.get("/me/profile");
        const profileUser =
          res?.data?.user || res?.data?.data?.user || res?.data;
        info("✅ Profile fetched.");
        DEBUG_AUTH && console.table(profileUser || {});
        setUser(profileUser || null);
        setIsAuthenticated(true);
      } catch (error) {
        const status = error?.response?.status;
        err("❌ Profile fetch failed:", status, error?.message || error);
        if (status === 401 || status === 419) {
          warn("⚠️ 401/419 → force logout.");
          clearToken();
          setIsAuthenticated(false);
          setUser(null);
        }
      } finally {
        setLoading(false);
        groupEnd();
      }
    };

    fetchUser();

    // FCM: ask permission + get token
    (async () => {
      try {
        const t = await getFcmToken();
        if (t) {
          console.log("[AUTH] FCM token:", t);
          setFcmToken(t);
        } else {
          console.warn("[AUTH] No FCM token (permission denied/error).");
        }
      } catch (e) {
        console.warn("[AUTH] FCM init error:", e);
      }
    })();

    // Foreground notification listener
    const unsub = onForegroundMessage((payload) => {
      console.log("[AUTH] Foreground notification:", payload);
      // TODO: toast/alert if you want
    });

    return () => unsub?.();
  }, []);

  // ======= Auth API =======
  const login = async (phone, password) => {
    group("Login");
    info("POST /auth/login →", { phone });

    let tokenToSend = fcmToken;
    if (!tokenToSend) {
      try {
        tokenToSend = await getFcmToken();
        if (tokenToSend) setFcmToken(tokenToSend);
      } catch {}
    }

    try {
      const res = await axiosInstance.post("/auth/login", {
        phone,
        password,
        fcm_token: tokenToSend || undefined,
      });

      const data = res?.data?.data || {};
      const token = data?.token;
      const usr = data?.user;

      info("✅ Login response.");
      DEBUG_AUTH && console.table({ hasToken: !!token, hasUser: !!usr });

      if (!token) {
        warn("Token missing in response.");
        groupEnd();
        return { success: false, message: "Login failed: Token not received." };
      }

      setToken(token);
      setIsAuthenticated(true);
      setUser(usr || null);

      log("State → isAuthenticated:true, user set.");
      groupEnd();
      return { success: true, message: "Login successful!" };
    } catch (error) {
      err(
        "❌ Login failed:",
        error?.response?.status,
        error?.response?.data || error?.message,
      );
      setIsAuthenticated(false);
      setUser(null);
      groupEnd();
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          "Invalid mobile number or password.",
      };
    }
  };

  const logout = async () => {
    group("Logout");
    try {
      info("DELETE /auth/logout → requesting server logout");
      await axiosInstance.delete("/auth/logout").catch(() => {});
      info("✅ Server logout completed (or ignored).");
    } catch {
      warn("Server logout failed; clearing locally anyway.");
    } finally {
      clearToken();
      setIsAuthenticated(false);
      setUser(null);
      log("State → isAuthenticated:false, user:null.");
      groupEnd();
      return { success: true, message: "Logged out successfully." };
    }
  };

  const registerUser = async (phone, password, password_confirmation) => {
    group("Register User");
    info("POST /auth/register →", { phone });

    let tokenToSend = fcmToken;
    if (!tokenToSend) {
      try {
        tokenToSend = await getFcmToken();
        if (tokenToSend) setFcmToken(tokenToSend);
      } catch (e) {
        console.warn("[AUTH] FCM token get করতে পারলাম না:", e);
      }
    }

    const payload = {
      phone,
      password,
      password_confirmation,
      fcm_token: tokenToSend || undefined,
    };

    console.log("🔍 Registration Debug:");
    console.log("- Phone:", phone);
    console.log("- Password:", password ? "ys ✅" : "no ❌");
    console.log(
      "- FCM Token:",
      tokenToSend ? `ys ✅ (${tokenToSend.substring(0, 20)}...)` : "no ❌",
    );
    console.log("- Full Payload:", payload);
    console.log("- Base URL:", axiosInstance.defaults.baseURL);
    console.log("- Request Headers:", axiosInstance.defaults.headers);

    try {
      console.log("📤 Sending registration request...");

      const res = await axiosInstance.post("/auth/register", payload);

      console.log("✅ Registration Response:");
      console.log("- Status:", res.status);
      console.log("- Full Response:", res);
      console.log("- Response Data:", res.data);

      logOtp("register", res);
      const token = res?.data?.data?.token;
      info("✅ Registration OK", { hasToken: !!token });
      groupEnd();

      return {
        success: true,
        message:
          res?.data?.message || "Registration successful! Please verify OTP.",
        phone,
        token,
        otp: extractOtp(res) || undefined,
      };
    } catch (error) {
      console.error("❌ Registration Error Details:");
      console.error("- Error Status:", error?.response?.status);
      console.error("- Error Data:", error?.response?.data);
      console.error("- Error Headers:", error?.response?.headers);
      console.error("- Request Config:", error?.config);
      console.error("- Full Error:", error);

      err(
        "❌ Registration failed:",
        error?.response?.status,
        error?.response?.data || error?.message,
      );
      groupEnd();

      let errorMessage = "Registration failed. Please try again.";

      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.response?.data) {
        errorMessage = JSON.stringify(error.response.data);
      } else if (error?.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        message: errorMessage,
        errorDetails: error?.response?.data,
      };
    }
  };
  const verifyRegistrationOTP = async (phone, otp, regToken) => {
    group("Verify Registration OTP");
    info("POST /auth/verify-otp →", {
      phone,
      otp: String(otp),
      hasRegToken: !!regToken,
    });
    try {
      const headers = regToken
        ? { headers: { Authorization: `Bearer ${regToken}` } }
        : {};

      const res = await axiosInstance.post(
        "/auth/verify-otp",
        { phone, otp: String(otp).trim() },
        headers,
      );

      logOtp("verify-registration", res);
      const data = res?.data?.data;
      info("✅ OTP verification response", {
        hasToken: !!data?.token,
        hasUser: !!data?.user,
      });

      if (data?.token && data?.user) {
        setToken(data.token);
        setIsAuthenticated(true);
        setUser(data.user);
        log("State → isAuthenticated:true, user set.");
        groupEnd();
        return {
          success: true,
          message: res?.data?.message || "OTP verified. You're logged in.",
          otp: extractOtp(res) || undefined,
        };
      }

      warn("No token returned; OTP verified but not logged in.");
      groupEnd();
      return {
        success: true,
        message: res?.data?.message || "OTP verified. You can now log in.",
        otp: extractOtp(res) || undefined,
      };
    } catch (error) {
      err(
        "❌ OTP verification failed:",
        error?.response?.status,
        error?.response?.data || error?.message,
      );
      groupEnd();
      return {
        success: false,
        message: error?.response?.data?.message || "Invalid OTP or token.",
      };
    }
  };

  const resendOTP = async (phone, regToken) => {
    group("Resend OTP");
    info("POST /auth/resend-otp →", { phone, hasRegToken: !!regToken });
    try {
      const res = await axiosInstance.post(
        "/auth/resend-otp",
        { phone },
        regToken ? { headers: { Authorization: `Bearer ${regToken}` } } : {},
      );
      logOtp("resend-otp", res);
      info("✅ OTP resent");
      groupEnd();
      return {
        success: true,
        message: res?.data?.message || "New OTP sent successfully!",
        otp: extractOtp(res) || undefined,
      };
    } catch (error) {
      err(
        "❌ Resend OTP failed:",
        error?.response?.status,
        error?.response?.data || error?.message,
      );
      groupEnd();
      return {
        success: false,
        message:
          error?.response?.data?.message || "Failed to resend OTP. Try again.",
      };
    }
  };

  const requestPasswordResetOTP = async (phone) => {
    group("Request Password Reset OTP");
    info("POST /auth/forgot-password →", { phone });
    try {
      const res = await axiosInstance.post("/auth/forgot-password", { phone });
      logOtp("forgot-password", res);
      const token = res?.data?.data?.token;
      info("✅ Reset OTP sent", { hasToken: !!token });
      groupEnd();
      return {
        success: true,
        message: res?.data?.message || "OTP sent successfully!",
        token,
        otp: extractOtp(res) || undefined,
      };
    } catch (error) {
      err(
        "❌ Reset OTP request failed:",
        error?.response?.status,
        error?.response?.data || error?.message,
      );
      groupEnd();
      return {
        success: false,
        message:
          error?.response?.data?.message || "Failed to send OTP. Try again.",
      };
    }
  };

  const verifyOTPForReset = async (phone, otp, token) => {
    group("Verify OTP for Reset");
    info("POST /auth/forgot-verify-otp →", {
      phone,
      otp: String(otp),
      hasToken: !!token,
    });
    try {
      const res = await axiosInstance.post(
        `/auth/forgot-verify-otp?token=${encodeURIComponent(token)}`,
        { phone, otp: String(otp).trim() },
      );
      logOtp("forgot-verify-otp", res);
      info("✅ Reset OTP verification successful");
      groupEnd();
      return {
        success: true,
        message: res?.data?.message || "OTP verified successfully!",
        otp: extractOtp(res) || undefined,
      };
    } catch (error) {
      err(
        "❌ Reset OTP verification failed:",
        error?.response?.status,
        error?.response?.data || error?.message,
      );
      groupEnd();
      return {
        success: false,
        message: error?.response?.data?.message || "Invalid OTP or token.",
      };
    }
  };

  const resetPassword = async (
    phone,
    newPassword,
    newPasswordConfirmation,
    token,
  ) => {
    group("Reset Password");
    info("POST /auth/reset-password →", { phone, hasToken: !!token });
    try {
      const res = await axiosInstance.post("/auth/reset-password", {
        phone,
        password: newPassword,
        password_confirmation: newPasswordConfirmation,
        token,
      });
      info("✅ Password reset successful");
      groupEnd();
      return {
        success: true,
        message: res?.data?.message || "Password has been reset successfully.",
      };
    } catch (error) {
      err(
        "❌ Password reset failed:",
        error?.response?.status,
        error?.response?.data || error?.message,
      );
      groupEnd();
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          "Failed to reset password. Try again.",
      };
    }
  };

  const deleteAccount = async () => {
    group("Delete Account");
    info("DELETE /me/delete → sending");
    try {
      await axiosInstance.delete("/me/delete");
      info("✅ Account deleted on server");
    } catch (error) {
      warn(
        "Server deletion failed; clearing locally anyway:",
        error?.response?.status,
      );
    } finally {
      clearToken();
      setIsAuthenticated(false);
      setUser(null);
      log("State → isAuthenticated:false, user:null.");
      groupEnd();
      return { success: true, message: "Account deleted successfully." };
    }
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    registerUser,
    requestPasswordResetOTP,
    verifyOTPForReset,
    resetPassword,
    verifyRegistrationOTP,
    resendOTP,
    deleteAccount,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
