import {useAuth} from '../../AuthContext';
import CaspioDataTable from '../dataTable/CaspioDataTable';

import Button from '@mui/material/Button';

export default function QuotesContractsContracts() {
    const {caspioTokens, getTokens} = useAuth(); // get access tokens

    const ButtonLink = ({children, href}) => <Button size='small' sx={{textWrap:'wrap', display:href ? 'inline-block' : 'none', minWidth:0}} href={href}>{children}</Button>;

    const tableInfo = {
        url: 'https://c1acl820.caspio.com/rest/v2/tables/C2_Contracts_Table/records',
        caspioTokens: caspioTokens,
        getTokens: getTokens,
        title: 'Contracts',
        pk: 'Contract_ID',
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
                converter:(v) => <ButtonLink href={v}>Dropbox Link</ButtonLink>,
            },
            {
                name:'Signed PDF', key:'Drive_Link_PDF', hideSearch:true,
                converter:(v) => <ButtonLink href={v}>Download PDF</ButtonLink>,
            },
            {
                name:'Link to Edit', key:'Drive_Link_Edit', hideSearch:true,
                converter:(v) => <ButtonLink href={v}>Edit Contract</ButtonLink>,
            },
            {
                name:'Proposal Amount', key:'Proposal_Amount', hideSearch:true,
                converter:(v) => Number(v).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
            },            
        ]
    }

    return (
        <>
            <CaspioDataTable {...tableInfo} />
        </>
    );
}