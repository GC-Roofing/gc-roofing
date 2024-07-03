import {useCallback} from 'react';

import FirestoreDataTable from '../dataTable/FirestoreDataTable';


export default function Home() {


    const dataFunc = useCallback((data) => {
        const today = (new Date()).toISOString().slice(0, 10);
        const copyData = data.filter(v => v.data.End_Date >= today);
        const returnData = [];

        for (let data of copyData) {
            let currDate = new Date(data.data.Start_Date);
            let endDate = new Date(data.data.End_Date);

            while (currDate <= endDate) {
                returnData.push({
                    id: data.id, 
                    data: {
                        ...data.data,
                        Start_Date: currDate.toISOString().slice(0,-1), // to remove the Z which is univeral time
                    },
                });

                currDate.setDate(currDate.getDate() + 1);
            }
        }

        return returnData.filter(v => v.data.Start_Date >= today);
    }, []);

    // state
    const tableInfo = {
        title: 'Stop Priority',
        collectionNames: ['WO2_Work_Order_Calendar'],
        groupBy: ['Start_Date'],
        initialGroupByOrder: ['asc'],
        labels: [
            {
                name:'Date', key:'Start_Date',
                converter: (v) => {
                    if (v) {
                        const date = new Date(v);
                        return (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear();
                    }
                },
                reverter: (v) => v.replaceAll('/', ' '),
            },
            {name:'End Date', key:'End_Date', hideRender:true, hideSearch:true},
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
            <FirestoreDataTable {...tableInfo} dataFunc={dataFunc} />
        </>
    );
}

















