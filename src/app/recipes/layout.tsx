import ClientLayout from './ClientLayout';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-loose justify-between">
      <ClientLayout>{children}</ClientLayout>
    </div>
  );
};

export default Layout;
