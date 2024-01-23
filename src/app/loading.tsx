import Loader from '@/components/Loader';

export default function Loading() {
  return (
    <div className="bg-white p-4 min-h-loose flex justify-center items-center h-screen">
      <Loader />
    </div>
  );
}


export const metadata = {
  title: 'SimplyFood - Loading',
  description: 'Loading...',
};