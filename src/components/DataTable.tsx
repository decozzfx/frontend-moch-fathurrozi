/* eslint-disable no-unused-vars */
import React from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import {
  HiOutlinePencilSquare,
  HiOutlineEye,
  HiTrash,
  HiCheck,
} from "react-icons/hi2";
import { EditHandlerType } from "../types";

interface DataTableProps {
  columns: GridColDef[];
  rows: object[];
  slug: string;
  includeActionColumn: boolean;
  editHandler?: (params: EditHandlerType | any) => void;
  deleteHandler?: (params: EditHandlerType) => void;
  permittionHandler?: (params: EditHandlerType) => void;
  isLoading: boolean;
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  rows,
  slug,
  includeActionColumn,
  editHandler,
  deleteHandler,
  permittionHandler,
  isLoading,
}) => {
  const navigate = useNavigate();

  const actionColumn: GridColDef = {
    field: "action",
    headerName: "Action",
    minWidth: 200,
    flex: 1,
    renderCell: (params) => {
      return (
        <div className="flex items-center">
          <button
            onClick={() => {
              navigate(
                `/${slug?.substring(0, slug.length - 1)}/${params.row.id}`
              );
            }}
            className="btn btn-square btn-ghost"
          >
            <HiOutlineEye />
          </button>

          {editHandler ? (
            <button
              onClick={() =>
                editHandler({ slug, id: params.row.id, ...params.row })
              }
              className="btn btn-square btn-ghost"
            >
              <HiOutlinePencilSquare />
            </button>
          ) : null}

          {deleteHandler ? (
            <button
              onClick={() => deleteHandler({ slug, id: params.row.id })}
              className="btn btn-square btn-ghost"
            >
              <HiTrash />
            </button>
          ) : null}

          {permittionHandler ? (
            <button
              onClick={() => permittionHandler({ slug, id: params.row.id })}
              className="btn btn-square btn-ghost"
            >
              <HiCheck />
            </button>
          ) : null}
        </div>
      );
    },
  };

  if (includeActionColumn === true) {
    return (
      <div className="w-full bg-base-100 text-base-content">
        <DataGrid
          autoHeight
          className="dataGrid p-0 xl:p-3 w-full bg-base-100 text-white"
          rows={rows}
          columns={[...columns, actionColumn]}
          getRowHeight={() => "auto"}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: false,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          disableRowSelectionOnClick
          disableColumnFilter
          disableDensitySelector
          disableColumnSelector
          hideFooterPagination
          loading={isLoading}
        />
      </div>
    );
  } else {
    return (
      <div className="w-full bg-base-100 text-base-content">
        <DataGrid
          autoHeight
          className="dataGrid p-0 xl:p-3 w-full bg-base-100 text-white"
          rows={rows}
          columns={[...columns]}
          getRowHeight={() => "auto"}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
          disableColumnFilter
          disableDensitySelector
          disableColumnSelector
          loading={isLoading}
        />
      </div>
    );
  }
};

export default DataTable;
