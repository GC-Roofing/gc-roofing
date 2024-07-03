import FirestoreDataTable from '../dataTable/FirestoreDataTable';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';


export default function WorkOrderInvoicingContractExtensiveRepair() {

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
        collectionNames: ['C2_Contracts_Table'],
        title: 'Contract & Extensive Repair Invoicing Report',
        labels: [
            {
                name:'Contract Date', key:'Contract_Date', hideSearch:true,
                converter: (v) => {
                    if (v) {
                        const date = new Date(v.slice(0,-1));
                        return (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear();
                    }
                },
                reverter: (v) => v.replaceAll('/', ' '),
            },
            {name:'Type of Work', key:'Type_of_Work'},
            {name:'Roof Product Name', key:'Roof_Product_Name', hideSearch:true},
            {name:'Building Range', key:'Building_Range', hideSearch:true},
            {name:'Manager Name', key:'Manager_Name', hideSearch:true},
            {name:'Entity Name', key:'Entity_Name', hideSearch:true},
            {
                name:'Contract Signed', key:'Contract_Signed', comparator:'=',
                converter: (v) => v ? 'yes' : 'no', 
                reverter: (v) => v === 'yes' ? 'true' : (v === 'no') ? 'false' : ''
            },
            {
                name:'Signed Date', key:'Contract_signed_Date', hideSearch:true,
                converter: (v) => {
                    if (v) {
                        const date = new Date(v.slice(0,-1));
                        return (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear();
                    }
                },
                reverter: (v) => v.replaceAll('/', ' '),
            },
            {name:'Contract ID', key:'Contract_ID'},
            {name:'WO ID', key:'WO_NewJob'},
            {
                name:'Dropbox', key:'Dropbox_Link', hideSearch:true,
                renderer:(v) => <ButtonLink href={v}>Dropbox Link</ButtonLink>,
            },
            {
                name:'CompanyCam', key:'Company_Cam', hideSearch:true,
                renderer:(v) => <ButtonLink href={v}>CompanyCam Link</ButtonLink>,
            },
            {
                name:'PDF', key:'Drive_Link_PDF', hideSearch:true,
                renderer:(v) => <ButtonLink href={v}>View Contract</ButtonLink>,
            },
            

        ]
    }

    return (
        <>
            <Box sx={{mx:'1%', overflow:'scroll', height:'100%'}}>
                <FirestoreDataTable {...tableInfo} />
            </Box>
        </>
    );
}