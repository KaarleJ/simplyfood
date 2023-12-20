import { PropsWithChildren } from 'react';

interface ButtonProps extends PropsWithChildren {
  type?: 'button' | 'submit' | 'reset' | undefined;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  toggled?: boolean;
}

const Button = ({
  children,
  type,
  disabled,
  className,
  onClick,
  toggled,
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`px-2 py-1 mx-4 rounded-md ${
        (disabled || toggled) ? 'bg-lime-500' : 'bg-lime-300'
      } font-bold text-white hover:brightness-90 transition-all ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
