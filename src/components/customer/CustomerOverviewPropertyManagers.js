import {useAuth} from '../../AuthContext';
import CaspioDataTable from '../dataTable/CaspioDataTable';



export default function CustomerOverviewPropertyManagers() {
    const {caspioTokens, getTokens} = useAuth(); // get access tokens

    const tableInfo = {
        url: 'https://c1acl820.caspio.com/rest/v2/tables/A2_Property_Managers/records',
        caspioTokens: caspioTokens,
        getTokens: getTokens,
        title: 'Property Management Companies',
        pk: 'Management_ID',
        labels: [
            {
                name:'Created', key:'Created_Date',
                converter: (v) => {
                    if (v) {
                        const date = new Date(v);
                        return (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear();
                    }
                },
                reverter: (v) => v.replaceAll('/', ' '),
            },
            {name:'ID', key:'Management_ID'},
            {name:'Company Name', key:'Management_Company'},
            {name:'Address', key:'Management_Address'},
            {name:'City', key:'Management_City'},
            {name:'State', key:'Management_State'},
            {name:'Zip', key:'Management_Zip'}
        ]
    }

    return (
        <>
            <CaspioDataTable {...tableInfo} />
        </>
    );
}