import React, { useState, useContext } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ButtonSubmit from "../../common/button/ButtonSubmit";

// I've added a 'token' prop to the component
const OTPModal = ({ show, onClose, phone, token }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  // NOTE: The compiler error indicates these import paths may be incorrect for your project structure.
  // Please ensure that the paths to AuthContext and ButtonSubmit match your file system.
  // Example: If AuthContext is in src/context/AuthContext.js, and this file is in src/pages/auth,
  // the path "../../context/AuthContext" should be correct. If not, please adjust it.
  const { verifyRegistrationOTP, resendOTP } = useContext(AuthContext);
  const navigate = useNavigate();

  // If the modal is not visible, don't render anything
  if (!show) {
    return null;
  }

  // The handleVerify function now correctly receives and uses the token
  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // The token is now passed as the third argument here
      const result = await verifyRegistrationOTP(phone, otp, token);
      if (result.success) {
        toast.success(result.message);
        onClose(); // Close the modal
        navigate("/"); // Navigate to home/dashboard
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred during OTP verification.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      // এখানে token prop টি resendOTP ফাংশনে পাস করা হয়েছে
      const result = await resendOTP(phone, token);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred while trying to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600/50 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative w-full max-w-sm scale-95 transform rounded-lg bg-white p-6 shadow-xl transition-transform duration-300">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          &times;
        </button>
        <h2 className="mb-4 text-center text-2xl font-bold text-gray-800">
          Verify OTP
        </h2>
        <p className="mb-6 text-center text-sm text-gray-600">
          An OTP has been sent to your phone number: **{phone}**
        </p>
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label htmlFor="otp" className="sr-only">
              OTP
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              required
              className="focus:ring-primary-500 w-full rounded-xl border border-gray-300 px-4 py-3 text-center text-gray-600 placeholder-gray-400 transition focus:ring-1 focus:outline-none"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <ButtonSubmit
            type="submit"
            disabled={loading}
            text={
              <span className="flex items-center justify-center gap-2">
                {loading ? "Verifying..." : "Verify OTP"}
              </span>
            }
            className="!w-full rounded-xl"
          />
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={handleResend}
            disabled={loading}
            className="text-sm font-semibold text-blue-600 hover:underline disabled:text-gray-400"
          >
            {loading ? "Resending..." : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPModal;
