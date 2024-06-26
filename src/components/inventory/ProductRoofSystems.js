import {useAuth} from '../../AuthContext';
import CaspioDataTable from '../dataTable/CaspioDataTable';



export default function ProductRoofSystems() {
    const {caspioTokens, getTokens} = useAuth(); // get access tokens


    const tableInfo = {
        url: 'https://c1acl820.caspio.com/rest/v2/tables/L2_Products_Table/records',
        caspioTokens: caspioTokens,
        getTokens: getTokens,
        title: 'Roof Systems',
        pk: 'roofsystemID',
        labels: [
            {name:'Product Name', key:'ProductName'},
            {name:'Roof System', key:'roofsystem'},
            {name:'Manufacturer', key:'manufacturer'},
            {name:'Material Warranty', key:'materialwarr', hideSearch:true},
            {name:'Labor Warranty', key:'laborwarr', hideSearch:true},
        ]
    }

    return (
        <>
            <CaspioDataTable {...tableInfo} />
        </>
    );
}