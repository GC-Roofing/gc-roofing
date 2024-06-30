import FirestoreDataTable from '../dataTable/FirestoreDataTable';

import Button from '@mui/material/Button';

export default function QuotesContractsContracts() {

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
        collectionName: 'C2_Contracts_Table',
        title: 'Contracts',
        labels: [
            {name:'Contract ID', key:'Contract_ID'},
            {name:'Proposal ID', key:'Proposal_ID'},
            {name:'Work Order ID', key:'WO_NewJob', hideSearch:true},
            {name:'Property Name', key:'Property_Name'},
            {name:'Entity Name', key:'Entity_Name'},
            {name:'Building Range', key:'Building_Range'},
            {name:'Contract Date', key:'Contract_Date', hideSearch:true},
            {
                name:'Contract Signed', key:'Contract_Signed', comparator:'=',
                converter: (v) => v ? 'yes' : 'no', 
                reverter: (v) => v === 'yes' ? 'true' : (v === 'no') ? 'false' : ''
            },
            {name:'Signed Date', key:'Contract_signed_Date', hideSearch:true},
            {
                name:'Dropbox Link', key:'Dropbox_Link', hideSearch:true,
                renderer:(v) => <ButtonLink href={v}>Dropbox Link</ButtonLink>,
            },
            {
                name:'Signed PDF', key:'Drive_Link_PDF', hideSearch:true,
                renderer:(v) => <ButtonLink href={v}>Download PDF</ButtonLink>,
            },
            {
                name:'Link to Edit', key:'Drive_Link_Edit', hideSearch:true,
                renderer:(v) => <ButtonLink href={v}>Edit Contract</ButtonLink>,
            },
            {
                name:'Proposal Amount', key:'Proposal_Amount', hideSearch:true,
                converter:(v) => Number(v).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
            },            
        ]
    }

    return (
        <>
            <FirestoreDataTable {...tableInfo} />
        </>
    );
}