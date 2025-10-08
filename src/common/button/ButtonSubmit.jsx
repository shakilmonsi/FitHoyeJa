
const ButtonSubmit = ({
  text = "Submit",
  onClick = () => {},
  className = "",
}) => {
  return (
    <button
      type="submit"
      onClick={onClick}
      className={`hover:bg-primnary-600 mx-auto flex w-full cursor-pointer items-center justify-center rounded bg-[#F78A6F] px-8 py-3 text-center font-[700] text-white transition duration-500 ease-in-out sm:w-auto ${className}`}
    >
      {text}
    </button>
  );
};

export default ButtonSubmit;
