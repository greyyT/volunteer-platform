import { useRef, useState } from 'react';
import axiosInstance from '../api/axios';
import axios from 'axios';

const CreateEvent = () => {
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

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // await axiosInstance.post('api/event', {
    //   name: 'Lời ra lời vào',
    //   description: 'Test Description',
    //   platform: 'Online',
    //   startDate: new Date('2021-08-01T00:00:00.000Z'),
    //   endDate: new Date('2021-08-01T00:00:00.000Z'),
    //   details: 'Test Details',
    //   location: 'Test Location',
    //   positions: [
    //     {
    //       name: 'Test Position',
    //       description: 'Test Description',
    //       requirements: 'Test Requirements',
    //       maxParticipants: 40,
    //     },
    //     {
    //       name: 'Test Position 2',
    //       description: 'Test Description 2',
    //       requirements: 'Test Requirements 2',
    //       maxParticipants: 45,
    //     },
    //   ],
    //   contacts: [
    //     {
    //       method: 'Email',
    //       value: 'test@gmail.com',
    //     },
    //     {
    //       method: 'Phone',
    //       value: '0868880171',
    //     },
    //   ],
    // });

    try {
      for (const image of images) {
        const formData = new FormData();
        formData.append('verificationPaper', image, `slug-hihi.${image.type.split('/')[1]}`);

        await axios.post('http://localhost:3000/api/event/LE2PZbWwpYPsYC7/verification', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-violet-950 w-screen h-screen flex items-center justify-center">
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <input type="file" accept="image/*" ref={fileInputRef} multiple onChange={onChangeImages} />
        <div>
          {images.map((imageData, index) => (
            <img key={index} src={imageData} alt={`Image ${index}`} />
          ))}
        </div>
        <button className="bg-white px-4 py-2 font-bold rounded-2xl" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
