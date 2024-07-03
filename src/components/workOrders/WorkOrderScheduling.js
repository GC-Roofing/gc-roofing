import FirestoreDataTable from '../dataTable/FirestoreDataTable';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';


export default function WorkOrderScheduling({updateData}) {

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
        collectionNames: ['WO1_Work_Order_Details'],
        title: 'Entity Companies',
        updateData: updateData,
        initialOrderBy: 'Status',
        initialOrderDirection: 'desc',
        initialFilter: {key:'Status', value:'New'},
        labels: [
            {name:'Status', key:'Status'},
            {name:'Job Type', key:'Job_Type'},
            {name:'Lead Tech', key:'Roof_Tech_Assigned_1'},
            {name:'Management', key:'Management_Company' },
            {name:'Entity', key:'Entity_Company'},
            {name:'Property Name', key:'Property_Name'},
            {name:'Building Range', key:'Building_Range'},
            {name:'Navigation', key:'Building_Address', hideSearch:true },
            {name:'City', key:'Building_City', hideSearch:true },
            {
                name:'Start Date', key:'Start_Date',
                converter: (v) => {
                    if (v) {
                        const date = new Date(v.slice(0,-1));
                        return (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear();
                    }
                },
                reverter: (v) => v.replaceAll('/', ' '),
            },
            {name:'Work Order #', key:'WO_Number'},
            {name:'Contract ID', key:'Contract_ID'},
            {
                name:'CompanyCam', key:'CompanyCam_Project_Link', hideSearch:true,
                renderer:(v) => <ButtonLink href={v}>Link</ButtonLink>,
            },
            {
                name:'Dropbox', key:'WO_Folder', hideSearch:true,
                renderer:(v) => <ButtonLink href={v}>Link</ButtonLink>,
            },
            {name:'Coordinates', key:'coordinates', hideSearch:true, hideRender:true}
        ]
    }

    return (
        <>
            <Box sx={{mx:'1%', overflow:'scroll', height:'100%'}}>
                <FirestoreDataTable {...tableInfo} />
            </Box>
        </>
    );
}