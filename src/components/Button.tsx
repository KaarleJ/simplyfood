import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  toggled?: boolean;
}

const Button = ({ children, disabled, className, toggled, ...props }: ButtonProps) => {
  return (
    <button
      className={`px-2 py-1 mx-4 rounded-md ${
        disabled || toggled ? 'bg-lime-500' : 'bg-lime-300'
      } font-bold text-white hover:brightness-90 transition-all ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
