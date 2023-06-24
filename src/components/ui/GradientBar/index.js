import clsx from "clsx";

const colors = {
  blue: "from-indigo-500 to-teal-200 bg-teal-200",
  pink: "from-purple-400 to-pink-400 bg-pink-400",
  indigo: "from-indigo-500 to-teal-500",
  orange: "from-orange-600 to-orange-300",
};

const sizes = {
  sm: "h-0.5",
  md: "h-1",
  lg: "h-2",
};

export function GradientBar({ color = "orange", size = "md", className }) {
  return (
    <div
      className={clsx(
        "w-full bg-gradient-to-r",
        colors[color],
        sizes[size],
        className
      )}
    />
  );
}
