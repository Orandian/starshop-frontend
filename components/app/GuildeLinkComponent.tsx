"use client";
import { useState } from "react";

const GuildeLinkComponent = ({
  title,
  name,
}: {
  title: string;
  name: string;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(name).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="space-y-2">
      <h3>{title}</h3>
      <div
        className="relative px-4 bg-white-bg rounded-md py-2 cursor-pointer group inline-flex"
        onClick={handleCopy}
      >
        <p className="text-dark">{name}</p>

        <span className="absolute top-0 right-0 mt-[-1.5rem] mr-2 text-xs bg-dark text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {copied ? "Copied!" : "Copy"}
        </span>
      </div>
    </div>
  );
};

export default GuildeLinkComponent;
