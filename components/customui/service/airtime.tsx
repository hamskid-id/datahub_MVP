"use client";
import {
    TableCell,
    TableRow,
  } from "@/components/ui/table"
import { TableLayout } from "../global/tableLayout"
import { ViewLayout } from "../global/viewLayout";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import Spinner from "../global/spinner";
import { ModifyAirtimemodal } from "./ModifyAirtime";

export interface AirtimeApiObjectType {
    id: number,
    network: string,
    created_at:  string,
    updated_at:  string,
    discount:string,
    status: number,
    server: string,
}

export interface AirtimeApiArrayType{
    apiParameter:AirtimeApiObjectType[]
}
export const AirtimeService=({
    apiParameter
}: AirtimeApiArrayType)=>{
    const[
        isLoading,
        setIsLoading
    ]=useState(false);
    const[
        isMounted,
        setIsMounted
    ] = useState(false);
    const { toast } = useToast();
    
    const[
        querydata,
        setquerydata
    ]=useState<AirtimeApiObjectType[]>([]);

    const handleChange =(e:string)=>{
        const queryResponse = apiParameter?.filter((resp)=>resp.network.toLowerCase().includes(e?.toLowerCase()))
        setquerydata(queryResponse)
    }
    useEffect(()=>{
        setquerydata(apiParameter)
    },[apiParameter])
    
    useEffect(()=>{
        setIsMounted(true)
    },[])
    
    if(!isMounted){
        return <Spinner/>
    }

    return(
    <ViewLayout 
        navs={[
            "Airtime"
        ]}
        >
            {
                isLoading?
                <Spinner/>:(
                        <TableLayout
                            tableHeadRow={[
                                "S/N",
                                "Id",
                                "Network",
                                "Status",
                                "Discount",
                                // "Server",
                                "Creation Date",
                                "Action"
                            ]}
                            caption={"A list of your airtime"}
                            handleChange={handleChange}
                        >
                            {
                                querydata?.map((info,index)=>{
                                    const{
                                        id,
                                        network,
                                        discount,
                                        server,
                                        status,
                                        created_at
                                    }=info;
                                    return(
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{index +1}</TableCell>
                                            {
                                                [
                                                    id,
                                                    network,
                                                    status,
                                                    discount
                                                    // server
                                                ].map((bodyInfo,index)=><TableCell key={index}>{bodyInfo}</TableCell>)
                                            }
                                            <TableCell>{new Date(created_at).toLocaleString()}</TableCell>
                                            <TableCell>
                                                <ModifyAirtimemodal
                                                    id={id}
                                                    data={info}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                        </TableLayout>
                    )
            }
    </ViewLayout>
    )
}