'use client';
import Loader from '@/components/Loader';

export default function Loading() {
  return (
    <div className="bg-white p-4 shadow-lg min-h-loose flex justify-center items-center h-screen">
      <Loader />
    </div>
  );
}