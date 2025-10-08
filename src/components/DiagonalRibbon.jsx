import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const DiagonalRibbon = ({
  text,
  backgroundColor = 'var(--primary-400)',
  foldSize = '6px',
}) => {
  const { isRTL } = useLanguage();

  // Component logic for constructing clip-path and applying styles
  const clipPathValue = `polygon(
    100% calc(100% - ${foldSize}),
    100% 100%,
    calc(100% - ${foldSize}) calc(100% - ${foldSize}),
    ${foldSize} calc(100% - ${foldSize}),
    0 100%,
    0 calc(100% - ${foldSize}),
    999px calc(100% - ${foldSize} - 999px),
    calc(100% - 999px) calc(100% - ${foldSize} - 999px)
  )`;

  // Common Tailwind classes for both LTR and RTL
  const commonClasses = "absolute top-0 z- text-white p-[2px_23px]";

  // Common inline styles for both LTR and RTL
  const commonStyles = {
    '--c': backgroundColor,
    '--f': foldSize,
    background: `var(--c)`,
    borderBottom: `var(--f) solid #0007`,
    clipPath: clipPathValue,
  };

  let ribbonClasses = "";
  let ribbonStyles = {};

  if (isRTL) {    
    ribbonClasses = `${commonClasses} rotate-[-45deg] translate-x-[-29.3%] -translate-y-full origin-[100%_100%] left-0`;
    ribbonStyles = {...commonStyles };
  } else {    
    ribbonClasses = `${commonClasses} rotate-45 translate-x-[29.3%] -translate-y-full origin-[0_100%] right-0`;
    ribbonStyles = {...commonStyles };
  }

  return (
    <div
      className={ribbonClasses}
      style={ribbonStyles}
    >
      <div className="relative w-16 h-[18px] flex items-center justify-center text-xs -top-[1px]">
        {text}
      </div>
    </div>
  );
};

export default DiagonalRibbon;