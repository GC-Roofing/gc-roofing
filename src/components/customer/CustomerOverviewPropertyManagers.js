import FirestoreDataTable from '../dataTable/FirestoreDataTable';



export default function CustomerOverviewPropertyManagers() {

    const tableInfo = {
        collectionName: 'A2_Property_Managers',
        title: 'Property Management Companies',
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
            <FirestoreDataTable {...tableInfo} />
        </>
    );
}