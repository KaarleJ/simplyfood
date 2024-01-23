'use client';
import { Like as OldLike } from 'styled-icons/boxicons-regular';

interface LikeProps {
  className?: string;
  size?: string;
}

const Like = ({ className, size }: LikeProps) => {
  return <OldLike className={className} size={size} />;
};

export default Like;
