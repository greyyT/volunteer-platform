import { EventCard, Navbar, Notification, Sidebar } from '@/components';
import useCurrentUser from '@/hooks/useCurrentUser';
import useEvents from '@/hooks/useEvents';
import { Link } from 'react-router-dom';

const Home = () => {
  const { data: events } = useEvents();
  const { data: user } = useCurrentUser();

  return (
    <>
      <Navbar />
      <Notification
        display={user && !user.isVerified}
        message={
          <p>
            Tài khoản của bạn chưa được xác minh! Nhấn{' '}
            <Link className="text-blue-500 hover:underline" to="/profile/edit">
              vào đây
            </Link>{' '}
            để xác minh tài khoản.
          </p>
        }
      />
      <Sidebar />
      <div className={`${user && !user.isVerified ? 'pt-28' : 'pt-18'} pl-60`}>
        <div className="px-16">
          <h1 className="font-oswald font-bold mt-8 text-4xl text-heading">Upcoming Events</h1>
          <div className="w-full h-[2px] bg-black mt-2"></div>
          <div className="grid grid-cols-3 gap-16 mt-12 pb-10">
            {events?.map((event: any, idx: number) => (
              <EventCard
                key={idx}
                name={event?.name}
                href={`/event/${event?.slug}`}
                description={event?.description}
                platform={event?.platform}
                location={event?.location}
                dateStart={event?.startDate}
                dateEnd={event?.endDate}
                registrationEndDate={event?.registrationEndDate}
                currentParticipants={
                  event?.positions?.reduce(
                    (total: number, position: any) => total + (position?._count?.participants || 0),
                    0,
                  ) || 0
                }
                maxParticipants={
                  event?.positions?.reduce(
                    (total: number, position: any) => total + (position?.maxParticipants || 0),
                    0,
                  ) || 0
                }
                isRegistered={event?.isUserParticipant}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
