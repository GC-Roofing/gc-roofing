import {useAuth} from '../../AuthContext';
import CaspioDataTable from '../dataTable/CaspioDataTable';

import Button from '@mui/material/Button';


export default function WorkOrderInvoicingLeakRepair() {
    const {caspioTokens, getTokens} = useAuth(); // get access tokens

    const ButtonLink = ({children, href}) => <Button size='small' sx={{textWrap:'wrap', display:href ? 'inline-block' : 'none', minWidth:0}} href={href}>{children}</Button>;

    const tableInfo = {
        url: 'https://c1acl820.caspio.com/rest/v2/views/Invoicing_View/records',
        caspioTokens: caspioTokens,
        getTokens: getTokens,
        title: 'Work Order Leak/Repair - Invoicing Report',
        pk: 'WO1_Work_Order_Details_WO_Number',
        labels: [
            {name:'Property Name', key:'WO1_Work_Order_Details_Property_Name'},
            {name:'Job Type', key:'WO1_Work_Order_Details_Job_Type'},
            {name:'Building Range', key:'WO1_Work_Order_Details_Building_Range'},
            {
                name:'Job End Date', key:'WO1_Work_Order_Details_End_Date', hideSearch:true,
                converter: (v) => {
                    if (v) {
                        const date = new Date(v);
                        return (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear();
                    }
                },
                reverter: (v) => v.replaceAll('/', ' '),
            },
            {name:'Entity Company', key:'WO1_Work_Order_Details_Entity_Company'},
            {name:'Management Company', key:'WO1_Work_Order_Details_Management_Company' },
            {name:'Status', key:'WO1_Work_Order_Details_Status'},
            {
                name:'Total Estimate', key:'E1_Estimating_and_Job_Costing_Total_Estimate', hideSearch:true,
                converter:(v) => Number(v).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
            },
            {
                name:'Discount Amount', key:'E1_Estimating_and_Job_Costing_Discount_Amount', hideSearch:true,
                converter:(v) => Number(v).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
            },
            {
                name:'Total Actual', key:'E1_Estimating_and_Job_Costing_Total_Actual', hideSearch:true,
                converter:(v) => Number(v).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
            },
            {
                name:'Invoice Amount', key:'E1_Estimating_and_Job_Costing_Invoice_Amount', hideSearch:true,
                converter:(v) => Number(v).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
            },
            {name:'Work Order #', key:'WO1_Work_Order_Details_WO_Number'},
            {
                name:'Dropbox', key:'E3_All_Invoicing_Invoice_Link_to_View', hideSearch:true,
                converter:(v) => <ButtonLink href={v}>View Invoice</ButtonLink>,
            },
            {
                name:'Created QB', key:'E3_All_Invoicing_Invoice_Ready_QB', comparator:'=',
                converter: (v) => v ? 'yes' : 'no', 
                reverter: (v) => v === 'yes' ? 'true' : (v === 'no') ? 'false' : ''
            },
            {
                name:'Invoice Sent', key:'E3_All_Invoicing_Invoice_Sent', comparator:'=',
                converter: (v) => v ? 'yes' : 'no', 
                reverter: (v) => v === 'yes' ? 'true' : (v === 'no') ? 'false' : ''
            },
            {
                name:'Invoice Sent Date', key:'E3_All_Invoicing_Invoice_Date', hideSearch:true,
                converter: (v) => {
                    if (v) {
                        const date = new Date(v);
                        return (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear();
                    }
                },
                reverter: (v) => v.replaceAll('/', ' '),
            },
        ]
    }

    return (
        <>
            <CaspioDataTable {...tableInfo} />
        </>
    );
}