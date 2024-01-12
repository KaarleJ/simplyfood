import Text from '@/components/Text';

const NotFound = () => {
  return (
    <div className="h-screen">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Text header className="text-center">
          404 - Page Not Found
        </Text>
        <Text className="mt-2 text-center text-ellipsis truncate ...">
          The page you are looking for does not exist. It might have been moved
          or deleted.
        </Text>
      </div>
    </div>
  );
};

export default NotFound;
