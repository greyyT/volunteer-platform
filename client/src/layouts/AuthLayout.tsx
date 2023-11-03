interface IAuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<IAuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary overflow-hidden">
      <div className="flex rounded-3xl bg-white overflow-hidden shadow-lg w-[900px] min-h-[450px]">
        <div className="flex-1 bg-center bg-cover bg-[url('/images/tree.png')]"></div>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
