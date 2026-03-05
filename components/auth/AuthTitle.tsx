import React from "react";

const AuthTitle = ({ title }: { title: string }) => {
  return (
    <div>
      <p className="text-3xl tracking-widest uppercase">{title}</p>
    </div>
  );
};

export default AuthTitle;
