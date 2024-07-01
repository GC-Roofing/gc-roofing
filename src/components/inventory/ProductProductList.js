import FirestoreDataTable from '../dataTable/FirestoreDataTable';

import Button from '@mui/material/Button';


export default function ProductProductList() {

    const ButtonLink = ({children, href}) => (
        <Button 
            size='small' 
            sx={{textWrap:'wrap', display:href ? 'inline-block' : 'none', minWidth:0}} 
            href={href} 
            target = "_blank" 
            rel = "noopener noreferrer"
            >
            {children}
        </Button>
    );

    const tableInfo = {
        collectionNames: ['I1_Manufacturer_Product_List'],
        title: 'Product List',
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
            <FirestoreDataTable {...tableInfo} />
        </>
    );
}