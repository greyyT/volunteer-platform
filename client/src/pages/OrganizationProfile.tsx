import { DefaultPortrait } from '@/assets';
import { Navbar } from '@/components';
import useCurrentUser from '@/hooks/useCurrentUser';

const OrganizationProfile = () => {
  const { data: user } = useCurrentUser();

  return (
    <>
      <Navbar />
      <div className="flex justify-center pt-18">
        <div className="flex w-[900px] mt-24 gap-4">
          <div className="flex-1">
            <img src={DefaultPortrait} className="rounded-full h-56 w-56" alt="" />
            {user?.name && <h1 className="font-oswald font-bold mt-8 text-4xl text-heading">{user?.name}</h1>}
            <p className="mt-2 font-inter">{user?.username}</p>
          </div>
          <div className="flex-[3] border border-solid border-gray-300 rounded-2xl">
            <div className="w-full">Hello</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrganizationProfile;
