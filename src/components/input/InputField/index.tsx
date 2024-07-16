import { Typography } from "@mui/material";
import { ReactNode } from "react";
import { Controller, Control } from "react-hook-form";

interface IProps {
  control: Control<any, unknown>;
  label?: string;
  placeholder: string;
  inputName: string;
  inputType?: string;
  error?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

const InputField = ({
  control,
  placeholder,
  inputName,
  inputType = "text",
  error,
  icon,
  disabled,
}: IProps) => {
  const renderTopRow = () => {
    if (error) {
      return (
        <span className="-mt-6 text-red-600 font-semibold textarea-xs">
          {error}
        </span>
      );
    }
    return null;
  };

  const capitalized = inputName.charAt(0).toUpperCase() + inputName.slice(1);

  return (
    <>
      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
        {capitalized}
      </Typography>
      <label className="input input-bordered flex items-center gap-2">
        {icon && icon}
        <div className={`${icon && "px-4"} my-2 w-9/12`}>
          <Controller
            name={inputName}
            control={control}
            disabled={disabled}
            render={({ field: { ...rest } }) => (
              <input
                {...rest}
                type={inputType}
                placeholder={placeholder}
                className="grow  input outline-none focus:outline-none border-none border-[0px] h-auto pl-1 pr-0"
              />
            )}
          />
        </div>
      </label>
      {renderTopRow()}
    </>
  );
};

export default InputField;
