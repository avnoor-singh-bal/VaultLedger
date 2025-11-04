import * as React from "react";
import { cn } from "@/lib/utils";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

const PassInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, type, ...props }, ref) => {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <div className="relative flex items-center">
      <input
        type={type === "password" && isPasswordVisible ? "text" : type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
      {type === "password" && (
        <button
          type="button"
          className="absolute right-3 text-muted-foreground hover:text-foreground"
          onClick={togglePasswordVisibility}
          aria-label="Toggle password visibility"
        >
          {isPasswordVisible ? (
            <IconEyeOff size={20} strokeWidth={1.5} />
          ) : (
            <IconEye size={20} strokeWidth={1.5} />
          )}
        </button>
      )}
    </div>
  );
});
PassInput.displayName = "Password_Input";

export { PassInput };
