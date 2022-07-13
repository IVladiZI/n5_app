import { useState, useEffect} from "react";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import { PermissionRequest } from "../repository/model/request/dist/permissionRequest";
import { Responses } from "../repository/model/Responses";
const options: any = {
    filterType: 'checkbox',
};

export const TablePermission = () => {
    //config hooks
    const [permission,setPermission] = useState([])
    //show data whit axios
    const urlBase = "https://localhost:44314"
    const getPermission = "/api/Permission"
    const res : Responses<typeof PermissionRequest> = {} as any
    //define columns
    const result = async () => {
        await axios.get(urlBase+getPermission).then((response)=>{
            res.Data = response.data
            res.Message = response.statusText
            res.State = response.status
            console.log(response.data)
        setPermission(response.data)
        })
    }
    useEffect(() => {
        result()
    },[])
    //render table
    const columns = [
        {
            name:"id",
            label:"ID"
        },
        {
            name:"name",
            label:"Nombre"
        },
        {
            name:"lastName",
            label:"Apellido"
        },
        {
            name:"idTypePermission",
            label:"Tipo de Permiso"
        }
    ]
    //model
    return (
        <MUIDataTable
            title={"Lista de permios"}
            data={permission}
            columns={columns}
            options={options}
        />
    )
};
