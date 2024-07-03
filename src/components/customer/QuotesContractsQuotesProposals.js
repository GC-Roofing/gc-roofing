import FirestoreDataTable from '../dataTable/FirestoreDataTable';

import Button from '@mui/material/Button';

export default function QuotesContractsQuotesProposals() {

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
        collectionNames: ['C1_Contracts_Quotes_Table'],
        title: 'Quotes & Proposals',
        labels: [
            {name:'Quote ID', key:'Quote_ID'},
            {name:'Property Name', key:'Property_Name'},
            {name:'Proposal ID', key:'Proposal_ID'},
            {name:'Entity Name', key:'Entity_Company'},
            {name:'Building Range', key:'Building_Range'},
            {name:'Type of Work', key:'Proposal_Type'},
            {
                name:'Quote Date', key:'Todays_Date',
                converter: (v) => {
                    if (v) {
                        const date = new Date(v);
                        return (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear();
                    }
                },
                reverter: (v) => v.replaceAll('/', ' '),
            },
            {
                name:'Quote Expires', key:'Quote_Expiration',
                converter: (v) => {
                    if (v) {
                        const date = new Date(v);
                        return (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear();
                    }
                },
                reverter: (v) => v.replaceAll('/', ' '),
            },
            {name:'Roof System', key:'Roof_System'},
            {name:'Material Warranty Years', key:'Material_Warranty_Years'},
            {
                name:'Quote Amount', key:'Proposal_Amount',
                converter:(v) => Number(v).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
            },
            {
                name:'Photo Link', key:'QO_Company_Cam_Link', hideSearch:true,
                renderer:(v) => <ButtonLink href={v}>Photo Link</ButtonLink>,
            },
            {
                name:'Dropbox Link', key:'Dropbox_Link', hideSearch:true,
                renderer:(v) => <ButtonLink href={v}>Dropbox Link</ButtonLink>,
            },
            {name:'Ready for Google Doc', key:'ReadyForDoc'},
            {
                name:'Edit', key:'Drive_Link_Edit', hideSearch:true,
                renderer:(v) => <ButtonLink href={v}>Edit</ButtonLink>,
            },
            {
                name:'Download PDF', key:'Drive_Link_PDF', hideSearch:true,
                renderer:(v) => <ButtonLink href={v}>Download PDF</ButtonLink>,
            },
            {name:'Close Quote', key:'Close_Quote'},
            
        ]
    }

    return (
        <>
            <FirestoreDataTable {...tableInfo} />
        </>
    );
}