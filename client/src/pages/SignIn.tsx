import { axiosInstance } from '@/api';
import { AxiosError } from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, { message: 'Mật khẩu cần tối thiểu 8 ký tự' })
  .max(32, { message: 'Mật khẩu chứa tối đa 32 ký tự' })
  .refine(
    (password) => {
      // Use regular expressions to check for at least one uppercase letter and one number
      const uppercaseRegex = /[A-Z]/;
      const numberRegex = /[0-9]/;

      return uppercaseRegex.test(password) && numberRegex.test(password);
    },
    {
      message: 'Mật khẩu cần chứa ít nhất 1 chữ hoa và 1 số',
    },
  );

const schema = z.object({
  email: z.string().min(1, { message: 'Hãy nhập email' }).email({ message: 'Sai định dạng Email' }),
  password: passwordSchema,
});

const SignIn = () => {
  const navigate = useNavigate();
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

    const validationResult = schema.safeParse(formData);

    if (!validationResult.success) {
      const errors = validationResult.error.errors;

      if (errors.length > 0) {
        toast.error(errors[0].message);
      }

      return;
    }

    try {
      await axiosInstance.post('auth/sign-in', formData);
      toast.success('Đăng nhập thành công');
      navigate('/');
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          toast.error('Email hoặc mật khẩu không đúng');
        } else if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Đã có lỗi xảy ra');
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-12 py-8 flex flex-col justify-between h-full">
      <h1 className="text-left font-oswald font-bold text-4xl text-heading">Đăng nhập</h1>
      <div className="mt-8 flex flex-col gap-6">
        <div className="flex items-center">
          <p className="w-36 text-heading font-medium font-oswald">Email</p>
          <input
            className="px-4 py-2 bg-primary rounded-md font-inter shadow-md outline-none w-[320px]"
            type="email"
            name="email"
            value={formData.email}
            onChange={onChangeInput}
          />
        </div>

        <div className="flex items-center">
          <p className="w-36 text-heading font-medium font-oswald">Mật khẩu</p>
          <input
            className="px-4 py-2 bg-primary rounded-md font-inter shadow-md outline-none w-[320px]"
            type="password"
            name="password"
            value={formData.password}
            onChange={onChangeInput}
          />
        </div>
      </div>
      <div className="mt-8">
        <div className="flex justify-center">
          <button type="submit" className="font-oswald font-bold text-white bg-heading px-6 py-3 rounded-2xl text-xl">
            Sign In
          </button>
        </div>
        <p className="text-center font-inter mt-4">
          Chưa có tài khoản?{' '}
          <Link to="/sign-up" className="font-semibold text-heading hover:underline">
            Đăng ký
          </Link>
        </p>
      </div>
    </form>
  );
};

export default SignIn;
