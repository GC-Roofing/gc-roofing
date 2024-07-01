import { useEffect, useState, useCallback } from 'react';
import { httpsCallable } from "firebase/functions";


import {functions} from '../../firebase';


import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import Select from '@mui/material/Select';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import CircularProgress from '@mui/material/CircularProgress';
import TableSortLabel from '@mui/material/TableSortLabel';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import Collapse from '@mui/material/Collapse';





export default function FirestoreDataTable({
        title, collectionNames, relations, labels,
        updateData=null, dataFunc=null,
        initialOrderObj=null, initialOrderDirection='asc', initialFilter=null, groupBy=[],
        padding='4%'
    }) {
    /*
        const tableInfo = {
            title: 'Stop Priority',
            collectionNames: collectionNames,
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
        }
    */
    const [info, setInfo] = useState([]);  // state for building info
    const [filteredLength, setFilteredLength] = useState(0);
    const [pageSize, setPageSize] = useState(25); // state for number of rows on a page
    const [pageNum, setPageNum] = useState(1); // state for page number
    const [orderObj, setOrderObj] = useState(initialOrderObj||labels[0].key); // state for order by //not being used
    const [loading, setLoading] = useState(true); // check if still loading
    const [anchorEl, setAnchorEl] = useState(null); // anchor menu
    const [selectedRecord, setSelectedRecord] = useState(null); // which record is selected for the menu
    const [orderDirection, setOrderDirection] = useState(initialOrderDirection); // order direction
    const [openDelete, setOpenDelete] = useState(false);
    const [openFilter, setOpenFilter] = useState(true);
    const [filterText, setFilterText] = useState(labels.reduce((o, v) => ({...o, [v.key]: (v.key===initialFilter?.key) ? initialFilter?.value : ''}), {}));
    const [debounced, setDebounced] = useState(false);

    // async function for filtering and sorting
    const getInfo = useCallback(async (pageNum, pageSize, orderObj, orderDirection, filterText) => {
        try {
            console.log('cool')
            const filterData = httpsCallable(functions, 'filterData');
            const result = await filterData({
                collections:collectionNames, 
                relations:relations,
                pageNum:pageNum, 
                pageSize:pageSize, 
                orderBy:orderObj, 
                orderDirection:orderDirection, 
                filter:filterText, 
                labels:labels,
            });
            const data = result.data;
            setInfo(data.data);
            setFilteredLength(data.length);
            updateData && updateData(info => data.data); // this is if someone wants to access the data in the table
            setLoading(false);
        } catch(e) {
            console.log(e.message);
        }
    }, [updateData, labels, collectionNames, relations])

    // delay when to actually run the function
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedInfo = useCallback(debounce(getInfo, 500), [getInfo])

    // update the viewed list page
    useEffect(() => {
        setLoading(true);
        if (debounced) {
            debouncedInfo(pageNum, pageSize, orderObj, orderDirection, filterText);
        } else {
            getInfo(pageNum, pageSize, orderObj, orderDirection, filterText);
        }
    }, [getInfo, debounced, debouncedInfo, pageNum, pageSize, orderObj, orderDirection, filterText])


    // handlers
    // change page size
    function handlePageSize({target}) {
        const size = parseInt(target.value, 10); // get the selected page size
        setPageSize(size); // set the page size
        setPageNum(1); // reset page num to beginning
        setDebounced(false);
    };

    // next page 
    function handleNextPage() {
        setPageNum(p => p+1) // change page number
        // setLoading(true); // set loading to true since loading
        setDebounced(false);
    }

    // prev page
    function handlePrevPage() {
        setPageNum(p => p-1) // change page number
        setDebounced(false);
    }

    // Open create assessmet menu
    function handleMenuOpen(event) {
        // stop propagation
        event.stopPropagation();
        // set menu anchor
        setAnchorEl(event.currentTarget);
        // set which assessment the menu should work with
        setSelectedRecord(event.currentTarget.dataset.recordId);
    }

    // Close create assessmet menu
    function handleMenuClose() {
        setAnchorEl(null);
    }

    // handle sort
    function handleTableSort({currentTarget}) {
        const ob = currentTarget.dataset.labelName;
        setOrderObj(ob);
        setOrderDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
        setPageNum(1);
        setDebounced(false);
    }

    // handle open delete
    function handleOpenDelete() {
        setOpenDelete(true);
    }

    // handle close delete
    function handleCloseDelete() {
        setOpenDelete(false);
    }

    // handle delete
    function handleDelete() {
        handleCloseDelete();
    }

    // handle toggle filter
    function handleToggleFilter() {
        setOpenFilter(d => !d);
    }

    // handle filter text change
    function handleFilterText({target}) {
        setFilterText(t => ({
            ...t,
            [target.name]:target.value,
        }))

        setPageNum(1);
        setDebounced(true);
        // setLoading(true);

    }

    return (
        <Box sx={{height:'100%', width:'100%', pt:padding, display:'flex', flexDirection:'column', overflow:'hidden'}}>
            <Box sx={{display:'flex', alignItems:'center'}}>
                <Typography variant='h5'>{title}</Typography>
                <IconButton onClick={handleToggleFilter} sx={{ml:1}}>
                    <FilterListRoundedIcon />
                </IconButton>
            </Box>
            {/* Filter */}
            <Box sx={{display:'flex'}}>
                <Collapse in={openFilter}>
                    <Box sx={{flexWrap:'wrap', justifyContent:'center', display:'flex'}}>
                        {labels.map((v, i) => (
                            v.hideSearch || 
                            <TextField
                                label={v.name}
                                key={i}
                                size='small'
                                name={v.key}
                                value={filterText[v.key]}
                                onChange={handleFilterText}
                                sx={{
                                    m:.5,
                                }}
                                />
                        ))}
                    </Box>
                </Collapse>
            </Box>
            <Box sx={{flexGrow:1, width:'100%', overflow:'hidden', display:'flex', flexDirection:'column'}}>
                {/* Table Container */}
                <TableContainer
                    sx={{
                        width: '100%',
                        height:'100%',
                        // flexGrow:1,
                    }} 
                    >
                    {/* Table */}
                    <Table stickyHeader size='small' aria-label="simple table">
                        {/* Column headers */}
                        <TableHead>
                            <TableRow>
                                {labels.map((v, i) => (
                                    (v.hideRender)
                                        ? null
                                        : <TableCell 
                                            key={i} 
                                            align={"left"} 
                                            sx={{
                                                fontWeight:'bold', fontSize:'.75rem',
                                                verticalAlign:'bottom',
                                                '&.MuiTableCell-head': {
                                                    // display:'flex',
                                                    // alignItems:'end'

                                                }
                                                // display:'flex', alignItems:'end'
                                                // width:`${100/labels.length}%`, // if i want to cause tables to not jerk so much
                                            }}
                                            >
                                            <TableSortLabel
                                                active={orderObj === v.key}
                                                direction={orderDirection}
                                                onClick={handleTableSort}
                                                data-label-name={v.key}
                                                sx={{
                                                    // textWrap:'nowrap',
                                                    '&.MuiTableSortLabel-root': {
                                                        textWrap:'wrap',
                                                    }
                                                }}
                                                >
                                                {v.name}
                                            </TableSortLabel>
                                        </TableCell>
                                ))}
                                <TableCell align="center">
                                    <IconButton onClick={handleToggleFilter}>
                                        <FilterListRoundedIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        {/* Body */}
                        <TableBody
                            // sx={{
                            //     opacity: (info) ? 1 : 0,
                            //     transition: 'opacity .25s ease-in'
                            // }}
                            >
                            {/* Rows */}
                            {/* Checking if building info is still loading */}
                            {(!loading)
                                ? info?.map((bi) => {
                                    let data = bi.data;
                                    return (
                                        <TableRow
                                            hover
                                            id={bi.id}
                                            key={bi.id}
                                            onClick={()=>null}
                                            // sx={{ cursor: 'pointer' }}
                                            >
                                            {labels.map((v, i) => {
                                                if (v.hideRender) return null;
                                                const renderFunc = (v?.renderer) ? v?.renderer : v?.converter;
                                                return <TableCell key={i} sx={{fontSize:'.75rem'}}>{renderFunc?.call(undefined,data[v.key])||data[v.key]}</TableCell>
                                            })}
                                            <TableCell align="center">
                                                <IconButton 
                                                    data-record-id={bi.id} 
                                                    size='small'
                                                    onClick={handleMenuOpen}
                                                    >
                                                    <MoreVertRoundedIcon fontSize='small' />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                        );
                                })
                                : // loading purposes
                                <TableRow>
                                    <TableCell align='center' colSpan={labels?.length} sx={{border:0}}>
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            }
                            {/* popup menu */}
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                                sx={{
                                    "& .MuiPaper-root": {
                                        boxShadow:3
                                    }
                                }}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                >
                                <MenuItem onClick={handleMenuClose}>Details</MenuItem>
                                <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
                                <MenuItem sx={{color:'error.main'}} onClick={handleOpenDelete}>Delete</MenuItem>
                            </Menu>
                            {/* Delete question dialog */}
                            <Dialog
                                open={openDelete}
                                onClose={handleCloseDelete}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                                >
                                <DialogTitle id="alert-dialog-title">
                                    Are you sure you want to delete this record?
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        Any records deleted will no longer be accessible. This is a permanent action. 
                                    </DialogContentText>
                                    <DialogContentText sx={{mt:'1rem', mx:'1rem'}}>
                                        Record: {selectedRecord}
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleCloseDelete}>Cancel</Button>
                                    <Button color='error' onClick={handleDelete} autoFocus>
                                        Delete
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </TableBody>
                    </Table>
                </TableContainer>
                {/* Pagination */}
                <Box sx={{display:'flex', alignItems:'center', justifyContent:'end', m:'.5%'}}>
                    {/* num items to see */}
                    <Typography variant='body' sx={{mr:2}}>Rows per page:</Typography>
                    <FormControl size="small" sx={{mr:2}}>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={pageSize}
                            // label="Rows per page"
                            onChange={handlePageSize}
                            >
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={25}>25</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                            <MenuItem value={100}>100</MenuItem>
                            <MenuItem value={200}>200</MenuItem>
                            <MenuItem value={500}>500</MenuItem>
                        </Select>
                    </FormControl>
                    {/* items being viewed */}
                    <Typography variant='body' sx={{mr:2}}>{(pageNum-1)*pageSize+Boolean(info?.length)}-{(pageNum-1)*pageSize+info?.length} of {filteredLength}</Typography>
                    {/* prev */}
                    <IconButton disabled={loading || pageNum===1} onClick={handlePrevPage}><KeyboardArrowLeftRoundedIcon /></IconButton>
                    {/* mext */}
                    <IconButton disabled={loading || info?.length<pageSize} onClick={handleNextPage}><KeyboardArrowRightRoundedIcon /></IconButton>
                </Box>
            </Box>
        </Box>
    );
}



// function descendingComparator(a, b, orderObj) {
//     const dataA = a.data;
//     const dataB = b.data;
//     if (dataB[orderObj] < dataA[orderObj]) {
//         return -1;
//     }
//     if (dataB[orderObj] > dataA[orderObj]) {
//         return 1;
//     }
//         return 0;
// }

// function getComparator(order, orderObj) {
//     // 1 is ascending
//     // 0 is descending
//     return order === 'asc'
//         ? (a, b) => -descendingComparator(a, b, orderObj)
//         : (a, b) => descendingComparator(a, b, orderObj);
// }


function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}




