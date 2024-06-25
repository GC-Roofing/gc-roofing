import {useAuth} from '../../AuthContext';
import CaspioDataTable from '../dataTable/CaspioDataTable';

import Box from '@mui/material/Box';


export default function HistoricalWarranties() {
    const {caspioTokens, getTokens} = useAuth(); // get access tokens

    const tableInfo = {
        url: 'https://c1acl820.caspio.com/rest/v2/tables/W1_Historical_Warranties/records',
        caspioTokens: caspioTokens,
        getTokens: getTokens,
        title: 'Historical Warranties Report',
        pk: 'Record_ID',
        padding: '1%',
        labels: [
            {
                name:'Date Entered', key:'DateEntered',
                converter: (v) => {
                    if (v) {
                        const date = new Date(v);
                        return (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear();
                    }
                },
                reverter: (v) => v.replaceAll('/', ' '),
            },
            {name:'Property Name', key:'Property_Name'},
            {name:'Building ID', key:'Building_ID', hideSearch: true},
            {name:'Building Range', key:'Building_Range', hideSearch: true},
            {name:'Management Company', key:'Management_Company'},
            {name:'Entity Name', key:'Entity_Name'},
            {
                name:'Effective Date', key:'Effective_Date', hideSearch: true,
                converter: (v) => {
                    if (v) {
                        const date = new Date(v);
                        return (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear();
                    }
                },
                reverter: (v) => v.replaceAll('/', ' '),
            },
            {name:'Material Year', key:'Material_Year', hideSearch: true},
            {
                name:'Material Expiration', key:'Material_Expiration', hideSearch: true,
                converter: (v) => {
                    if (v) {
                        const date = new Date(v);
                        return (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear();
                    }
                },
                reverter: (v) => v.replaceAll('/', ' '),
            },
            {name:'Contractor Year', key:'Contractor_Year', hideSearch: true},
            {
                name:'Contractor Expiration', key:'Contractor_Expiration', hideSearch: true,
                converter: (v) => {
                    if (v) {
                        const date = new Date(v);
                        return (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear();
                    }
                },
                reverter: (v) => v.replaceAll('/', ' '),
            },
            {name:'Manufacturer', key:'Manufacturer'},
            {name:'Roof System', key:'RoofSystem', hideSearch: true},
            {name:'WO', key:'WORelated'},
            {name:'Contract ID', key:'Contract_ID', hideSearch: true},
            {
                name:'Recoat Reminder', key:'RecoatReminder',
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
            <Box sx={{mx:'1%', overflow:'scroll', height:'100%'}}>
                <CaspioDataTable {...tableInfo} />
            </Box>
        </>
    );
}