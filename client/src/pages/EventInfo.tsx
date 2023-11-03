import { axiosInstance } from '@/api';
import { DefaultPortrait } from '@/assets';
import { Navbar } from '@/components';
import useCurrentUser from '@/hooks/useCurrentUser';
import { useEventInfo } from '@/hooks/useEventInfo';
import useEvents from '@/hooks/useEvents';
import { formatDate } from '@/utils/dateConvert';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

const EventInfo = () => {
  const { eventSlug } = useParams();

  const { data: event, mutate } = useEventInfo(eventSlug?.split('.')[1] || '');
  const { mutate: mutatateEvents } = useEvents();
  const { data: user } = useCurrentUser();

  if (!event) return null;

  const onRegister = async () => {
    if (!user) {
      toast.error('Bạn cần đăng nhập để đăng ký tham gia sự kiện!');

      return;
    }

    if (!user?.isVerified) {
      toast.error('Bạn cần xác thực tài khoản để đăng ký tham gia sự kiện!');

      return;
    }

    try {
      await axiosInstance.post(`/api/event/${event?.positions[0]?.id}/register`);
      await mutate();
      await mutatateEvents();
      toast.success('Đăng ký tham gia sự kiện thành công!');
    } catch (error) {
      toast.error('Đăng ký tham gia sự kiện thất bại!');
    }
  };

  const onUnregister = async () => {
    try {
      await axiosInstance.post(`/api/event/${event?.positions[0]?.id}/unregister`);
      await mutate();
      await mutatateEvents();
      toast.success('Hủy đăng ký tham gia sự kiện thành công!');
    } catch (error) {
      toast.error('Hủy đăng ký tham gia sự kiện thất bại!');
    }
  };

  return (
    <>
      <Navbar />
      <div className="pt-18">
        <div className="flex flex-col items-center mt-8">
          <h1 className="font-oswald text-5xl text-heading font-bold mt-4">{event?.name}</h1>
          <div className="flex mt-4 items-center gap-2">
            <img src={DefaultPortrait} className="h-14 w-14 rounded-full" alt="" />
            <div className="font-inter">
              <p className="text-lg text-main-text-color font-semibold">{event?.organization?.name}</p>
              <p className="text-sm text-gray-500 font-medium">
                {'@'}
                {event?.organization?.username}
              </p>
            </div>
          </div>
          <div
            className="mt-4 h-[400px] w-[700px] bg-cover bg-no-repeat bg-center"
            style={{ backgroundImage: `url(${event?.photos[0]?.photo})` }}
          ></div>
          <div className="w-[700px] mt-4">
            <p className="text-main-text-color font-inter text-sm">
              From: {formatDate(new Date(event?.startDate))} - To: {formatDate(new Date(event?.endDate))}
            </p>
            <p className="text-main-text-color font-inter text-sm">
              Thời hạn đăng ký: {formatDate(new Date(event?.registrationEndDate))}
            </p>
            <p className="text-main-text-color font-inter text-sm">Địa điểm: {event?.location}</p>
            <p className="text-gray-400 text-lg mt-2">{event?.description}</p>
            <p className="">{event?.details}</p>
          </div>
          {!(user && user.isOrganization) &&
            (!event?.isUserParticipant ? (
              <button
                onClick={onRegister}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
              >
                Đăng ký tham gia
              </button>
            ) : (
              <button
                onClick={onUnregister}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
              >
                Hủy đăng ký tham gia
              </button>
            ))}
        </div>
      </div>
    </>
  );
};

export default EventInfo;
