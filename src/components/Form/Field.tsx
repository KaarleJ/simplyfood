import ErrorText from './ErrorText';
import Text from '../Text';
import { ErrorMessage } from 'formik';
import Input from './Input';

interface FieldProps {
  type: string;
  name: string;
  placeholder: string;
  error: string | undefined;
  touched: boolean | undefined;
  title?: string;
}

const Field = ({
  type,
  name,
  placeholder,
  error,
  touched,
  title,
}: FieldProps) => {
  return (
    <div className="flex flex-col items-center">
      <Text>
        {title ? title : name.charAt(0).toUpperCase() + name.slice(1)}
      </Text>
      {type === 'textarea' ? (
        <Input as={type} type={type} name={name} placeholder={placeholder} />
      ) : (
        <Input type={type} name={name} placeholder={placeholder} />
      )}
      {error && touched ? (
        <ErrorMessage name={name} component={ErrorText} />
      ) : null}
    </div>
  );
};

export default Field;
