import FirestoreDataTable from '../dataTable/FirestoreDataTable';



export default function CusomterOverviewPropertyGroups() {

    const tableInfo = {
        collectionNames: ['A4_Property_IDs'],
        title: 'Property Groups & IDs',
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
            <FirestoreDataTable {...tableInfo} />
        </>
    );
}