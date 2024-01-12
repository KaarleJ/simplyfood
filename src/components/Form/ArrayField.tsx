import { ErrorMessage, FieldArray } from 'formik';
import Input from './Input';
import ErrorText from './ErrorText';
import Button from '../Button';
import Text from '../Text';
import { RemoveCircle } from '@styled-icons/material';

interface ArrayFieldProps {
  values: any[];
  title?: string;
  name: string;
  placeholder?: string;
  className?: string;
}

const ArrayField = ({ values, title, name, placeholder, className }: ArrayFieldProps) => (
  <div className={`flex flex-col items-center ${className}`}>
    <div className="w-full max-w-lg">
      <Text>
        {title ? title : name.charAt(0).toUpperCase() + name.slice(1)}
      </Text>
      <FieldArray
        name={name}
        render={({ push, remove }) => (
          <div>
            {values.length > 0 &&
              values.map((_equipment, index) => (
                <div key={index} className="flex flex-row w-64">
                  <Input
                    name={`${name}.${index}`}
                    type="text"
                    placeholder={placeholder}
                  />
                  <button type="button" onClick={() => remove(index)}>
                    <RemoveCircle size="24" className="text-gray-400" />
                  </button>
                </div>
              ))}
            <Button type="button" onClick={() => push('')} className="mt-2">
              add
            </Button>
          </div>
        )}
      />
    </div>
    <ErrorMessage name={name} component={ErrorText} />
  </div>
);

export default ArrayField;
