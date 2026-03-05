"use client";

import components from "@/data/components";

const ComponentsNavigator = () => {
  return (
    <div className="sticky top-0 w-[250px] lg:w-[300px] h-screen px-4 py-6 bg-white-bg border-r-[2px] border-dark">
      <h1>Star Shop Components</h1>
      <div className="mt-4 space-y-2">
        <h3>Components</h3>
        <ul className="list-disc list-inside space-y-2">
          {components.map((component) => (
            <li
              key={component.id}
              onClick={() =>
                (window.location.href = `/components/${component.id}`)
              }
              className="cursor-pointer"
            >
              {component.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ComponentsNavigator;
