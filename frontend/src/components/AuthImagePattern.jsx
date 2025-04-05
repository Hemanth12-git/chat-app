import { useThemeStore } from "../store/useThemeStore";

const AuthImagePattern = ({ title, subtitle }) => {
  const { theme } = useThemeStore();

  const getStaticBlock = () => {
    return theme === "light" ? "bg-zinc-300" : "bg-zinc-600";
  };

  const getPulseBlock = () => {
    return theme === "light" ? "bg-zinc-400" : "bg-zinc-500";
  };

  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-md text-center">
        <div className="grid grid-cols-3 gap-3 mb-5 mt-5">
          {[...Array(9)].map((_, i) => {
            const baseStyle = i % 2 === 0 ? getPulseBlock() : getStaticBlock();
            const pulse = i % 2 === 0 ? "animate-pulse" : "";
            return (
              <div
                key={i}
                className={`aspect-square rounded-2xl ${baseStyle} ${pulse}`}
              />
            );
          })}
        </div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;