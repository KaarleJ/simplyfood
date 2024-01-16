import { useEffect, useState } from 'react';
import Loader from './Loader';
import Image from 'next/image';

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
      setLoading(false);
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
    return (
      <Image
        src="/image_placeholder.jpg"
        width={1920}
        height={1080}
        alt="Placeholder"
        className={`object-cover w-full ${className}`}
      />
    );
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <Image
      src={thumb}
      width={1920}
      height={1080}
      alt="Thumbnail"
      className={`object-cover w-full ${className}`}
    />
  );
};

export default Thumb;
