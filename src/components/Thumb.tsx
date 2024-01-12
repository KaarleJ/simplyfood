import { useEffect, useState } from 'react';
import Loader from './Loader';

interface ThumbProps {
  file: File | string | undefined;
  className?: string;
}

const Thumb = ({ file, className }: ThumbProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [thumb, setThumb] = useState<string | null>();

  useEffect(() => {
    if (typeof file === 'string') {
      setThumb(file);
      return;
    }
    setLoading(true);

    const reader = new FileReader();

    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setThumb(reader.result);
      }
      setLoading(false);
    };

    if (file) reader.readAsDataURL(file);
  }, [file]);

  if (!file || (file instanceof File && file.size === 0) || !thumb) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src="/image_placeholder.jpg" alt="Placeholder" className={className} />;
  }

  if (loading) {
    return <Loader />;
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={thumb} alt="Thumbnail" className={className} />;
};

export default Thumb;
