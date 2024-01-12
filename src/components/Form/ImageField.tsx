import Text from '../Text';
import { ErrorMessage } from 'formik';
import ErrorText from './ErrorText';
import { ChangeEventHandler } from 'react';

interface ImageFieldProps {
  id: string;
  name: string;
  onchange: ChangeEventHandler<HTMLInputElement>;
}

const ImageField = ({ id, name, onchange }: ImageFieldProps) => {
  return (
    <div className="flex flex-col items-center">
      <Text>Image</Text>
      <input
        id={id}
        type="file"
        name={name}
        className="border border-stone-400 rounded-md p-2 m-2 text-stone-500 text-md w-full max-w-lg"
        onChange={onchange}
      />
      <ErrorMessage name={name} component={ErrorText} />
    </div>
  );
};

export default ImageField;
