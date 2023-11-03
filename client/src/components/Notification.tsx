interface INotificationProps {
  message: React.ReactNode;
  display: boolean | undefined;
}

const Notification: React.FC<INotificationProps> = ({ message, display }) => {
  if (!display) return null;

  return (
    <div className="fixed z-20 top-18 left-60 right-0 bg-primary flex justify-center py-3 font-inter">{message}</div>
  );
};

export default Notification;
