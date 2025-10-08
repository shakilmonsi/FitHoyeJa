import React, { useState, useContext } from "react";
import registerImg from "../../assits/login/register (2).png";
import toast from "react-hot-toast";
import { useLanguage } from "../../context/LanguageContext";
import { useNavigate, Link } from "react-router-dom";
import ButtonSubmit from "../../common/button/ButtonSubmit";
import { AuthContext } from "../../context/AuthContext";
import OTPModal from "./OTPModal";

const Register = () => {
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [registrationPhone, setRegistrationPhone] = useState("");
  const [registrationToken, setRegistrationToken] = useState("");

  const { t } = useLanguage();
  const navigate = useNavigate();
  const { registerUser } = useContext(AuthContext);

  const isValidPhone = (phone) => {
    const phoneRegex = /^[24569]\d{7}$/;
    return phoneRegex.test(phone);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { phone, password, password_confirmation } = formData;

    if (!phone || !password || !password_confirmation) {
      const errorMessage = "All fields are required.";
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
      return;
    }

    if (!isValidPhone(phone.trim())) {
      const errorMessage =
        "Phone must be 8 digits, start with 2 (landline) or 4,5,6,9 (mobile).";
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
      return;
    }

    if (password !== password_confirmation) {
      const errorMessage = "Passwords do not match.";
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
      return;
    }

    try {
      const result = await registerUser(
        phone.trim(),
        password,
        password_confirmation,
      );

      if (result.success) {
        toast.success(result.message);
        setRegistrationPhone(phone.trim());
        setRegistrationToken(result.token);
        console.log(
          "✅ Registration successful. Received Token:",
          result.token,
        );
        setShowOtpModal(true);
      } else {
        setError(result.message);
        toast.error(result.message);
      }
    } catch (err) {
      const errorMessage = "An unexpected error occurred.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center bg-gray-100 bg-gradient-to-tr from-white via-blue-50 to-blue-100 px-6 py-10 pb-[120px] sm:py-10 md:py-28 md:pb-[50px]">
      <div className="container flex h-auto max-w-6xl flex-col overflow-hidden rounded-3xl bg-white md:h-auto md:flex-row md:px-8 lg:shadow-lg">
        <div className="hidden p-12 md:block md:w-1/2">
          <img
            src={registerImg}
            alt="Register Visual"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex w-full flex-col justify-center p-6 md:w-1/2 md:p-8">
          <h1 className="mb-1 text-black lg:text-center">{t.register.title}</h1>
          <p className="mb-2 text-[14px] text-[#556885] lg:text-center">
            {t.register.subtitle}
          </p>

          <form className="space-y-6" noValidate onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-semibold text-gray-600"
              ></label>
              <input
                id="phone"
                type="tel"
                name="phone"
                placeholder={t.register.mobileNumber}
                className="focus:ring-primary-500 w-full rounded-xl border border-gray-300 px-4 py-3 text-left text-gray-600 placeholder-gray-400 transition focus:ring-1 focus:outline-none"
                style={{ fontFamily: "var(--font-secondary)" }}
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-gray-600"
              ></label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder={t.register.passwords}
                  autoComplete="new-password"
                  className="focus:ring-primary-500 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-600 placeholder-gray-400 transition focus:ring-1 focus:outline-none"
                  style={{ fontFamily: "var(--font-secondary)" }}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password_confirmation"
                className="mb-2 block text-sm font-semibold text-gray-600"
              ></label>
              <div className="relative">
                <input
                  id="password_confirmation"
                  type="password"
                  name="password_confirmation"
                  placeholder={t.register.confirmpassword}
                  autoComplete="new-password"
                  className="focus:ring-primary-500 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-600 placeholder-gray-400 transition focus:ring-1 focus:outline-none"
                  style={{ fontFamily: "var(--font-secondary)" }}
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            <div>
              <Link
                to="/terms"
                className="text-[12px] font-[700] text-[#2e6290]"
              >
                {t.register.byregistering}
              </Link>
            </div>
            <ButtonSubmit
              type="submit"
              disabled={loading}
              text={
                <span className="flex items-center gap-2">
                  {loading ? "Registering..." : t.register.buttontext}
                </span>
              }
              className="!w-full rounded-xl"
            />
          </form>

          <p className="mt-6 text-center text-gray-600">
            {t.register.alradyLogin}{" "}
            <Link
              to="/login"
              className="text-[12px] font-[700] text-[#2e6290]"
              style={{ fontFamily: "var(--font-secondary)" }}
            >
              {t.register.loginlink}
            </Link>
          </p>
        </div>
      </div>
      <OTPModal
        show={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        phone={registrationPhone}
        token={registrationToken}
      />
    </section>
  );
};

export default Register;
