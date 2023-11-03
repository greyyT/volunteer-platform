import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CreateEvent, Home, SignUp, SignIn, OrganizationProfile, EditProfile, EventInfo } from '@/pages';
import { AuthLayout } from '@/layouts';

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/sign-up"
          element={
            <AuthLayout>
              <SignUp />
            </AuthLayout>
          }
        />
        <Route
          path="/sign-in"
          element={
            <AuthLayout>
              <SignIn />
            </AuthLayout>
          }
        />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/organization/:username" element={<OrganizationProfile />} />
        <Route path="/event/new" element={<CreateEvent />} />
        <Route path="/event/:eventSlug" element={<EventInfo />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};
