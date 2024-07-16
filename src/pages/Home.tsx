import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import { BARANG_URL, NEGARA_URL, PELABUHAN_URL } from "../utils/globalConfig";
import {
  BarangResponseType,
  FormDtoType,
  NegaraResponseType,
  PelabuhanResponseType,
} from "../types";
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
    negara: Yup.object()
      .shape({
        id_negara: Yup.number().required(),
        kode_negara: Yup.string().required(),
        nama_negara: Yup.string().required(),
      })
      .nullable(),
    pelabuhan: Yup.object()
      .shape({
        id_pelabuhan: Yup.string().required(),
        id_negara: Yup.string().required(),
        nama_pelabuhan: Yup.string().required(),
      })
      .nullable(),
    barang: Yup.object()
      .shape({
        id_barang: Yup.number().required(),
        nama_barang: Yup.string().required(),
        id_pelabuhan: Yup.number().required(),
        description: Yup.string().required(),
        diskon: Yup.number().required(),
        harga: Yup.number().required(),
      })
      .nullable(),
    discount: Yup.string().required("Discount is required"),
    harga: Yup.string().required("Harga is required"),
    total: Yup.string().required("Harga is required"),
  });

  const {
    control,
    watch,
    setValue,
    resetField,
    // formState: { errors },
  } = useForm<FormDtoType>({
    resolver: yupResolver(formSchema),
    mode: "all",
  });

  const { barang, negara, pelabuhan } = watch();

  const { data: dataNegara, isLoading: isLoadingNegara } = useQuery({
    queryKey: ["negara"],
    queryFn: async () => {
      const response = await axiosInstance.get<NegaraResponseType[]>(
        NEGARA_URL
      );
      return response.data;
    },
  });

  const { data: dataPelabuhan, isLoading: isLoadingPelabuhan } = useQuery({
    queryKey: ["pelabuhan"],
    queryFn: async () => {
      const response = await axiosInstance.get<PelabuhanResponseType[]>(
        PELABUHAN_URL
      );
      return response.data;
    },
  });

  const { data: dataBarang, isLoading: isLoadingBarang } = useQuery({
    queryKey: ["barang"],
    queryFn: async () => {
      const response = await axiosInstance.get<BarangResponseType[]>(
        BARANG_URL
      );
      return response.data;
    },
    // enabled: !!pelabuhan?.,
  });

  const listPelabuhan = dataPelabuhan?.filter(
    (pelabuhan) => pelabuhan.id_negara === negara?.id_negara?.toString()
  );

  const listBarang = dataBarang?.filter(
    (barang) => barang.id_pelabuhan.toString() === pelabuhan?.id_pelabuhan
  );

  const total = () => {
    const diskon = barang?.diskon ?? 0;
    const harga = barang?.harga ?? 0;
    const total = harga - (harga * diskon) / 100;
    return total;
  };

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
            rules={{ required: true }}
            render={({ field: { onChange, ...rest } }) => {
              return (
                <Autocomplete
                  {...rest}
                  defaultValue={null}
                  options={dataNegara ?? []}
                  loading={isLoadingNegara}
                  getOptionLabel={(option) => option.nama_negara || "-"}
                  isOptionEqualToValue={(option, value) =>
                    option.id_negara === value.id_negara
                  }
                  onChange={(_, value) => {
                    onChange(value);
                    resetField("barang");
                    resetField("pelabuhan");
                  }}
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
                  options={listPelabuhan ?? []}
                  getOptionLabel={(option) => option.nama_pelabuhan || "-"}
                  isOptionEqualToValue={(option, value) =>
                    option.id_pelabuhan === value.id_pelabuhan
                  }
                  onChange={(_, value) => {
                    resetField("barang");
                    onChange(value);
                  }}
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
                  options={listBarang ?? []}
                  loading={isLoadingBarang}
                  getOptionLabel={(option) => option.nama_barang || "-"}
                  onChange={(_, value) => {
                    onChange(value);
                    setValue("discount", value?.diskon?.toString() || "");
                    setValue("harga", value?.harga?.toString() || "");
                  }}
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
            value={barang?.description}
          />

          {/* Diskon */}
          <TextField
            value={barang?.diskon || ""}
            label="Diskon"
            disabled
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
          />

          {/* Harga */}

          <NumericFormat
            value={barang?.harga?.toString() || ""}
            label="Harga"
            fullWidth
            customInput={TextField}
            thousandSeparator=","
            allowNegative={false}
            decimalScale={8}
            disabled
            {...(barang == null
              ? {}
              : {
                  InputProps: {
                    startAdornment: (
                      <InputAdornment position="start">Rp</InputAdornment>
                    ),
                  },
                })}
          />
          {/* Total */}

          <NumericFormat
            label="Total"
            value={total() || ""}
            fullWidth
            customInput={TextField}
            thousandSeparator=","
            allowNegative={false}
            decimalScale={8}
            {...(barang == null
              ? {}
              : {
                  InputProps: {
                    startAdornment: (
                      <InputAdornment position="start">Rp</InputAdornment>
                    ),
                  },
                })}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
