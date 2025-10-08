import { useContext, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { t } = useLanguage([]);
  const { requestPasswordResetOTP, verifyOTPForReset, resetPassword } =
    useContext(AuthContext);
  const navigate = useNavigate();

  //=======================code by shakil munshi ==============
  // State gula declare kora hocche
  // step holo 1 theke 3 porjonto (phone->otp->reset password)
  // token ta OTP verification and password reset e lagbe
  //===========================================================
  const [step, setStep] = useState(1);
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  //=======================code by shakil munshi ==============
  // reset token ta ekhane rakha hocche, jeta API theke pabo
  // eita OTP verification and password reset API te authorization header hisebe pathabo
  //===========================================================
  const [resetToken, setResetToken] = useState(null);

  //=======================code by shakil munshi ==============
  // Step 1: OTP request kora hocche (initial and resend duto er jonne)
  //===========================================================
  const handleRequestOTP = async (e) => {
    e?.preventDefault(); // preventDefault call korbe jodi event thake (resend button e event na thakleo safe)
    if (!mobileNumber) {
      setIsSuccess(false);
      setMessage("Please enter your mobile number.");
      return;
    }

    setLoading(true);
    setMessage("Sending OTP...");
    setIsSuccess(false);

    try {
      const response = await requestPasswordResetOTP(mobileNumber);
      if (response.success) {
        setMessage(response.message);
        setIsSuccess(true);
        //=======================code by shakil munshi ==============
        // OTP request successful hole token ke state e set kora hocche
        // jeta next step e dorkar hobe (verify and reset er jonno)
        //===========================================================
        setResetToken(response.token || null);
        setStep(2);
      } else {
        setMessage(response.message);
        setIsSuccess(false);
      }
    } catch (error) {
      console.log(error);
      setMessage("Failed to send OTP. Please try again.");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  //=======================code by shakil munshi ==============
  // Step 2: OTP verification
  // token check korchi jate thake
  //===========================================================
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) {
      setIsSuccess(false);
      setMessage("Please enter the OTP.");
      return;
    }
    if (!resetToken) {
      setIsSuccess(false);
      setMessage("Token missing. Please resend OTP.");
      return;
    }

    setLoading(true);
    setMessage("Verifying OTP...");
    setIsSuccess(false);

    try {
      // AuthContext theke verifyOTPForReset function call kora hocche
      const response = await verifyOTPForReset(mobileNumber, otp, resetToken);
      if (response.success) {
        setMessage(response.message);
        setIsSuccess(true);
        setStep(3);
      } else {
        setMessage(response.message);
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage("Failed to verify OTP. Please try again.");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  //=======================code by shakil munshi ==============
  // Step 3: Password reset
  // password ar confirmation match kora lagbe
  // reset token thakte hobe
  //===========================================================
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== passwordConfirmation) {
      setIsSuccess(false);
      setMessage("Passwords do not match.");
      return;
    }
    if (!resetToken) {
      setIsSuccess(false);
      setMessage("Token missing. Please resend OTP.");
      return;
    }

    setLoading(true);
    setMessage("Resetting password...");
    setIsSuccess(false);

    try {
      // AuthContext er resetPassword function call kora hocche
      const response = await resetPassword(
        mobileNumber,
        newPassword,
        passwordConfirmation,
        resetToken,
      );
      if (response.success) {
        setMessage(
          response.message + " You can now log in with your new password.",
        );
        setIsSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setMessage(response.message);
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage("Failed to reset password. Please try again.");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative mx-auto flex h-[84vh] w-full justify-end overflow-hidden bg-white px-4 pt-10 md:h-[70vh] lg:h-[100vh]">
      <div className="mx-auto max-w-[350px] text-center">
        <h2 className="mb-2 text-[18px] font-[700] text-[#242424]">
          {t.resetPasswordPage.resetPassword}
        </h2>
        {message && (
          <p
            aria-live="polite"
            className={`mt-4 text-sm ${
              isSuccess ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
        <p className="mb-6 text-[14px] text-[#556885]">
          {t.resetPasswordPage.wewilSendYou}
        </p>

        {/*=======================code by shakil munshi ==============
          Step 1: Phone number input form
          user jodi step 1 e thake tokhon show korbe
        ===========================================================*/}
        {step === 1 && (
          <form onSubmit={handleRequestOTP}>
            <input
              type="text"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder={t.resetPasswordPage.mobileNumber}
              className="mb-4 w-full rounded-md border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-500 hover:bg-primary-600 mb-4 w-full rounded px-4 py-3 text-white"
            >
              {loading
                ? "Sending OTP..."
                : t.resetPasswordPage.sendmetheactivation}
            </button>
          </form>
        )}

        {/*=======================code by shakil munshi ==============
          Step 2: OTP verification form
          otp diye verification korbe user
          otp resend option add kora holo ekhane (nicher button)
        ===========================================================*/}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <p className="text-gray-600">
              A verification code has been sent to {mobileNumber}.
            </p>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full rounded-md border px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-green-600 py-2 text-white transition-colors hover:bg-green-700 disabled:bg-green-400"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="mt-2 w-full text-blue-500"
              disabled={loading}
            >
              Change number
            </button>

            {/*=======================code by shakil munshi ==============
              new: resend otp button add kora holo
              click korle abar OTP pathabe same mobile number e
              loading thakle button disable thakbe
            ===========================================================*/}
            <button
              type="button"
              onClick={handleRequestOTP}
              disabled={loading}
              className="mt-2 w-full text-blue-500"
            >
              Resend OTP
            </button>
          </form>
        )}

        {/*=======================code by shakil munshi ==============
          Step 3: Password reset form
          new password and confirmation nibe user theke
        ===========================================================*/}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <p className="text-gray-600">Enter your new password.</p>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={t.resetPasswordPage.newPassword || "New Password"}
              className="w-full rounded-md border px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
              required
            />
            <input
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="Confirm New Password"
              className="w-full rounded-md border px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-yellow-600 py-2 text-white transition-colors hover:bg-yellow-700 disabled:bg-yellow-400"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
