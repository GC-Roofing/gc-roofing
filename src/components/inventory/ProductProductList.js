import {useAuth} from '../../AuthContext';
import CaspioDataTable from '../dataTable/CaspioDataTable';

import Button from '@mui/material/Button';


export default function ProductProductList() {
    const {caspioTokens, getTokens} = useAuth(); // get access tokens

    const ButtonLink = ({children, href}) => <Button size='small' sx={{textWrap:'wrap', display:href ? 'inline-block' : 'none', minWidth:0}} href={href}>{children}</Button>;

    const tableInfo = {
        url: 'https://c1acl820.caspio.com/rest/v2/tables/I1_Manufacturer_Product_List/records',
        caspioTokens: caspioTokens,
        getTokens: getTokens,
        title: 'Product List',
        pk: 'House_SKU',
        labels: [
            {name:'MPN', key:'Product_SKU'},
            {name:'Preferred Vendor', key:'Preferred_Vendor'},
            {name:'Manufacturer', key:'Manufacturer'},
            {name:'Category', key:'Category'},
            {name:'Item', key:'Item'},
            {name:'Qty', key:'Qty'},
            {name:'U/M', key:'Units_of_Measure'},
            {
                name:'Manufacture Product Details', key:'Manufacture_Product_Details',
                converter:(v) => <ButtonLink href={v}>View</ButtonLink>,
            },
            {
                name:'Cost', key:'Cost',
                converter:(v) => Number(v).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
            },
            {
                name:'Cost Per', key:'Cost_Per', hideSearch:true,
                converter:(v) => Number(v).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
            },
            {
                name:'Sale Price', key:'Sale_Price', hideSearch:true,
                converter:(v) => Number(v).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
            },
            {
                name:'Sale Price Per', key:'Sale_Price_Per', hideSearch:true,
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