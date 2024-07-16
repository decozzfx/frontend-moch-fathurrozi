export interface FormDtoType {
  negara: NegaraResponseType | null;
  pelabuhan: PelabuhanResponseType | null;
  barang: BarangResponseType | null;
  discount: string;
  harga: string;
  total: string;
}

export interface NegaraResponseType {
  id_negara: number;
  kode_negara: string;
  nama_negara: string;
}

export interface PelabuhanResponseType {
  id_pelabuhan: string;
  nama_pelabuhan: string;
  id_negara: string;
}

export interface BarangResponseType {
  id_barang: number;
  nama_barang: string;
  id_pelabuhan: number;
  description: string;
  diskon: number;
  harga: number;
}
