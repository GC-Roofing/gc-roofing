import FirestoreDataTable from '../dataTable/FirestoreDataTable';



export default function CustomerOverviewEntityCompanies() {

    const tableInfo = {
        collectionName: 'A3_Entity_Information',
        title: 'Entity Companies',
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
            {name:'ID', key:'Entity_ID'},
            {name:'Type', key:'Entity_Type'},
            {name:'Company Name', key:'Entity_Company'},
            {name:'Entity Address', key:'Entity_Address'},
            {name:'Entity City', key:'Entity_City'},
            {name:'Entity State', key:'Entity_State'},
            {name:'Entity Zip', key:'Entity_Zip'},
            {name:'EIN', key:'Entity_EIN', hideSearch:true}
        ]
    }

    return (
        <>
            <FirestoreDataTable {...tableInfo} />
        </>
    );
}