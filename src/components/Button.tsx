import { PropsWithChildren } from 'react';

interface ButtonProps extends PropsWithChildren {
  type: 'button' | 'submit' | 'reset' | undefined;
  disabled: boolean;
  className?: string;
}

const Button = ({ children, type, disabled, className }: ButtonProps) => {

  return (
    <button
      type={type}
      disabled={disabled}
      className={`px-2 py-1 mx-4 rounded-md bg-lime-300 font-bold text-white hover:brightness-90 transition-all ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
