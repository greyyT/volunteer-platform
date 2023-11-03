import { axiosInstance } from '@/api';
import { DefaultPortrait, Logo } from '@/assets';
import useCurrentUser from '@/hooks/useCurrentUser';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
const Navbar = () => {
  const { data: user } = useCurrentUser();
  const navigate = useNavigate();

  const [search, setSearch] = useState<string>('');

  const [openMenu, setOpenMenu] = useState<boolean>(false);

  const handleLogout = async () => {
    try {
      await axiosInstance.post('auth/sign-out');
      navigate('/');
      window.location.reload();
    } catch (error) {
      toast.error('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
    }
  };

  return (
    <>
      <nav className="h-18 bg-navigate-bar flex items-center justify-center fixed top-0 left-0 right-0 z-30">
        <div className="w-full flex items-center justify-between mx-22">
          <Link to="/" className="flex items-center">
            <img src={Logo} className="h-14" alt="logo" />
            <p className="font-oswald text-2xl mb-1">U-Volun</p>
          </Link>
          <div className="relative w-1/3">
            <input
              className="rounded-full bg-white px-4 py-2 focus:outline-none font-inter w-full"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="absolute right-4 top-2">
              <span className="material-symbols-outlined">search</span>
            </div>
          </div>
          <div className="flex justify-center gap-8">
            {user ? (
              <div className="flex gap-6 items-center">
                <div className="relative flex items-center gap-3">
                  <img
                    src={user.portrait || DefaultPortrait}
                    className="h-10 w-10 rounded-full cursor-pointer"
                    alt={DefaultPortrait}
                    onClick={() => setOpenMenu(!openMenu)}
                  />
                  <div>
                    <p className="font-inter  text-sm">{user.username}</p>
                    <p className="font-inter text-xs text-slate-600">{user.isOrganization ? 'Organization' : 'User'}</p>
                  </div>
                  {openMenu && (
                    <div
                      className="absolute w-52 right-0 bg-white top-16 drop-shadow-2xl rounded-md overflow-hidden"
                      onClick={() => setOpenMenu(false)}
                    >
                      <Link
                        className="flex gap-2 text-slate-600 px-6 py-4 hover:bg-gray-100 transition"
                        to={`/${user.isOrganization ? 'organization/' : ''}${user.username}`}
                      >
                        <span className="material-symbols-outlined">person</span>
                        <p>Profile</p>
                      </Link>
                      <Link
                        className="flex gap-2 text-slate-600 px-6 py-4 hover:bg-gray-100 transition"
                        to={`/event/new`}
                        onClick={(e) => {
                          if (!user.isVerified) {
                            e.preventDefault();
                            toast.error('Cần xác minh tài khoản!');
                          }
                        }}
                      >
                        <span className="material-symbols-outlined">add_circle</span>
                        <p>Create Event</p>
                      </Link>
                      <button
                        className="flex gap-2 text-slate-600 px-6 py-4 hover:bg-gray-100 transition w-full  "
                        onClick={handleLogout}
                      >
                        <span className="material-symbols-outlined">logout</span>
                        <p>Logout</p>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Link
                  className="font-bold font-oswald text-lg text-main-text-color hover:text-white transition"
                  to="/sign-up"
                >
                  Đăng ký
                </Link>
                <Link
                  className="font-bold font-oswald text-lg text-main-text-color hover:text-white transition"
                  to="/sign-in"
                >
                  Đăng nhập
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
