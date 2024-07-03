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
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';






export default function FirestoreDataTable({
        title, collectionNames, relations, labels, groupBy, initialGroupByOrder,
        updateData, dataFunc,
        initialOrderObj, initialOrderDirection, initialFilter,
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
    const [orderObj, setOrderObj] = useState(initialOrderObj||labels[groupBy?.length||0].key); // state for order by //not being used
    const [loading, setLoading] = useState(true); // check if still loading
    const [anchorEl, setAnchorEl] = useState(null); // anchor menu
    const [selectedRecord, setSelectedRecord] = useState(null); // which record is selected for the menu
    const [orderDirection, setOrderDirection] = useState(initialOrderDirection||'asc'); // order direction
    const [openDelete, setOpenDelete] = useState(false);
    const [openFilter, setOpenFilter] = useState(true);
    const [filterText, setFilterText] = useState(labels.reduce((o, v) => ({...o, [v.key]: (v.key===initialFilter?.key) ? initialFilter?.value : ''}), {}));
    const [debounced, setDebounced] = useState(false);
    const [groupByOrder, setGroupByOrder] = useState(initialGroupByOrder||(groupBy && Array(groupBy.length).fill('desc'))||[orderDirection]);

    // async function for filtering and sorting
    const getInfo = useCallback(async (collectionNames, relations, pageNum, pageSize, orderObj, orderDirection, filterText, labels, groupBy, groupByOrder, dataFunc) => {
        try {
            // get callable function and data
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
                groupBy:groupBy,
                groupByOrder:groupByOrder,
                dataFunc:dataFunc?.toString(),
            });
            const data = result.data; // result.data is because it is the data of the results
            setInfo(data.data); // data.data is because i have an object {data: obj, length: num}
            setFilteredLength(data.length); // set the total length
            updateData && updateData(info => data.data); // this is if someone wants to access the data in the table
            setLoading(false);
        } catch(e) {
            console.log(e.message);
        }
    }, [updateData])

    // delay when to actually run the function
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedInfo = useCallback(debounce(getInfo, 500), [getInfo])

    // update the viewed list page
    useEffect(() => {
        setLoading(true);
        if (debounced) {
            debouncedInfo(collectionNames, relations, pageNum, pageSize, orderObj, orderDirection, filterText, labels, groupBy, groupByOrder, dataFunc);
        } else {
            getInfo(collectionNames, relations, pageNum, pageSize, orderObj, orderDirection, filterText, labels, groupBy, groupByOrder, dataFunc);
        }
    }, [getInfo, debounced, debouncedInfo, collectionNames, relations, pageNum, pageSize, orderObj, orderDirection, filterText, labels, groupBy, groupByOrder, dataFunc])


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
        if (groupBy?.includes(ob)) {
            const groupByIndex = groupBy.indexOf(ob);
            setGroupByOrder((d) => {
                const newOrder = [...d]
                newOrder[groupByIndex] = newOrder[groupByIndex] === 'asc' ? 'desc' : 'asc';
                return newOrder;
            });
        } else {
            setOrderObj(ob);
            setOrderDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
        }
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

    // rendering calcs
    const endSize = ((pageNum)*pageSize < filteredLength)
        ? (pageNum)*pageSize
        : filteredLength;

    return (
        <Box sx={{height:'100%', width:'100%', pt:padding, display:'flex', flexDirection:'column', overflow:'hidden'}}>
            {/* Title */}
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
                    }} 
                    >
                    {/* Table */}
                    <Table stickyHeader size='small' aria-label="simple table">
                        {/* Column headers */}
                        <TableHead>
                            <TableRow>
                                {/* checks if I need to pad for group by */}
                                {groupBy && 
                                    <TableCell sx={{fontSize:'.75rem'}}>
                                        <Box sx={{display:'flex', alignItems:'center', height:'100%'}}>
                                            <KeyboardArrowUpIcon sx={{visibility:'hidden'}} />
                                        </Box>
                                    </TableCell>
                                }
                                {/* Headers Labels*/}
                                {labels.map((v, i) => (
                                    (v.hideRender)
                                        ? null
                                        : <TableCell 
                                            key={i} 
                                            align={"left"} 
                                            sx={{
                                                fontWeight:'bold', fontSize:'.75rem',
                                                verticalAlign:'bottom',
                                                color:'darkRed.main',
                                            }}
                                            >
                                            <TableSortLabel
                                                active={orderObj === v.key || groupBy?.includes(v.key)}
                                                direction={(groupBy?.includes(v.key)) ? groupByOrder?.at(groupBy.indexOf(v.key)) : orderDirection}
                                                onClick={handleTableSort}
                                                data-label-name={v.key}
                                                sx={{
                                                    '&.MuiTableSortLabel-root': {
                                                        textWrap:'wrap',
                                                        color:'darkRed.main',
                                                        
                                                    },
                                                    '& .MuiTableSortLabel-icon': {
                                                        color:'text.primary',
                                                    },
                                                    '&.Mui-active': {
                                                        '& .MuiTableSortLabel-icon': {
                                                            color: (groupBy?.includes(v.key)) ? 'darkRed.dark' : '',
                                                        }
                                                    },
                                                }}
                                                >
                                                {v.name}
                                            </TableSortLabel>
                                        </TableCell>
                                ))}
                                {/* Filter button */}
                                <TableCell align="center">
                                    <IconButton onClick={handleToggleFilter}>
                                        <FilterListRoundedIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        {/* Body */}
                        <TableBody>
                            {/* Rows */}
                            {/* Checking if building info is still loading */}
                            {(!loading && !groupBy) &&
                                info?.map((bi) => {
                                    let data = bi.data;
                                    return (
                                        <TableRow
                                            hover
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
                            }
                            {/* Checks if group by formmating to be applied */}
                            {(!loading && groupBy) &&
                                info?.map((group, i) => {
                                    return (
                                        <CollapsibleRowRecursion key={i} group={group} labels={labels} handleMenuOpen={handleMenuOpen} />
                                    );
                                })
                            }
                            {/* Loading */}
                            {(loading) &&
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
                    <Typography variant='body' sx={{mr:2}}>{(pageNum-1)*pageSize+Boolean(info?.length)}-{endSize} of {filteredLength}</Typography>
                    {/* prev */}
                    <IconButton disabled={loading || pageNum===1} onClick={handlePrevPage}><KeyboardArrowLeftRoundedIcon /></IconButton>
                    {/* mext */}
                    <IconButton disabled={loading || endSize===filteredLength} onClick={handleNextPage}><KeyboardArrowRightRoundedIcon /></IconButton>
                </Box>
            </Box>
        </Box>
    );
}



// 


function CollapsibleRowRecursion({priorOpen=true, group, labels, handleMenuOpen, value=0}) {
    const [open, setOpen] = useState(true);
    if (!group.group) {
        let data = group;
        return (
            <TableRow
                hover
                key={data.id}
                onClick={()=>null}
                sx={{ 
                    animation: 'fadeInAnimation ease .5s',
                    "@keyframes fadeInAnimation": {
                        '0%': {
                            opacity: 0,
                        },
                        '100%': {
                            opacity: 1,
                        },
                    },
                    display:priorOpen ? 'auto' : 'none',
                }}
                >
                {/* cells */}
                {[...Array(value-1||1).keys()].map((v, i) => (
                    <TableCell
                        key={i}
                        sx={{
                            '&.MuiTableCell-root': {
                                bgcolor:'background.paper',
                                border: 0
                            }
                        }}
                    />
                ))}
                {labels.map((v, i) => {
                    if (v.hideRender || i<value-2) return null;
                    const renderFunc = (v?.renderer) ? v?.renderer : v?.converter;
                    return <TableCell key={i} sx={{fontSize:'.75rem'}}>{renderFunc?.call(undefined,data.data[v.key])||data.data[v.key]}</TableCell>
                })}
                {/* menu */}
                <TableCell align="center">
                    <IconButton 
                        data-record-id={data.id} 
                        size='small'
                        onClick={handleMenuOpen}
                        >
                        <MoreVertRoundedIcon fontSize='small' />
                    </IconButton>
                </TableCell>
            </TableRow>
        );
    }

    const label = labels.filter(v => v.key===group.category)[0];
    const renderHead = (label?.renderer) ? label?.renderer : label?.converter;
    return (
        <>  
            {/* Group By row */}
            <TableRow
                hover
                onClick={()=>setOpen(p=>!p)}
                selected={open}
                sx={{ 
                    cursor: 'pointer',
                    bgcolor:'offGrey.light',
                    '&.Mui-selected': {
                        bgcolor:'offGrey.light',
                    },
                    '&.MuiTableRow-hover': {
                        '&:hover': {
                            bgcolor:'offGrey.dark',
                        }
                    },
                    animation: 'fadeInAnimation ease .5s',
                    "@keyframes fadeInAnimation": {
                        '0%': {
                            opacity: 0,
                        },
                        '100%': {
                            opacity: 1,
                        },
                    },
                    display:priorOpen ? 'auto' : 'none',
                }}
                >
                {/* Arrow */}
                {[...Array(value).keys()].map((v, i) => (
                    <TableCell
                        key={i}
                        sx={{
                            '&.MuiTableCell-root': {
                                bgcolor:'background.paper',
                                border: 0
                            }
                        }}
                    />
                ))}
                <TableCell sx={{fontSize:'.75rem'}}>
                    <Box sx={{display:'flex', alignItems:'center', height:'100%'}}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </Box>
                </TableCell>
                {/* Group By Value */}
                <TableCell sx={{fontSize:'.75rem'}}>
                    {renderHead?.call(undefined,group.key)||group.key||'N/A'}
                </TableCell>
                {/* padding */}
                <TableCell colSpan={labels?.length-value} />
            </TableRow>
            {/* Rows to be displayed */}
            {group?.value?.map((group, i) => {
                return (
                    <CollapsibleRowRecursion key={i} priorOpen={open&&priorOpen} group={group} labels={labels} handleMenuOpen={handleMenuOpen} value={value+1} />
                );
            })}
        </>
    );
}






function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
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

// function CollapsibleRow({group, labels, handleMenuOpen}) {
//     const [open, setOpen] = useState(true);
//     const label = labels.filter(v => v.key===group.category)[0];
//     const renderHead = (label?.renderer) ? label?.renderer : label?.converter;
//     return (
//         <>  
//             {/* Group By row */}
//             <TableRow
//                 hover
//                 onClick={()=>setOpen(p=>!p)}
//                 selected={open}
//                 sx={{ 
//                     cursor: 'pointer',
//                     bgcolor:'offGrey.light',
//                     '&.Mui-selected': {
//                         bgcolor:'offGrey.light',
//                     },
//                     '&.MuiTableRow-hover': {
//                         '&:hover': {
//                             bgcolor:'offGrey.dark',
//                         }
//                     }
//                 }}
//                 >
//                 {/* Arrow */}
//                 <TableCell sx={{fontSize:'.75rem'}}>
//                     <Box sx={{display:'flex', alignItems:'center', height:'100%'}}>
//                         {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
//                     </Box>
//                 </TableCell>
//                 {/* Group By Value */}
//                 <TableCell sx={{fontSize:'.75rem'}}>
//                     {renderHead?.call(undefined,group.key)||group.key||'N/A'}
//                 </TableCell>
//                 {/* padding */}
//                 <TableCell colSpan={labels?.length} />
//             </TableRow>
//             {/* Rows to be displayed */}
//             {open && group?.value?.map((bi) => {
//                 let data = bi.data;
//                 return (
//                     <TableRow
//                         hover
//                         key={bi.id}
//                         onClick={()=>null}
//                         sx={{ 
//                             animation: 'fadeInAnimation ease 1s',
//                             "@keyframes fadeInAnimation": {
//                                 '0%': {
//                                     opacity: 0,
//                                 },
//                                 '100%': {
//                                     opacity: 1,
//                                 },
//                             },
//                         }}
//                         >
//                         {/* arrow */}
//                         <TableCell sx={{fontSize:'.75rem'}}>
//                             <Box sx={{display:'flex', alignItems:'center', height:'100%'}}>
//                                 <KeyboardArrowUpIcon sx={{visibility:'hidden'}} />
//                             </Box>
//                         </TableCell>
//                         {/* cells */}
//                         {labels.map((v, i) => {
//                             if (v.hideRender) return null;
//                             const renderFunc = (v?.renderer) ? v?.renderer : v?.converter;
//                             return <TableCell key={i} sx={{fontSize:'.75rem'}}>{renderFunc?.call(undefined,data[v.key])||data[v.key]}</TableCell>
//                         })}
//                         {/* menu */}
//                         <TableCell align="center">
//                             <IconButton 
//                                 data-record-id={bi.id} 
//                                 size='small'
//                                 onClick={handleMenuOpen}
//                                 >
//                                 <MoreVertRoundedIcon fontSize='small' />
//                             </IconButton>
//                         </TableCell>
//                     </TableRow>
//                     );
//             })}
//         </>
//     );
// }



