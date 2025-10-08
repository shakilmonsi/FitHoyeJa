import { TfiAlert } from "react-icons/tfi";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <section className="flex min-h-screen items-center justify-center bg-[#F5F5F9] py-6">
      <div className="px-4 text-center sm:px-8 md:px-12 lg:px-16">
        {/* Error Code */}
        <h1 className="mb-2 text-6xl text-black sm:text-7xl md:text-8xl">
          404
        </h1>

        {/* Error Message Heading */}
        <h2 className="mb-2 flex items-center justify-center text-xl text-gray-800 sm:text-2xl">
          Page Not Found
          <TfiAlert className="ml-2 text-red-500" />
        </h2>

        {/* Error Description */}
        <p className="text-md mb-4 text-gray-600">
          Oops! The page you're looking for can't be found.
        </p>

        {/* Back to Home Button */}
        <Link
          to="/"
          className="bg-primary-500 hover:bg-primary-600 inline-block rounded-full px-8 py-3 text-lg text-white transition duration-300"
        >
          Back To Home
        </Link>

        {/* Error Illustration */}
        <div className="mt-6 sm:mt-8 md:mt-10">
          <img
            src="/error.png"
            alt="Error Illustration"
            className="mx-auto h-auto w-80 sm:w-96 md:w-104"
          />
        </div>
      </div>
    </section>
  );
};

export default ErrorPage;
