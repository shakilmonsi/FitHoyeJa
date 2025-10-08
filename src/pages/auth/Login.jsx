import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import lignimg from "../../assits/login/login (2).png";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { useLanguage } from "../../context/LanguageContext";
import ButtonSubmit from "../../common/button/ButtonSubmit";

const Login = () => {
  const [phone, setMobileNumber] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // Use the login function from AuthContext

  const { login } = useContext(AuthContext);

  const navigate = useNavigate();

  const { t, isRTL } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (!phone || !password) {
      toast.error("Please enter both mobile number and password.");

      setLoading(false);

      return;
    }

    try {
      // Call the login function from AuthContext

      const result = await login(phone.trim(), password);

      if (result.success) {
        toast.success(result.message);

        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Login error:", error);

      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="flex items-center justify-center bg-gray-100 bg-gradient-to-tr from-white via-blue-50 to-blue-100 px-6 py-10 pb-[120px] sm:py-10 md:py-28 md:pb-[50px]"
      style={{ fontFamily: "var(--font-secondary)" }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="container flex h-auto max-w-6xl flex-col overflow-hidden rounded-3xl bg-white md:h-auto md:flex-row md:px-8 lg:shadow-lg">
        <div className="hidden p-12 md:block md:w-1/2">
          <img
            src={lignimg}
            alt="Login Visual"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex w-full flex-col justify-center p-6 md:w-1/2 md:p-8">
          <h1 className="mb-1 text-black lg:text-center">{t.login.title}</h1>

          <p className="mb-2 text-[13px] text-[#556885] lg:py-1 lg:text-center">
            {t.login.shortTitle}
          </p>

          <form noValidate className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <div className="relative">
                <input
                  id="phone"
                  type="tel"
                  placeholder={t.register.mobileNumber}
                  value={phone}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="focus:ring-primary-500 w-full rounded-xl border border-gray-300 px-4 py-3 text-left text-gray-600 placeholder-gray-400 transition focus:ring-1 focus:outline-none"
                  style={{ fontFamily: "var(--font-secondary)" }}
                  required
                />
              </div>
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
                  placeholder={t.register.passwords}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="focus:ring-primary-500 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-600 placeholder-gray-400 transition focus:ring-1 focus:outline-none"
                  style={{ fontFamily: "var(--font-secondary)" }}
                  required
                />

                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"></span>
              </div>
            </div>

            <div>
              <Link
                to="/reset-password"
                className="text-[12px] font-[700] text-[#2e6290]"
              >
                {t?.login.forgotPassword}
              </Link>
            </div>

            <ButtonSubmit
              type="submit"
              disabled={loading}
              text={
                <span>
                  <span className="flex items-center gap-2">
                    {loading ? "Logging in..." : t.login.buttontext}
                  </span>
                </span>
              }
              className="!w-full rounded-xl"
            />
          </form>

          <p className="mt-6 text-center text-gray-600">
            {t.login.newuserwithnoaccount}{" "}
            <Link
              to="/register"
              className="text-[12px] font-[700] text-[#2e6290]"
              style={{ fontFamily: "var(--font-secondary)" }}
            >
              {t.login.registerforfree}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
