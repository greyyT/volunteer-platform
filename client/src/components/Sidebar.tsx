import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="bg-base-color fixed left-0 top-18 bottom-0 w-60 flex flex-col">
      <div className="mt-18 flex flex-col">
        <NavLink
          className={({ isActive }) =>
            `pl-8 font-oswald font-medium py-4 relative before:absolute before:right-0 before:top-0 before:bottom-0 before:w-[6px] before:bg-green-700 before:opacity-0 transition ${
              isActive
                ? 'bg-primary text-white before:opacity-100'
                : 'text-black hover:bg-primary hover:text-white hover:before:opacity-100'
            }`
          }
          to="/"
        >
          <div className="flex gap-2">
            <span className="material-symbols-outlined">grid_view</span>
            <p>Bảng tin</p>
          </div>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `pl-8 font-oswald font-medium py-4 relative before:absolute before:right-0 before:top-0 before:bottom-0 before:w-[6px] before:bg-green-700 before:opacity-0 transition ${
              isActive
                ? 'bg-primary text-white before:opacity-100'
                : 'text-black hover:bg-primary hover:text-white hover:before:opacity-100'
            }`
          }
          to="/dien-dan"
        >
          <div className="flex gap-2">
            <span className="material-symbols-outlined">forum</span>
            <p>Diễn đàn</p>
          </div>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `pl-8 font-oswald font-medium py-4 relative before:absolute before:right-0 before:top-0 before:bottom-0 before:w-[6px] before:bg-green-700 before:opacity-0 transition ${
              isActive
                ? 'bg-primary text-white before:opacity-100'
                : 'text-black hover:bg-primary hover:text-white hover:before:opacity-100'
            }`
          }
          to="/lich-su"
        >
          <div className="flex gap-2">
            <span className="material-symbols-outlined">history</span>
            <p>Lịch sử</p>
          </div>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `pl-8 font-oswald font-medium py-4 relative before:absolute before:right-0 before:top-0 before:bottom-0 before:w-[6px] before:bg-green-700 before:opacity-0 transition ${
              isActive
                ? 'bg-primary text-white before:opacity-100'
                : 'text-black hover:bg-primary hover:text-white hover:before:opacity-100'
            }`
          }
          to="/lich-su"
        >
          <div className="flex gap-2">
            <span className="material-symbols-outlined">contact_support</span>
            <p>Hỗ trợ</p>
          </div>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
