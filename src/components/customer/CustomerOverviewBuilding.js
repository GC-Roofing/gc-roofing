import {useAuth} from '../../AuthContext';
import CaspioDataTable from '../dataTable/CaspioDataTable';



export default function CustomerOverviewBuilding() {
    const {caspioTokens, getTokens} = useAuth(); // get access tokens

    const tableInfo = {
        url: 'https://c1acl820.caspio.com/rest/v2/tables/A1_Building_Information/records',
        caspioTokens: caspioTokens,
        getTokens: getTokens,
        title: 'Customer / Building Information',
        pk: 'Building_ID',
        labels: [
            {name:'Property Name', key:'Property_Name'},
            {name:'Building Range', key:'Building_Range'},
            {name:'Navigation Address', key:'Full_Buildin_Address'},
            {name:'Management Company', key:'Management_Company'},
            {name:'Entity Company', key:'Entity_Company'},
            {name:'Property ID', key:'Property_ID'},
        ]
    }

    return (
        <>
            <CaspioDataTable {...tableInfo} />
        </>
    );
}