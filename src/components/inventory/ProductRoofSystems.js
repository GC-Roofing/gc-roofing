import {useAuth} from '../../AuthContext';
import CaspioDataTable from '../dataTable/CaspioDataTable';

import Button from '@mui/material/Button';


export default function ProductRoofSystems() {
    const {caspioTokens, getTokens} = useAuth(); // get access tokens

    const ButtonLink = ({children, href}) => <Button size='small' sx={{textWrap:'wrap', display:href ? 'inline-block' : 'none', minWidth:0}} href={href}>{children}</Button>;

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