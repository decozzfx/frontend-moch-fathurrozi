import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import { BARANG_URL, NEGARA_URL, PELABUHAN_URL } from "../utils/globalConfig";
import { FormDtoType } from "../types";
import {
  Autocomplete,
  InputAdornment,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import { NumericFormat } from "react-number-format";

const Home = () => {
  const formSchema = Yup.object().shape({
    negara: Yup.string().required("Negara is required"),
    pelabuhan: Yup.string().required("Pelabuhan is required"),
    barang: Yup.string().required("Barang is required"),
    discount: Yup.string().required("Discount is required"),
    harga: Yup.string().required("Harga is required"),
    total: Yup.string().required("Harga is required"),
  });

  const {
    control,
    watch,
    // formState: { errors },
  } = useForm<FormDtoType>({
    resolver: yupResolver(formSchema),
    defaultValues: {},
  });

  const { barang, discount, harga, negara, pelabuhan } = watch();

  const { data: dataNegara, isLoading: isLoadingNegara } = useQuery({
    queryKey: ["negara"],
    queryFn: async () => {
      const response = await axiosInstance.get(NEGARA_URL);
      return response.data;
    },
  });
  console.log("🚀 ~ Home ~ dataNegara:", dataNegara);

  const { data: dataPelabuhan, isLoading: isLoadingPelabuhan } = useQuery({
    queryKey: ["pelabuhan"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${PELABUHAN_URL}?filter={where:{id_negara=1}}`
      );
      return response.data;
    },
  });
  console.log("🚀 ~ Home ~ dataPelabuhan:", dataPelabuhan);

  const { data: dataBarang, isLoading: isLoadingBarang } = useQuery({
    queryKey: ["barang"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${BARANG_URL}?filter={where:{id_negara=1}}`
      );
      return response.data;
    },
  });
  console.log("🚀 ~ Home ~ dataBarang:", dataBarang);

  return (
    // screen
    <div className="home p-0 m-0">
      {/* grid */}
      <div className="grid grid-cols-1  grid-flow-dense gap-6">
        <Typography variant="h4" textAlign="center">
          Form Perhitungan Barang
        </Typography>

        <div className="grid grid-cols-1 grid-flow-dense gap-6 w-1/2">
          {/* Negara */}
          <Controller
            control={control}
            name="negara"
            defaultValue={null}
            rules={{ required: true }}
            render={({ field: { onChange, ...rest } }) => {
              return (
                <Autocomplete
                  {...rest}
                  options={[]}
                  loading={isLoadingNegara}
                  // getOptionLabel={option => option.sitesCode || '-'}
                  onChange={(_, value) => onChange(value)}
                  renderInput={(params) => {
                    return <TextField {...params} label="Negara" />;
                  }}
                />
              );
            }}
          />

          {/* Pelabuhan */}
          <Controller
            control={control}
            name="pelabuhan"
            defaultValue={null}
            rules={{ required: true }}
            render={({ field: { onChange, ...rest } }) => {
              return (
                <Autocomplete
                  {...rest}
                  loading={isLoadingPelabuhan}
                  options={[]}
                  // getOptionLabel={option => option.sitesCode || '-'}
                  onChange={(_, value) => onChange(value)}
                  renderInput={(params) => {
                    return <TextField {...params} label="Pelabuhan" />;
                  }}
                />
              );
            }}
          />

          {/* Barang */}
          <Controller
            control={control}
            name="barang"
            defaultValue={null}
            rules={{ required: true }}
            render={({ field: { onChange, ...rest } }) => {
              return (
                <Autocomplete
                  {...rest}
                  options={[]}
                  loading={isLoadingBarang}
                  // getOptionLabel={option => option.sitesCode || '-'}
                  onChange={(_, value) => onChange(value)}
                  renderInput={(params) => {
                    return <TextField {...params} label="Barang" />;
                  }}
                />
              );
            }}
          />

          {/* Barang */}
          <TextareaAutosize
            aria-label="minimum height"
            minRows={3}
            placeholder="Deskripsi barang"
            disabled
          />

          {/* Diskon */}
          <TextField label="Diskon" disabled />

          {/* Harga */}
          <Controller
            control={control}
            name="harga"
            defaultValue=""
            disabled
            render={({ field: { value, ...rest } }) => (
              <NumericFormat
                {...rest}
                label="Harga"
                fullWidth
                customInput={TextField}
                thousandSeparator=","
                allowNegative={false}
                decimalScale={8}
                disabled
                {...(value == ""
                  ? {}
                  : {
                      InputProps: {
                        startAdornment: (
                          <InputAdornment position="start">Rp</InputAdornment>
                        ),
                      },
                    })}
              />
            )}
          />

          {/* Total */}
          <Controller
            control={control}
            name="total"
            defaultValue=""
            disabled
            render={({ field: { value, ...rest } }) => (
              <NumericFormat
                {...rest}
                label="Total"
                fullWidth
                customInput={TextField}
                thousandSeparator=","
                allowNegative={false}
                decimalScale={8}
                {...(value == ""
                  ? {}
                  : {
                      InputProps: {
                        startAdornment: (
                          <InputAdornment position="start">Rp</InputAdornment>
                        ),
                      },
                    })}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
