import Image from "next/image";

const Params = [
  {
    name: "imgURL",
    type: "string",
  },
  {
    name: "imgName",
    type: "string",
  },
  {
    name: "className",
    type: "string",
    optional: true,
  },
  {
    name: "width",
    type: "number",
    optional: true,
  },
  {
    name: "height",
    type: "number",
    optional: true,
  },
];

interface ImageComponentProps {
  imgURL: string;
  imgName: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
}

const ImageComponent = ({
  imgURL,
  imgName,
  className,
  width,
  height,
  fill,
}: ImageComponentProps) => {
  // Return a placeholder if imgURL is empty or invalid
  if (!imgURL || imgURL.trim() === "" || imgURL.length < 4) {
    return (
      <div
        className={
          className
            ? className
            : "w-auto h-auto bg-gray-200 flex items-center justify-center"
        }
      >
        <span className="text-xs text-gray-400">{imgName}</span>
      </div>
    );
  }

  // Additional URL validation
  try {
    // Check if it's a valid URL format (either relative or absolute)
    if (
      !imgURL.startsWith("/") &&
      !imgURL.startsWith("http://") &&
      !imgURL.startsWith("https://")
    ) {
      throw new Error("Invalid URL format");
    }
  } catch {
    return (
      <div
        className={
          className
            ? className
            : "w-auto h-auto bg-gray-200 flex items-center justify-center"
        }
      >
        <span className="text-xs text-gray-400">{imgName}</span>
      </div>
    );
  }

  return (
    <Image
      src={imgURL}
      alt={imgName}
      className={className ? className : "w-auto h-auto"}
      {...(fill
        ? { fill: true }
        : { width: width || 100, height: height || 100 })}
      priority={true}
    />
  );
};

ImageComponent.Params = Params;

export default ImageComponent;
