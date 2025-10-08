// import { FaCirclePlus } from "react-icons/fa6";

// const FloatingActionButton = ({ isOpen, onClick }) => {
//   const handleFabClick = (event) => {
//     // This ripple logic stays the same, but it now uses the global CSS.
//     const button = event.currentTarget;
//     const circle = document.createElement("span");
//     const diameter = Math.max(button.clientWidth, button.clientHeight);
//     const radius = diameter / 2;

//     circle.style.width = circle.style.height = `${diameter}px`;
//     circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
//     circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
//     circle.classList.add("ripple"); // This class comes from index.css

//     const oldRipple = button.getElementsByClassName("ripple")[0];
//     if (oldRipple) {
//       oldRipple.remove();
//     }

//     button.appendChild(circle);

//     onClick();
//   };

//   return (
//     // The fixed container for the button
//     <div className="fixed right-6 bottom-6 z-[2001]">
//       <button
//         onClick={handleFabClick}
//         aria-label={isOpen ? "Close form" : "Open form"}
//         // --- All styling is now here with Tailwind! ---
//         className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full transition-colors"
//       >
//         {isOpen ? (
//           <img src="/fab.png" alt="Close form" className="fab-icon h-10 w-10" />
//         ) : (
//           <FaCirclePlus size={38} className="text-sky-500" />
//         )}
//       </button>
//     </div>
//   );
// };

// export default FloatingActionButton;

import { GoPlus } from "react-icons/go";

const FloatingActionButton = ({ isOpen, onClick }) => {
  const handleFabClick = (event) => {
    // This ripple logic stays the same
    const button = event.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add("ripple");

    const oldRipple = button.getElementsByClassName("ripple")[0];
    if (oldRipple) {
      oldRipple.remove();
    }

    button.appendChild(circle);
    onClick();
  };

  return (
    <div>
      {/* <div className="fixed right-6 bottom-6 z-[2001] pb-24">
        <button
          onClick={handleFabClick}
          aria-label={isOpen ? "Close form" : "Open form"}
          className="relative mb-[-50px] flex h-14 w-14 items-center justify-center overflow-hidden rounded-full"
        > */}
      {/* Plus Icon Container */}
      {/* <div
            className={`absolute transition-all duration-300 ease-in-out ${isOpen ? "rotate-45 opacity-0" : "rotate-0 opacity-100"}`}
          >
            <div className="flex hidden h-14 w-14 items-center justify-center rounded-full bg-sky-500">
              <GoPlus size={30} className="text-white" />
            </div>
          </div> */}

      {/* <div
            className={`absolute transition-all duration-300 ease-in-out ${isOpen ? "rotate-0 opacity-100" : "-rotate-45 opacity-0"} `}
          > */}
      {/* <img src="/fab.png" alt="Close form" className="h-14 w-14" /> */}
      {/* </div>
        </button>
      </div> */}
    </div>
  );
};

export default FloatingActionButton;
