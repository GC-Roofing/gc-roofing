import FirestoreDataTable from '../dataTable/FirestoreDataTable';

import Button from '@mui/material/Button';


export default function WorkOrderInvoicingLeakRepair() {

    const ButtonLink = ({children, href}) => (
        <Button 
            size='small' 
            sx={{textWrap:'wrap', display:href ? 'inline-block' : 'none', minWidth:0}} 
            href={href} 
            target = "_blank" 
            rel = "noopener noreferrer"
            >
            {children}
        </Button>
    );

    const tableInfo = {
        collectionNames: ['WO1_Work_Order_Details', 'E1_Estimating_and_Job_Costing', 'E3_All_Invoicing'],
        title: 'Work Order Leak/Repair - Invoicing Report',
        relations: [
            {
                collections: ['WO1_Work_Order_Details', 'E1_Estimating_and_Job_Costing'],
                joinOn: 'WO_Number',
                joinType: 'inner',
            },
            {
                collections: ['E3_All_Invoicing'],
                joinOn: 'WO_Number',
                joinType: 'left',
            }
        ],
        labels: [
            {name:'Property Name', key:'Property_Name'},
            {name:'Job Type', key:'Job_Type'},
            {name:'Building Range', key:'Building_Range'},
            {
                name:'Job End Date', key:'End_Date', hideSearch:true,
                converter: (v) => {
                    if (v) {
                        const date = new Date(v.slice(0,-1));
                        return (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear();
                    }
                },
                reverter: (v) => v.replaceAll('/', ' '),
            },
            {name:'Entity Company', key:'Entity_Company'},
            {name:'Management Company', key:'Management_Company' },
            {name:'Status', key:'Status'},
            {
                name:'Total Estimate', key:'Total_Estimate', hideSearch:true,
                converter:(v) => Number(v).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
            },
            {
                name:'Discount Amount', key:'Discount_Amount', hideSearch:true,
                converter:(v) => Number(v).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
            },
            {
                name:'Total Actual', key:'Total_Actual', hideSearch:true,
                converter:(v) => Number(v).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
            },
            {
                name:'Invoice Amount', key:'Invoice_Amount', hideSearch:true,
                converter:(v) => Number(v).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
            },
            {name:'Work Order #', key:'WO_Number'},
            {
                name:'Dropbox', key:'Invoice_Link_to_View', hideSearch:true,
                renderer:(v) => <ButtonLink href={v}>View Invoice</ButtonLink>,
            },
            {
                name:'Created QB', key:'Invoice_Ready_QB', comparator:'=',
                converter: (v) => v ? 'yes' : 'no', 
                reverter: (v) => v === 'yes' ? 'true' : (v === 'no') ? 'false' : ''
            },
            {
                name:'Invoice Sent', key:'Invoice_Sent', comparator:'=',
                converter: (v) => v ? 'yes' : 'no', 
                reverter: (v) => v === 'yes' ? 'true' : (v === 'no') ? 'false' : ''
            },
            {
                name:'Invoice Sent Date', key:'Invoice_Date', hideSearch:true,
                converter: (v) => {
                    if (v) {
                        const date = new Date(v.slice(0,-1));
                        return (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear();
                    }
                },
                reverter: (v) => v.replaceAll('/', ' '),
            },
        ]
    }

    return (
        <>
            <FirestoreDataTable {...tableInfo} />
        </>
    );
}