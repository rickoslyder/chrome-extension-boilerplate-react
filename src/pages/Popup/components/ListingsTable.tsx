import React from "react";
// import { Link } from "react-router-dom";
import { DataGrid, GridColumns, GridRowsProp, GridToolbar } from "@mui/x-data-grid";
import {
  Tooltip,
} from "@mui/material";
import formatDate from "../utils/formatDate";
import isDateString from "../utils/isDateString";
// import stripHtml from "../utils/stripHtml";
import { Listing } from '../../../../lib/database.types';
import { supabase } from "../../../supabaseClient";

const handleAvailable = (datestring: string | null) => {
  console.log('formatting datestring for listing card -', datestring)
  console.log('type -', typeof datestring)
  if (datestring == null || datestring === 'null') {
    return (<i>No date provided - contact agent</i>)
  }
  else if (isDateString(datestring)) {
    return formatDate(datestring)
  }
  else {
    console.log('handled datestring -', datestring)
    return datestring
  }
}

const handleNa = (prop: string) => {
  if (prop) {
    return prop.startsWith("http") ? (
      <>
        <a href={prop} target="_blank" rel="noreferrer">
          <img src={prop} alt={prop} width="100%" />
        </a>
      </>
    ) : (
      prop
    );
  }
};

const ListingsTable = ({ listings, loadedState }: { listings: Listing[], loadedState: boolean }) => {
  const columns: GridColumns = [
    {
      field: "property_address",
      headerName: "Property Address",
      width: 150,
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
    },
    { field: "details", headerName: "Details", width: 150 },
    { field: "cost", headerName: "Cost", width: 100 },
    { field: "size", headerName: "Size", width: 100 },
    { field: "furnished", headerName: "Furnished", width: 120 },
    {
      field: "description",
      headerName: "Description",
      width: 200,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {params.value}
          </span>
        </Tooltip>
      ),
    },
    {
      field: "property_url",
      headerName: "Listing URL",
      width: 200,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <a
            href={params.value}
            target="_blank"
            rel="noreferrer"
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <span
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {params.value}
            </span>
          </a>
        </Tooltip>
      ),
    },
    {
      field: "available",
      headerName: "Available from",
      width: 120,
      renderCell: (params) => {
        return handleAvailable(params.value);
      },
    },
    {
      field: "floorplan",
      headerName: "Floorplan",
      width: 150,
      align: 'center',
      renderCell: (params) => {
        return handleNa(params.value);
      },
    },
    {
      field: "epc",
      headerName: "EPC",
      width: 150,
      align: 'center',
      renderCell: (params) => {
        console.log(params);
        return handleNa(params.value);
      },
    },
    { field: "agency_name", headerName: "Agency Name", width: 150 },
    { field: "agency_number", headerName: "Agency Number", width: 150 },
    { field: "agency_address", headerName: "Agency Address", width: 150 },
  ];

  const rows: GridRowsProp = listings?.map((listing, index) => {
    return { id: index + 1, ...listing };
  });

  const deleteSingleListing = async (id: number) => {
    try {
      await supabase.from('listings').delete().eq('listing_id', id)
      enqueueSnackbar('Listing deleted!', { variant: 'success' })
    } catch (error) {
      console.error(error);
      enqueueSnackbar(`Error deleting listing - ${error}`, { variant: 'error' })
    }
  }

  const deleteMultipleListings = async (ids: number[]) => {
    try {
      await supabase.from('listings').delete().in('listing_id', ids)
      enqueueSnackbar('Listing deleted!', { variant: 'success' })
    } catch (error) {
      console.error(error);
      enqueueSnackbar(`Error deleting listing - ${error}`, { variant: 'error' })
    }
  }

  return (
    <div style={{ height: "50%", width: "90%" }}>
      <div style={{ flexGrow: 3 }}>
        <DataGrid
          autoHeight
          checkboxSelection
          rows={rows}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowHeight={() => "auto"}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
          }
          loading={!loadedState}
        />
      </div>
    </div>
  );
};

export default ListingsTable;
function enqueueSnackbar(arg0: string, arg1: { variant: string; }) {
  throw new Error("Function not implemented.");
}

