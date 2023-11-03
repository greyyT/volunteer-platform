import { axiosInstance } from '@/api';
import { DefaultPortrait } from '@/assets';
import { Navbar } from '@/components';
import useCurrentUser from '@/hooks/useCurrentUser';
import axios from 'axios';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';

const EditProfile = () => {
  const { data: user, mutate } = useCurrentUser();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    location: user?.location || '',
  });

  const [images, setImages] = useState<File[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onChangeImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;

    if (selectedFiles) {
      const filePromises = Array.from(selectedFiles).map((file) => {
        return new Promise<File>((resolve) => {
          const reader = new FileReader();

          reader.onload = (e) => {
            // Create a Blob from the base64 data
            const blob = new Blob([e.target?.result as ArrayBuffer]);

            // Create a File with the Blob
            const imageFile = new File([blob], file.name, { type: file.type });
            resolve(imageFile);
          };

          reader.readAsArrayBuffer(file);
        });
      });

      Promise.all(filePromises).then((fileArray) => {
        setImages(fileArray);
      });
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axiosInstance.patch('/api/account', formData);

      for (const image of images) {
        const formData = new FormData();
        formData.append('verificationPaper', image, `${user?.username}.${image.type.split('/')[1]}`);

        await axios.post(
          `http://localhost:3000/api/${user?.isOrganization ? 'organization' : 'user'}/verification`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
          },
        );
      }
      await mutate();
      toast.success('Cập nhật thông tin thành công!');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center pt-18 w-full">
        <img src={DefaultPortrait} className="h-52 w-5h-52 mt-10" alt="" />
        <p className="font-oswald text-heading font-bold text-lg mt-2">
          {'@'}
          {user?.username}
        </p>
        {!user?.isVerified && <p className="text-sm text-slate-400">This account is not verified.</p>}
        <form
          onSubmit={onSubmit}
          className="mt-11 drop-shadow-xl bg-slate-100 w-[500px] px-6 py-6 rounded-2xl flex flex-col"
        >
          <h1 className="text-heading text-2xl font-semibold font-oswald text-center">Edit your Profile</h1>
          <div className="flex items-center font-inter mt-8">
            <p className="w-[100px]">Name:</p>
            <input
              type="text"
              name="name"
              className="bg-primary px-4 py-2 outline-none rounded-lg flex-1"
              value={formData.name}
              onChange={onInputChange}
            />
          </div>
          <div className="flex items-center font-inter mt-4">
            <p className="w-[100px]">Location:</p>
            <input
              type="text"
              name="location"
              className="bg-primary px-4 py-2 outline-none rounded-lg flex-1"
              value={formData.location}
              onChange={onInputChange}
            />
          </div>
          {!user?.isVerified && (
            <>
              <input
                className="mt-6"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                multiple
                onChange={onChangeImages}
              />
              <p className="text-slate-400 italic">*Upload your verification paper.</p>
            </>
          )}
          <div className="mt-8 flex justify-center">
            <button type="submit" className="px-6 py-3 bg-heading text-white font-oswald font-bold text-xl rounded-xl">
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProfile;
