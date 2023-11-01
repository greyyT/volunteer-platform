import { useState } from 'react';
import axiosInstance from '../api/axios';

const SignIn = () => {
  const [formData, setFormData] = useState<{
    email: string;
    password: string;
  }>({
    email: '',
    password: '',
  });

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axiosInstance.post('auth/sign-in', formData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={onChangeInput} />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={onChangeInput}
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default SignIn;
