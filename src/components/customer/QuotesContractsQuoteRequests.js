import {useAuth} from '../../AuthContext';
import CaspioDataTable from '../dataTable/CaspioDataTable';



export default function QuotesContractsQuoteRequests() {
    const {caspioTokens, getTokens} = useAuth(); // get access tokens

    const tableInfo = {
        url: 'https://c1acl820.caspio.com/rest/v2/tables/C3_Contracts_Quote_Table_Request/records',
        caspioTokens: caspioTokens,
        getTokens: getTokens,
        title: 'Quote Requests',
        pk: 'Quote_ID',
        labels: [
            {name:'Assigned', key:'Assigned_Estimator'},
            {name:'Source', key:'Quote_Source'},
            {name:'Property Type', key:'Quote_Type'},
            {name:'Proposal Type', key:'Proposal_Type'},
            {
                name:'QO Date', key:'Todays_Date',
                converter: (v) => {
                    if (v) {
                        const date = new Date(v);
                        return (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear();
                    }
                },
                reverter: (v) => v.replaceAll('/', ' '),
            },
            {name:'Quote ID', key:'Quote_ID'},
            {name:'Related WO', key:'Work_Order_Number_Related'},
            {name:'Property', key:'Property_Name'},
            {name:'Building Range', key:'Building_Range'},
            {
                name:'Completed', key:'Quote_Completed', comparator:'=',
                converter: (v) => v ? 'yes' : 'no', 
                reverter: (v) => v === 'yes' ? 'true' : (v === 'no') ? 'false' : ''
            },
            {
                name:'Closed', key:'Quote_Closed', comparator:'=',
                converter: (v) => v ? 'yes' : 'no', 
                reverter: (v) => v === 'yes' ? 'true' : (v === 'no') ? 'false' : 'fail'
            },
            {name:'Days Pending', key:'Pending_Days'},
        ]
    }

    return (
        <>
            <CaspioDataTable {...tableInfo} />
        </>
    );
}