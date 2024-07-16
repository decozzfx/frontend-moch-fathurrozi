import React from "react";
import toast from "react-hot-toast";
import { HiOutlineXMark } from "react-icons/hi2";
import InputField from "./input/InputField";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import { PERMITTIONS_POST } from "../utils/globalConfig";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { PermittionPostDtoType } from "../types";
import * as Yup from "yup";
import LoadingButton from "@mui/lab/LoadingButton";
import useStore from "../zustand";

interface AddDataProps {
  slug: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddData: React.FC<AddDataProps> = ({ slug, isOpen, setIsOpen }) => {
  const user = useStore((state) => state.user);

  const [showModal, setShowModal] = React.useState(false);

  const dataFormSchema = Yup.object().shape({
    subject: Yup.string()
      .required("Subject is required")
      .min(3, "Subject must be at least 3 character"),
    description: Yup.string()
      .required("description is required")
      .min(3, "Description must be at least 3 character"),
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["add-new-permittion"],
    mutationFn: async (formValues: PermittionPostDtoType) => {
      const response = await axiosInstance.post(PERMITTIONS_POST, formValues, {
        headers: { Authorization: `Bearer ${user.access_token}` },
      });
      return response.data;
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PermittionPostDtoType>({
    resolver: yupResolver(dataFormSchema),
    defaultValues: {
      subject: "",
      description: "",
    },
  });

  const onSubmitHandler = (formValues: PermittionPostDtoType) => {
    mutate(formValues, {
      onSuccess() {
        toast("Permittion is successfully created");
        setIsOpen(false);
      },
      onError(error: any) {
        toast(error.data.message);
      },
    });
  };

  React.useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  return (
    <div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center bg-black/75 z-[99]">
      <div
        className={`w-[80%] xl:w-[50%] rounded-lg p-7 bg-base-100 relative transition duration-300 flex flex-col items-stretch gap-5 ${
          showModal ? "translate-y-0" : "translate-y-full"
        }
            ${showModal ? "opacity-100" : "opacity-0"}`}
      >
        <div className="w-full flex justify-between pb-5 border-b border-base-content border-opacity-30">
          <button
            onClick={() => {
              setShowModal(false);
              setIsOpen(false);
            }}
            className="absolute top-5 right-3 btn btn-ghost btn-circle"
          >
            <HiOutlineXMark className="text-xl font-bold" />
          </button>
          <span className="text-2xl font-bold">Add new {slug}</span>
        </div>
        <form onSubmit={handleSubmit(onSubmitHandler)} className="w-full">
          <div className=" grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <InputField
                control={control}
                inputName="subject"
                placeholder="Input subject"
                error={errors.subject?.message}
              />
            </div>

            <div>
              <InputField
                control={control}
                inputName="description"
                placeholder="Input description"
                error={errors.description?.message}
              />
            </div>
          </div>
          <div className="mt-10">
            <LoadingButton
              type="submit"
              variant="contained"
              fullWidth
              loading={isPending}
            >
              Submit
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddData;
