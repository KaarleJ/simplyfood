const NotFound = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            404 - Page Not Found
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            The page you are looking for does not exist. It might have been moved or deleted.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
