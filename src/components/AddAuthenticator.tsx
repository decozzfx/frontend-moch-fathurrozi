import React from "react";
import toast from "react-hot-toast";
import { HiOutlineXMark } from "react-icons/hi2";
import InputField from "./input/InputField";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import { ADD_NEW_VERIFICATOR } from "../utils/globalConfig";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { AddNewAuthenticatorPostDtoType } from "../types";
import * as Yup from "yup";
import LoadingButton from "@mui/lab/LoadingButton";
import useStore from "../zustand";

interface AddAuthenticatorProps {
  slug: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddAuthenticator: React.FC<AddAuthenticatorProps> = ({
  slug,
  isOpen,
  setIsOpen,
}) => {
  const user = useStore((state) => state.user);

  const [showModal, setShowModal] = React.useState(false);

  const dataFormSchema = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .min(3, "Subject must be at least 3 character"),
    email: Yup.string().required("Email is required").email(),
    password: Yup.string()
      .required("Password is required")
      .min(3, "Password must be at least 3 character"),
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["add-new-authenticator"],
    mutationFn: async (formValues: AddNewAuthenticatorPostDtoType) => {
      const response = await axiosInstance.post(
        ADD_NEW_VERIFICATOR,
        formValues,
        {
          headers: { Authorization: `Bearer ${user.access_token}` },
        }
      );
      return response.data;
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddNewAuthenticatorPostDtoType>({
    resolver: yupResolver(dataFormSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  });

  const onSubmitHandler = (formValues: AddNewAuthenticatorPostDtoType) => {
    mutate(formValues, {
      onSuccess() {
        toast("Aunthenticator is successfully created");
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
                inputName="name"
                placeholder="Input name"
                error={errors.name?.message}
              />
            </div>

            <div>
              <InputField
                control={control}
                inputName="email"
                placeholder="Input email"
                error={errors.email?.message}
              />
            </div>

            <div>
              <InputField
                control={control}
                inputName="password"
                placeholder="Input password"
                error={errors.password?.message}
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

export default AddAuthenticator;
