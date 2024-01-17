interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Modal = ({ children, className, ...props }: ModalProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-30"></div>
      <div
        className={`bg-white rounded-lg p-8 shadow-lg z-10 absolute ${className}`}
        {...props}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;