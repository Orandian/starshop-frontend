const CartCardComponent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="md:px-8 px-4 md:py-10 py-8 rounded-md bg-white/50 border border-white-bg">
      {children}
    </div>
  );
};

export default CartCardComponent;
