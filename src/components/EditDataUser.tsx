import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import { PROMOTE_VERIFICATOR } from "../utils/globalConfig";
import { HiOutlineXMark } from "react-icons/hi2";
import InputField from "./input/InputField";
import { useForm } from "react-hook-form";
import LoadingButton from "@mui/lab/LoadingButton";
import useStore from "../zustand";

interface EditDataUserProps {
  slug: string;
  id: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditDataUser: React.FC<EditDataUserProps | any> = (props) => {
  const { slug, isOpen, setIsOpen, id } = props;
  const user = useStore((state) => state.user);

  const [showModal, setShowModal] = React.useState(false);

  const { mutate } = useMutation({
    mutationKey: ["add-new-permittion"],
    mutationFn: async (id: string) => {
      const response = await axiosInstance.put(
        PROMOTE_VERIFICATOR,
        {
          id: id,
        },
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
    setValue,
  } = useForm<{ name: string }>({
    defaultValues: {
      name: "",
    },
  });

  const onSubmitHandler = () => {
    mutate(id, {
      onSuccess(data) {
        toast(data?.message);
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

  useEffect(() => {
    setValue("name", props.name);
  }, [props.name, setValue]);

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
          <span className="text-2xl font-bold">
            Edit {slug?.substring(0, slug.length - 1)} {id}
          </span>
        </div>
        <form onSubmit={handleSubmit(onSubmitHandler)} className="w-full">
          <div className=" grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <InputField
                control={control}
                inputName="name"
                placeholder="Nama user"
                disabled
                error={errors.name?.message}
              />
            </div>

            {/* <div>
              <InputField
                control={control}
                inputName="description"
                placeholder="Input description"
                error={errors.description?.message}
              />
            </div> */}
          </div>
          <div className="mt-10">
            <LoadingButton
              type="submit"
              variant="contained"
              fullWidth
              // loading={isPending}
            >
              Change To Verificator
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDataUser;
