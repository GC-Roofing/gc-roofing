import FirestoreDataTable from '../dataTable/FirestoreDataTable';



export default function CustomerOverviewBuilding() {

    const tableInfo = {
        collectionName: 'A1_Building_Information',
        title: 'Customer / Building Information',
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
            <FirestoreDataTable {...tableInfo} />
        </>
    );
}