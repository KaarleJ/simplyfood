import { Field as Fieldi } from 'formik';

interface FieldProps {
  name: string;
  type: string;
  placeholder: string;
  className?: string;
}

const Field = ({ name, type, placeholder, className }: FieldProps) => {
  if (type === 'textarea') {
    return (
      <Fieldi
        as="textarea"
        className={`border border-stone-400 rounded-md p-2 m-2 text-stone-500 text-md w-full max-w-lg ${className}`}
        name={name}
        placeholder={placeholder}
      />
    );
  }

  return (
    <Fieldi
      className={`border border-stone-400 rounded-md p-2 m-2 text-stone-500 text-md w-full max-w-lg ${className}`}
      name={name}
      type={type}
      placeholder={placeholder}
    />
  );
};
export default Field;
