import {useAuth} from '../../AuthContext';
import CaspioDataTable from '../dataTable/CaspioDataTable';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';


export default function WorkOrderOverview() {
    const {caspioTokens, getTokens} = useAuth(); // get access tokens

    const ButtonLink = ({children, href}) => <Button size='small' sx={{textWrap:'wrap', display:href ? 'inline-block' : 'none', minWidth:0}} href={href}>{children}</Button>;

    const tableInfo = {
        url: 'https://c1acl820.caspio.com/rest/v2/tables/WO1_Work_Order_Details/records',
        caspioTokens: caspioTokens,
        getTokens: getTokens,
        title: 'Entity Companies',
        pk: 'WO_Number',
        labels: [
            {name:'Lead Tech', key:'Roof_Tech_Assigned_1'},
            {name:'Property Name', key:'Property_Name'},
            {name:'Job Type', key:'Job_Type'},
            {name:'Entity', key:'Entity_Company'},
            {name:'Management Company', key:'Management_Company' },
            {name:'Building Range', key:'Building_Range'},
            {name:'Status', key:'Status'},
            {
                name:'Start Date', key:'Start_Date',
                converter: (v) => {
                    if (v) {
                        const date = new Date(v);
                        return (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear();
                    }
                },
                reverter: (v) => v.replaceAll('/', ' '),
            },
            {name:'Contract ID', key:'Contract_ID'},
            {name:'Work Order #', key:'WO_Number'},
            {
                name:'CompanyCam', key:'Company_Cam', hideSearch:true,
                converter:(v) => <ButtonLink href={v}>Link</ButtonLink>,
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