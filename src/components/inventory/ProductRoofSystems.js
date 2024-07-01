import FirestoreDataTable from '../dataTable/FirestoreDataTable';



export default function ProductRoofSystems() {


    const tableInfo = {
        collectionNames: ['L2_Products_Table'],
        title: 'Roof Systems',
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
            <FirestoreDataTable {...tableInfo} />
        </>
    );
}