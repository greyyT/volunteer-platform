import { axiosInstance } from '@/api';
import { Navbar } from '@/components';
import useEvents from '@/hooks/useEvents';
import { convertDateStringToDate } from '@/utils/dateConvert';
import axios from 'axios';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

const schema = z.object({
  name: z.string(),
  description: z.string(),
  platform: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  registrationEndDate: z.string(),
  location: z.string(),
  details: z.string(),
});

const CreateEvent = () => {
  const navigate = useNavigate();

  const { mutate } = useEvents();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    platform: '',
    startDate: '',
    endDate: '',
    registrationEndDate: '',
    location: '',
    details: '',
  });

  const [position, setPosition] = useState({
    name: '',
    description: '',
    requirements: '',
    maxParticipants: '',
  });

  const [contact, setContact] = useState({
    method: '',
    value: '',
  });

  const [verifications, setVerifications] = useState<File[]>([]);
  const [images, setImages] = useState<File[]>([]);

  const verificationsInputRef = useRef<HTMLInputElement>(null);
  const imagesInputRef = useRef<HTMLInputElement>(null);

  const onChangeImages = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File[]>>,
  ) => {
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
        setFile(fileArray);
      });
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (verifications.length === 0) {
      toast.error('Cần tải lên giấy phép!');
      return;
    }

    if (images.length === 0) {
      toast.error('Cần tải lên hình ảnh!');
      return;
    }

    const validationResult = schema.safeParse(formData);

    if (!validationResult.success) {
      const errors = validationResult.error.errors;

      if (errors.length > 0) {
        toast.error(errors[0].message);
      }

      return;
    }

    try {
      const event = await axiosInstance.post('/api/event', {
        ...formData,
        startDate: convertDateStringToDate(formData.startDate),
        endDate: convertDateStringToDate(formData.endDate),
        registrationEndDate: convertDateStringToDate(formData.registrationEndDate),
        positions: [
          {
            ...position,
            maxParticipants: parseInt(position.maxParticipants),
          },
        ],
        contacts: [contact],
      });

      for (const image of images) {
        const formData = new FormData();
        formData.append('photo', image, `${event.data?.slug}.${image.type.split('/')[1]}`);

        await axios.post(`http://localhost:3000/api/event/${event.data?.id}/photo`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        });
      }

      for (const verification of verifications) {
        const formData = new FormData();
        formData.append('verificationPaper', verification, `${event.data?.slug}.${verification.type.split('/')[1]}`);

        await axios.post(`http://localhost:3000/api/event/${event.data?.id}/verification`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        });
      }
      await mutate();
      toast.success('Tạo sự kiện thành công!');
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="pt-18 flex justify-center pb-10">
        <form
          onSubmit={onSubmit}
          className="mt-11 drop-shadow-xl bg-slate-100 w-[900px] px-6 py-6 rounded-2xl flex flex-col"
        >
          <h1 className="text-heading text-4xl font-bold font-oswald text-center">Đăng ký tổ chức sự kiện</h1>
          <div className="flex items-center font-inter mt-16">
            <div className="flex items-center gap-2 w-[200px]">
              <span className="material-symbols-outlined">signature</span> Tên:
            </div>
            <input
              type="text"
              name="name"
              className="bg-primary px-4 py-2 outline-none rounded-lg flex-1"
              value={formData.name}
              onChange={onInputChange}
            />
          </div>
          <div className="flex items-center font-inter mt-4">
            <div className="flex items-center gap-2 w-[200px]">
              <span className="material-symbols-outlined">description</span> Mô tả:
            </div>
            <input
              type="text"
              name="description"
              className="bg-primary px-4 py-2 outline-none rounded-lg flex-1"
              value={formData.description}
              onChange={onInputChange}
            />
          </div>
          <div className="flex items-center font-inter mt-4">
            <div className="flex items-center gap-2 w-[200px]">
              <span className="material-symbols-outlined">layers</span> Hình thức:
            </div>
            <input
              type="text"
              name="platform"
              className="bg-primary px-4 py-2 outline-none rounded-lg flex-1"
              value={formData.platform}
              onChange={onInputChange}
            />
          </div>
          <div className="flex items-center font-inter mt-4">
            <div className="flex items-center gap-2 w-[200px]">
              <span className="material-symbols-outlined">event_upcoming</span> Thời gian bắt đầu:
            </div>
            <input
              type="text"
              name="startDate"
              className="bg-primary px-4 py-2 outline-none rounded-lg flex-1"
              value={formData.startDate}
              onChange={onInputChange}
            />
          </div>
          <div className="flex items-center font-inter mt-4">
            <div className="flex items-center gap-2 w-[200px]">
              <span className="material-symbols-outlined">event_available</span> Thời gian kết thúc:
            </div>
            <input
              type="text"
              name="endDate"
              className="bg-primary px-4 py-2 outline-none rounded-lg flex-1"
              value={formData.endDate}
              onChange={onInputChange}
            />
          </div>
          <div className="flex items-center font-inter mt-4">
            <div className="flex items-center gap-2 w-[200px]">
              <span className="material-symbols-outlined">edit_calendar</span> Thời hạn đăng ký:
            </div>
            <input
              type="text"
              name="registrationEndDate"
              className="bg-primary px-4 py-2 outline-none rounded-lg flex-1"
              value={formData.registrationEndDate}
              onChange={onInputChange}
            />
          </div>
          <div className="flex items-center font-inter mt-4">
            <div className="flex items-center gap-2 w-[200px]">
              <span className="material-symbols-outlined">pin_drop</span> Địa điểm:
            </div>
            <input
              type="text"
              name="location"
              className="bg-primary px-4 py-2 outline-none rounded-lg flex-1"
              value={formData.location}
              onChange={onInputChange}
            />
          </div>
          <div className="flex items-center font-inter mt-4">
            <div className="flex items-center gap-2 w-[200px]">
              <span className="material-symbols-outlined">info</span> Chi tiết:
            </div>
            <input
              type="text"
              name="details"
              className="bg-primary px-4 py-2 outline-none rounded-lg flex-1"
              value={formData.details}
              onChange={onInputChange}
            />
          </div>
          <p className="font-inter font-medium ml-12 mt-4">Vị trí:</p>
          <div className="flex gap-8 mt-4">
            <input
              type="text"
              name="position-name"
              className="bg-primary px-4 py-2 outline-none rounded-lg flex-1 placeholder:text-white placeholder:font-medium"
              value={position.name}
              placeholder="Tên vị trí"
              onChange={(e) => setPosition({ ...position, name: e.target.value })}
            />
            <input
              type="text"
              name="position-description"
              className="bg-primary px-4 py-2 outline-none rounded-lg flex-1 placeholder:text-white placeholder:font-medium"
              value={position.description}
              placeholder="Mô tả"
              onChange={(e) => setPosition({ ...position, description: e.target.value })}
            />
            <input
              type="text"
              name="position-max-participants"
              className="bg-primary px-4 py-2 outline-none rounded-lg flex-1 placeholder:text-white placeholder:font-medium"
              value={position.maxParticipants}
              placeholder="Số lượng tối đa"
              onChange={(e) => setPosition({ ...position, maxParticipants: e.target.value })}
            />
          </div>
          <input
            type="text"
            name="position-requirements"
            className="bg-primary px-4 py-2 outline-none rounded-lg flex-1 placeholder:text-white placeholder:font-medium mt-4"
            value={position.requirements}
            placeholder="Yêu cầu"
            onChange={(e) => setPosition({ ...position, requirements: e.target.value })}
          />
          <p className="font-inter font-medium ml-12 mt-4">Liên hệ:</p>
          <div className="flex gap-8 mt-4">
            <input
              type="text"
              name="contact-method"
              className="bg-primary px-4 py-2 outline-none rounded-lg flex-1 placeholder:text-white placeholder:font-medium"
              value={contact.method}
              placeholder="Phương thức"
              onChange={(e) => setContact({ ...contact, method: e.target.value })}
            />
            <input
              type="text"
              name="contact-value"
              className="bg-primary px-4 py-2 outline-none rounded-lg flex-1 placeholder:text-white placeholder:font-medium"
              value={contact.value}
              placeholder="Thông tin"
              onChange={(e) => setContact({ ...contact, value: e.target.value })}
            />
          </div>
          <div className="flex items-center mt-6 gap-4">
            <p className="text-slate-400 italic">Tải lên giấy phép (nếu có)</p>
            <input
              type="file"
              accept="image/*"
              ref={verificationsInputRef}
              multiple
              onChange={(e) => onChangeImages(e, setVerifications)}
            />
          </div>
          <div className="flex items-center mt-6 gap-4">
            <p className="text-slate-400 italic">Tải lên hình ảnh</p>
            <input
              type="file"
              accept="image/*"
              ref={imagesInputRef}
              multiple
              onChange={(e) => onChangeImages(e, setImages)}
            />
          </div>
          <div className="flex justify-center mt-8">
            <button type="submit" className="font-oswald text-white bg-heading px-6 py-2 text-xl rounded-xl">
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateEvent;
