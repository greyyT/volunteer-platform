import { useState } from 'react';
import axiosInstance from '../api/axios';

const SignUpOrganization = () => {
  const [formData, setFormData] = useState<{
    email: string;
    username: string;
    phone: string;
    password: string;
  }>({
    email: '',
    username: '',
    phone: '',
    password: '',
  });

  // const fileInputRef = useRef<HTMLInputElement>(null);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const onChangeImages = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const selectedFiles = e.target.files;

  //   if (selectedFiles) {
  //     const imagePromises = Array.from(selectedFiles).map((file) => {
  //       return new Promise<string>((resolve) => {
  //         const reader = new FileReader();

  //         reader.onload = (e) => {
  //           resolve(e.target?.result as string);
  //         };

  //         reader.readAsDataURL(file);
  //       });
  //     });

  //     Promise.all(imagePromises).then((imageDataArray) => {
  //       setFormData({ ...formData, photos: imageDataArray });
  //     });
  //   }
  // };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);

    try {
      await axiosInstance.post('auth/sign-up/organization', formData);
    } catch (error) {
      console.log(error);
    }
  };

  const onSignOut = async () => {
    try {
      await axiosInstance.post('auth/sign-out');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex w-screen h-screen bg-violet-950 items-center justify-center">
      <form className="bg-white rounded-3xl px-10 py-5 flex flex-col gap-4" onSubmit={onSubmit}>
        {/* <input type="file" accept="image/*" ref={fileInputRef} multiple onChange={onChangeImages} />
        <div>
          {formData.photos.map((imageData, index) => (
            <img key={index} src={imageData} alt={`Image ${index}`} />
          ))}
        </div> */}
        <input
          type="email"
          name="email"
          className="px-4 py-2 border border-solid border-gray-400 rounded-sm"
          placeholder="Input Email"
          value={formData.email}
          onChange={onInputChange}
        />
        <input
          type="text"
          name="username"
          className="px-4 py-2 border border-solid border-gray-400 rounded-sm"
          placeholder="Input Username"
          value={formData.username}
          onChange={onInputChange}
        />
        <input
          type="text"
          name="phone"
          className="px-4 py-2 border border-solid border-gray-400 rounded-sm"
          placeholder="Input Phone"
          value={formData.phone}
          onChange={onInputChange}
        />
        <input
          type="password"
          name="password"
          className="px-4 py-2 border border-solid border-gray-400 rounded-sm"
          placeholder="Input Password"
          value={formData.password}
          onChange={onInputChange}
        />
        <button type="submit" className="mt-5 px-4 py-2 bg-violet-700 rounded-lg text-white">
          Submit
        </button>
        <button onClick={onSignOut} type="button" className="px-4 py-2 rounded-lg border border-solid border-gray-800">
          Sign out
        </button>
      </form>
    </div>
  );
};

export default SignUpOrganization;
