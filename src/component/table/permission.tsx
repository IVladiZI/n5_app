import { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { TablePagination } from '@mui/material';


import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
    GridRowsProp,
    GridRowModesModel,
    GridRowModes,
    DataGrid,
    GridColumns,
    GridRowParams,
    MuiEvent,
    GridToolbarContainer,
    GridActionsCellItem,
    GridEventListener,
    GridRowId,
    GridRowModel,
} from '@mui/x-data-grid';
import { Permission } from "../../models/entities/permission";
import { getAll, update, create, deletePermission } from "../../services/permission";


interface EditToolbarProps {
    setPermission: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
        newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void;
}

function EditToolbar(props: EditToolbarProps) {
    const { setPermission, setRowModesModel } = props;
    const id = 0;
    const handleClick = () => {
        setPermission((oldRows) => [{ id, name: '', lastName: '', idTypePermission: '', isNew: true },...oldRows]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
        }));
    };

    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Agregar Nuevo Permiso
            </Button>
        </GridToolbarContainer>
    );
}



export const TablePermission = () => {
    //config hooks
    const [permission, setPermission] = useState(new Array<Permission>())

    useEffect(() => {
        getAll().then((resp) => {
            setPermission(resp)
        })
    }, [])

    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

    const handleRowEditStart = (
        params: GridRowParams,
        event: MuiEvent<React.SyntheticEvent>,
    ) => {
        event.defaultMuiPrevented = true;
    };

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        event.defaultMuiPrevented = true;
    };

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id: GridRowId) => () => {
        deletePermission(id).then(response=>{
            if(response)
            setPermission(permission.filter((row) => row.id !== id));
        }).catch(console.log)
    };

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = permission.find((row) => row.id === id);
        if (editedRow!.isNew) {
            setPermission(permission.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = async (newRow: GridRowModel) => {
        const updatedRow = { ...newRow, isNew: false };
        if(newRow.isNew){
            const newPermission={...newRow,id:0}
            return await create(newPermission).then(response=>{
                if(response){
                    setPermission(permission.map((row) => (row.id === newRow.id ? response : row)));
                    return {
                        ...response,isNew: false
                    }
                }
                return updatedRow
                //setPermission(permission.map((row) => (row.id === newRow.id ? updatedRow : row)));
            })
        }
        else {
            const newPermission={...newRow}
            await update(newPermission).then(response=>{
                if(response)
                setPermission(permission.map((row) => (row.id === newRow.id ? updatedRow : row)));
            })
        }
        return updatedRow;
    };

    const columns: GridColumns = [
        {
            field: "id",
            headerName: "Id",
            flex: 0.2,
        },
        {
            field: "name",
            headerName: "Nombre",
            editable: true,
            width: 200,
            flex: 0.2,
        },
        {
            field: "lastName",
            headerName: "Apellido",
            editable: true,
            width: 200,
            flex: 0.2,
        },
        {
            field: "idTypePermission",
            headerName: "Tipo de Permiso",
            editable: true,
            flex: 0.2,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Acciones',
            flex: 0.2,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];

    return (
        <Box
            sx={{
                height: '100%',
                width: '100%',
                '& .actions': {
                    color: 'text.secondary',
                },
                '& .textPrimary': {
                    color: 'text.primary',
                },

            }}
        >
            <DataGrid
                rows={permission}
                columns={columns}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowEditStart={handleRowEditStart}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                components={{
                    Toolbar: EditToolbar,
                }}
                componentsProps={{
                    toolbar: { setPermission, setRowModesModel },
                }}
                experimentalFeatures={{ newEditingApi: true }}
            />
        </Box>
    );
};
