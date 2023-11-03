import { formatDate } from '@/utils/dateConvert';
import { Link } from 'react-router-dom';

interface IEventCard {
  name: string;
  description: string;
  platform: string;
  href: string;
  location: string;
  dateStart: Date;
  dateEnd: Date;
  registrationEndDate: Date;
  maxParticipants: number;
  currentParticipants: number;
  isRegistered?: boolean;
}

const EventCard: React.FC<IEventCard> = ({
  name,
  description,
  platform,
  href,
  location,
  dateStart,
  dateEnd,
  registrationEndDate,
  maxParticipants,
  currentParticipants,
  isRegistered,
}) => {
  console.log(isRegistered);
  return (
    <div>
      <Link to={href}>
        <div className="w-full h-60 bg-[url('/images/trash-demo.jpg')] bg-cover bg-center rounded-t-xl cursor-pointer"></div>
      </Link>
      <p className="font-inter text-green-500 mt-4 font-medium">
        {platform} {'/'} {location}
      </p>
      <p className="font-inter text-green-500 font-medium">
        {formatDate(new Date(dateStart))} - {formatDate(new Date(dateEnd))}
      </p>
      <Link
        to={href}
        className="font-inter text-[24px] leading-8 font-medium mt-2 cursor-pointer hover:text-blue-500 w-fit transition duration-100"
      >
        {name}
      </Link>
      <p className="font-inter text-slate-400">{description}</p>
      <div className="flex flex-col gap-1 mt-4 text-slate-600 font-inter">
        {registrationEndDate && (
          <div className="flex">
            <p className="w-40 font-semibold">Thời hạn đăng ký:</p>
            <p>{formatDate(new Date(registrationEndDate))}</p>
          </div>
        )}
        <div className="flex">
          <p className="w-40 font-semibold">Số lượng đăng ký:</p>
          <p>
            {currentParticipants}/{maxParticipants}
          </p>
        </div>
      </div>
      <div className="w-full flex justify-between">
        <Link className="text-blue-500 hover:underline mt-4" to={href}>
          Xem thêm
        </Link>
        {isRegistered && <p className="text-green-500 font-semibold mt-4">Đã đăng ký</p>}
      </div>
    </div>
  );
};

export default EventCard;
