"use client"

import { useRouter } from "next/navigation";
import components from "@/data/components";

const ComponentsPage = () => {
  const router = useRouter();

  const handleClick = (id: string) => {
    router.push(`/components/${id}`);
  }
  
  return (
    <div className="py-6">
      <div>
        <h1>Star Shop</h1>
        <p>In App, you can copy the path of the component</p>
      </div>

      <div className="mt-4 space-y-2">
        <h3>Components</h3>
        <ul className="list-disc list-inside">
          {components.map((component) => (
            <li
              key={component.id}
              onClick={() => handleClick(component.id)}
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

export default ComponentsPage;
