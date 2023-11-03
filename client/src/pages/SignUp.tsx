import { axiosInstance } from '@/api';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8)
  .max(32)
  .refine(
    (password) => {
      // Use regular expressions to check for at least one uppercase letter and one number
      const uppercaseRegex = /[A-Z]/;
      const numberRegex = /[0-9]/;

      return uppercaseRegex.test(password) && numberRegex.test(password);
    },
    {
      message: 'Password must have 8 to 32 characters, at least one uppercase letter, and one number',
    },
  );

const schema = z
  .object({
    email: z.string().email().min(1, { message: 'Email is required' }),
    username: z.string().min(1, { message: 'Username is required' }),
    phone: z.string().min(1, { message: 'Phone is required' }),
    password: passwordSchema,
    verifyPassword: z.string(),
  })
  .refine((data) => data.password === data.verifyPassword, {
    message: 'Passwords do not match',
  });

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<{
    username: string;
    email: string;
    phone: string;
    password: string;
    verifyPassword: string;
  }>({
    username: '',
    email: '',
    phone: '',
    password: '',
    verifyPassword: '',
  });

  const [variant, setVariant] = useState<'personal' | 'organization'>('personal');

  useEffect(() => {
    setFormData({
      username: '',
      email: '',
      phone: '',
      password: '',
      verifyPassword: '',
    });
    setIsAgree(false);
  }, [variant]);

  const [isAgree, setIsAgree] = useState<boolean>(false);

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

    if (!isAgree) {
      toast.error('Bạn chưa đồng ý với điều khoản của tổ chức');
      return;
    }

    const toastLoading = toast.loading('Đang đăng ký tài khoản...');

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { verifyPassword, ...data } = formData;

      await axiosInstance.post(`auth/sign-up/${variant === 'personal' ? 'user' : 'organization'}`, data);
      await axiosInstance.post('auth/sign-in', {
        email: formData.email,
        password: formData.password,
      });
      toast.success('Đăng ký tài khoản thành công');
      navigate('/');
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          toast.error('Email hoặc username đã được sử dụng');
          return;
        }
      }
      toast.error('Đăng ký tài khoản thất bại. Vui lòng thử lại sau!');
    } finally {
      toast.dismiss(toastLoading);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="px-12 py-8">
        <h1 className="text-right font-oswald font-bold text-4xl text-heading">Đăng ký tài khoản</h1>
        <div className="flex gap-4 mt-2 justify-end">
          <p
            onClick={() => setVariant('personal')}
            className={`font-oswald text-lg cursor-pointer ${
              variant === 'personal' ? 'text-green-600 underline underline-offset-2' : 'text-gray-500'
            }`}
          >
            Cá Nhân
          </p>
          <p
            onClick={() => setVariant('organization')}
            className={`font-oswald text-lg cursor-pointer ${
              variant === 'organization' ? 'text-green-600 underline underline-offset-2' : 'text-gray-500'
            }`}
          >
            Tổ Chức
          </p>
        </div>
        <div className="mt-8 flex flex-col gap-6">
          <div className="flex items-center">
            <p className="w-36 text-heading font-medium font-oswald">Username</p>
            <input
              className="px-4 py-2 bg-primary rounded-md font-inter shadow-md outline-none w-[320px]"
              type="text"
              name="username"
              value={formData.username}
              onChange={onChangeInput}
            />
          </div>
          <div className="flex items-center">
            <p className="w-36 text-heading font-medium font-oswald">
              {variant === 'personal' ? 'Email' : 'Email Tổ Chức'}
            </p>
            <input
              className="px-4 py-2 bg-primary rounded-md font-inter shadow-md outline-none w-[320px]"
              type="email"
              name="email"
              value={formData.email}
              onChange={onChangeInput}
            />
          </div>
          <div className="flex items-center">
            <p className="w-36 text-heading font-medium font-oswald">
              {variant === 'personal' ? 'Số điện thoại' : 'SĐT Tổ Chức'}
            </p>
            <input
              className="px-4 py-2 bg-primary rounded-md font-inter shadow-md outline-none w-[320px]"
              type="text"
              name="phone"
              value={formData.phone}
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
          <div className="flex items-center">
            <p className="w-36 text-heading font-medium font-oswald">Xác nhận mật khẩu</p>
            <input
              className="px-4 py-2 bg-primary rounded-md font-inter shadow-md outline-none w-[320px]"
              type="password"
              name="verifyPassword"
              value={formData.verifyPassword}
              onChange={onChangeInput}
            />
          </div>
        </div>
        <div className="mt-6 flex gap-2 items-center">
          <input name="policy" type="checkbox" checked={isAgree} onChange={() => setIsAgree(!isAgree)} />
          <p>
            Tôi đồng ý với{' '}
            <a className="text-heading font-semibold cursor-pointer hover:underline" href="">
              Chính sách
            </a>{' '}
            và{' '}
            <a className="text-heading font-semibold cursor-pointer hover:underline" href="">
              Điều khoản
            </a>{' '}
            của tổ chức
          </p>
        </div>
        <div className="flex justify-center mt-8">
          <button type="submit" className="font-oswald font-bold text-white bg-heading px-6 py-3 rounded-2xl text-xl">
            Sign Up
          </button>
        </div>
        <p className="text-center font-inter mt-4">
          Đã có tài khoản?{' '}
          <Link to="/sign-in" className="font-semibold text-heading hover:underline">
            Đăng nhập
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
