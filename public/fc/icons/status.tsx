import React from "react";

export const StatusIcon = ({ className = "" }) => {
  return (
    <svg
      width="106px"
      height="106px"
      viewBox="0 0 14 14"
      xmlns="http://www.w3.org/2000/svg"
      fill="#000"
      className={`w-5 h-5 ${className}`}
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <g fillRule="evenodd">
          {" "}
          <path d="M0 7a7 7 0 1 1 14 0A7 7 0 0 1 0 7z"></path>{" "}
          <path
            d="M13 7A6 6 0 1 0 1 7a6 6 0 0 0 12 0z"
            fill="#fff"
            style={{ fill: 'var(--svg-status-bg, #fff)' }}
          ></path>{" "}
          <path d="M7 3c2.2 0 4 1.8 4 4s-1.8 4-4 4c-1.3 0-2.5-.7-3.3-1.7L7 7V3"></path>{" "}
        </g>{" "}
      </g>
    </svg>
  );
};

