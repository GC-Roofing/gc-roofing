import {useAuth} from '../../AuthContext';
import CaspioDataTable from '../dataTable/CaspioDataTable';



export default function CusomterOverviewPropertyGroups() {
    const {caspioTokens, getTokens} = useAuth(); // get access tokens

    const tableInfo = {
        url: 'https://c1acl820.caspio.com/rest/v2/tables/A4_Property_IDs/records',
        caspioTokens: caspioTokens,
        getTokens: getTokens,
        title: 'Property Groups & IDs',
        pk: 'Property_ID',
        labels: [
            {name:'Group ID', key:'Property_ID'},
            {name:'Property Name', key:'Property_Name'},
            {name:'Entity ID', key:'Entity_ID'},
            {name:'Entity Name', key:'Entity_Name'},
            {name:'Property Address', key:'Property_Address'},
            {name:'Property City', key:'Property_City'},
            {name:'Property State', key:'Property_State'},
            {name:'Property Zip', key:'Property_Zip'},
        ]
    }

    return (
        <>
            <CaspioDataTable {...tableInfo} />
        </>
    );
}