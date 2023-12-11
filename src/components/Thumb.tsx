import { useEffect, useState } from 'react';
import Loader from './Loader';

interface ThumbProps {
  file: File;
  className?: string;
}

const Thumb = ({ file, className }: ThumbProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [thumb, setThumb] = useState<string | null>();

  useEffect(() => {
    setLoading(true);

    const reader = new FileReader();

    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setThumb(reader.result);
      }
      setLoading(false);
    };

    reader.readAsDataURL(file);
  }, [file]);

  if (loading) {
    return <Loader />;
  }

  if (!thumb) {
    return null;
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={thumb} alt="Thumbnail" className={className} />;
};

export default Thumb;
