import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CreateEvent, SignIn, SignUpOrganization } from '../pages';

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUpOrganization />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/create-event" element={<CreateEvent />} />
      </Routes>
    </BrowserRouter>
  );
};
