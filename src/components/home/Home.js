
import FirestoreDataTable from '../dataTable/FirestoreDataTable';


export default function Home() {

    // state
    const tableInfo = {
        title: 'Stop Priority',
        collectionNames: ['WO2_Work_Order_Calendar'],
        groupBy: ['Start_Date'],
        groupByOrder: ['desc'],
        labels: [
            {
                name:'Start Date', key:'Start_Date',
                converter: (v) => {
                    if (v) {
                        const date = new Date(v);
                        return (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear();
                    }
                },
                reverter: (v) => v.replaceAll('/', ' '),
            },
            {name:'Lead Tech', key:'Roof_Tech_Assigned_1'},
            {name:'Stop #', key:'Stop_Priority'},
            {name:'WO Number', key:'WO_Number'},
            {name:'Job Type', key:'Job_Type'},
            {name:'Management Company', key:'Management_Name'},
            {name:'Property Name', key:'Property_Name'},
            {name:'Building Range', key:'Building_Range'},
            {name:'Navigation Address', key:'Full_Address'},
            {name:'Labor Hours', key:'Est_Labor_hours'},
            {name:'Status', key:'Status'},
        ]
    };

    return (
        <>
            <FirestoreDataTable {...tableInfo} />
        </>
    );
}

















