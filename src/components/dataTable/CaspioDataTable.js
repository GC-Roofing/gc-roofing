import { useEffect, useState, useCallback } from 'react';

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





export default function CaspioDataTable({
        url, caspioTokens, getTokens, title, pk, 
        updateData,
        initialOrderBy, initialOrderDirection, initialFilter, 
        labels, padding='4%'
    }) {
    /*
        const tableInfo = {
            url: 'https://c1acl820.caspio.com/rest/v2/tables/C3_Contracts_Quote_Table_Request/records',
            caspioTokens: caspioTokens,
            getTokens: getTokens,
            title: 'Quote Requests',
            pk: 'Quote_ID',
            labels: [
                {name:'Assigned', key:'Assigned_Estimator'},
                {name:'Source', key:'Quote_Source'},
                {name:'Property Type', key:'Quote_Type'},
                {name:'Proposal Type', key:'Proposal_Type'},
                {name:'QO Date', key:'Todays_Date'},
                {name:'Quote ID', key:'Quote_ID'},
                {name:'Related WO', key:'Work_Order_Number_Related'},
                {name:'Property', key:'Property_Name'},
                {name:'Building Range', key:'Building_Range'},
                {
                    name:'Completed', key:'Quote_Completed', comparator:'=',
                    converter: (v) => v ? 'yes' : 'no', 
                    reverter: (v) => v === 'yes' ? 'true' : (v === 'no') ? 'false' : ''
                },
                {
                    name:'Closed', key:'Quote_Closed', comparator:'=',
                    converter: (v) => v ? 'yes' : 'no', 
                    reverter: (v) => v === 'yes' ? 'true' : (v === 'no') ? 'false' : 'fail'
                },
                {name:'Days Pending', key:'Pending_Days'},
            ]
        }
    */
    const [info, setInfo] = useState();  // state for building info
    const [pageSize, setPageSize] = useState(25); // state for number of rows on a page
    const [pageNum, setPageNum] = useState(1); // state for page number
    const [orderBy, setOrderBy] = useState(initialOrderBy||labels[0].key); // state for order by //not being used
    const [loading, setLoading] = useState(true); // check if still loading
    const [anchorEl, setAnchorEl] = useState(null); // anchor menu
    const [selectedRecord, setSelectedRecord] = useState(null); // which record is selected for the menu
    const [orderDirection, setOrderDirection] = useState(initialOrderDirection||'asc'); // order direction
    const [openDelete, setOpenDelete] = useState(false);
    const [openFilter, setOpenFilter] = useState(true);
    const [filterText, setFilterText] = useState(labels.reduce((o, v) => ({...o, [v.key]: (v.key===initialFilter?.key) ? initialFilter?.value : ''}), {}));
    const [debounced, setDebounced] = useState(false);


    // Callback functions
    // async function to get building info
    const getInfo = useCallback(async (pageNum, pageSize, orderBy, direction='asc', where={}) => {
        // identify correct operator
        function queryOperator(l, op, obj, v) {
            if (op === '=') {
                return ' = \'' + (l?.reverter?.call(undefined, obj[v])||obj[v]) + '\'';
            } else {
                return ' like \'%' + (l?.reverter?.call(undefined, obj[v].replace(/ /g, '% %'))||obj[v].replace(/ /g, '% %')) + '%\'';
            }
        }

        // create filter query string
        const stringWhere = encodeURIComponent(Object.keys(where).reduce((o, v, i, a) => {
            const l = labels.filter((l) => l.key === v)[0];
            let retV = '';
            if (where[v] !== '') {
                retV = v + queryOperator(l, l?.comparator||'like', where, v);
                retV = retV + (((a.length-1)!==i) ? ' AND ' : '');
            }


            return o + retV;
        }, '').slice(0, -5));


        let query = `?q.orderBy=${orderBy}%20${direction}&q.pageNumber=${pageNum}&q.pageSize=${pageSize}&q.where=${stringWhere}`; // query
        // and look at swagger ui for request url
        // get response
        const response = await fetch(url+query, {
            method:'GET',
            headers: {
                "Authorization": `Bearer ${caspioTokens?.access_token}`, // This is the important part, the auth header
                "Content-Type": 'application/json',
            },
        });

        if (response.status === 401 && caspioTokens) {
            getTokens();
            return;
        }
        console.log('cool')
        // get data
        const data = await response.json();
        setInfo(data.Result);// set building info
        updateData && updateData(data.Result);
        setLoading(false); // finish loading
    }, [caspioTokens, getTokens, url, labels]);

    // delay when to actually run the function
    // eslint-disable-next-line
    const debouncedGet = useCallback(debounce(getInfo, 500), [getInfo]);

    // update
    // Get the initial building info on load
    useEffect(() => {
        if (debounced) {
            debouncedGet(pageNum, pageSize, orderBy, orderDirection, filterText);
        } else {
            getInfo(pageNum, pageSize, orderBy, orderDirection, filterText);
        }
    }, [caspioTokens, pageNum, pageSize, orderBy, orderDirection, filterText, getInfo, debounced, debouncedGet]);



    // handlers
    // change page size
    function handlePageSize({target}) {
        const size = parseInt(target.value, 10); // get the selected page size
        setPageSize(size); // set the page size
        setPageNum(1); // reset page num to beginning
        setLoading(true); // set loading to true since loading
        setDebounced(false);
    };

    // next page 
    function handleNextPage() {
        setPageNum(p => p+1) // change page number
        setLoading(true); // set loading to true since loading
        setDebounced(false);
    }

    // prev page
    function handlePrevPage() {
        setPageNum(p => p-1) // change page number
        setLoading(true); // set loading to true since loading
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
        setOrderBy(ob);
        setOrderDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
        setPageNum(1);
        setLoading(true);
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
        setLoading(true);
        setInfo([])

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
                                    <TableCell 
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
                                            active={orderBy === v.key}
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
                                    // let data = bi.data();
                                    return (
                                        <TableRow
                                            hover
                                            id={bi[pk]}
                                            key={bi[pk]}
                                            onClick={()=>null}
                                            // sx={{ cursor: 'pointer' }}
                                            >
                                            {labels.map((v, i) => (
                                                <TableCell key={i} sx={{fontSize:'.75rem'}}>{v?.converter?.call(undefined,bi[v.key])||bi[v.key]}</TableCell>
                                            ))}
                                            <TableCell align="center">
                                                <IconButton 
                                                    data-record-id={bi[pk]} 
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
                            <MenuItem value={25}>25</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                            <MenuItem value={100}>100</MenuItem>
                        </Select>
                    </FormControl>
                    {/* items being viewed */}
                    <Typography variant='body' sx={{mr:2}}>{(pageNum-1)*pageSize+Boolean(info?.length)} - {(pageNum-1)*pageSize+info?.length}</Typography>
                    {/* prev */}
                    <IconButton disabled={loading || pageNum===1} onClick={handlePrevPage}><KeyboardArrowLeftRoundedIcon /></IconButton>
                    {/* mext */}
                    <IconButton disabled={loading || info?.length<pageSize} onClick={handleNextPage}><KeyboardArrowRightRoundedIcon /></IconButton>
                </Box>
            </Box>
        </Box>
    );
}



// function descendingComparator(a, b, orderBy) {
//     if (b[orderBy] < a[orderBy]) {
//         return -1;
//     }
//     if (b[orderBy] > a[orderBy]) {
//         return 1;
//     }
//         return 0;
// }

// function getComparator(order, orderBy) {
//     // 1 is ascending
//     // 0 is descending
//     return order
//         ? (a, b) => -descendingComparator(a, b, orderBy)
//         : (a, b) => descendingComparator(a, b, orderBy);
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




