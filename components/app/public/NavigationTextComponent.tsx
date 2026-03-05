const params = [
    {
        name: "text",
        type: "string",
    },
    {
        name: "handleNavigation",
        type: "() => void",
    },
]

interface NavigationTextComponentProps {
  text: string;
  handleNavigation: () => void;
}

const NavigationTextComponent = ({
  text,
  handleNavigation,
}: NavigationTextComponentProps) => {
  return (
    <div onClick={handleNavigation}>
      <p className="text-normal text-black cursor-pointer underline">
        {text}
      </p>
    </div>
  );
};

NavigationTextComponent.Params = params;

export default NavigationTextComponent;
