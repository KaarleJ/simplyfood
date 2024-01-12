import { Field, FieldAttributes } from 'formik';

interface FieldProps extends FieldAttributes<any> {
  className?: string;
}

const Input = ({ className, ...props }: FieldProps) => {

  return (
    <Field
      className={`border border-stone-400 rounded-md p-2 m-2 text-stone-500 text-md w-full max-w-lg ${className}`}
      {...props}
    />
  );
};
export default Input;
