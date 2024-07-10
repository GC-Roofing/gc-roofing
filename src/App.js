import './App.css';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {APIProvider} from '@vis.gl/react-google-maps';


import AuthContext from './AuthContext';
import Login from './components/login/Login';
// import CreateAccount from './components/login/CreateAccount';
import Home from './components/home/Home';
import HomeSidebar from './components/home/HomeSidebar';
import InternalNavbar from './components/home/InternalNavbar';
import CustomerSidebar from './components/customer/CustomerSidebar';
import CustomerOverviewBuilding from './components/customer/CustomerOverviewBuilding';
import QuotesContractsSidebar from './components/customer/QuotesContractsSidebar';
import CustomerOverviewPropertyManagers from './components/customer/CustomerOverviewPropertyManagers';
import CustomerOverviewEntityCompanies from './components/customer/CustomerOverviewEntityCompanies';
import CusomterOverviewPropertyGroups from './components/customer/CusomterOverviewPropertyGroups';
import QuotesContractsQuoteRequests from './components/customer/QuotesContractsQuoteRequests';
import QuotesContractsQuotesProposals from './components/customer/QuotesContractsQuotesProposals';
import QuotesContractsContracts from './components/customer/QuotesContractsContracts';
import HistoricalWarranties from './components/customer/HistoricalWarranties';
import QuotesContractsCreateQuote from './components/customer/QuotesContractsCreateQuote';
import QuotesContractsInputEstimate from './components/customer/QuotesContractsInputEstimate';
import WorkOrderSchedulingMap from './components/workOrders/WorkOrderSchedulingMap';
import WorkOrderOverview from './components/workOrders/WorkOrderOverview';
import InvoicingSidebar from './components/workOrders/InvoicingSidebar';
import WorkOrderInvoicingLeakRepair from './components/workOrders/WorkOrderInvoicingLeakRepair';
import WorkOrderInvoicingContractExtensiveRepair from './components/workOrders/WorkOrderInvoicingContractExtensiveRepair';
import ProductsSidebar from './components/inventory/ProductsSidebar';
import OrderHistorySidebar from './components/inventory/OrderHistorySidebar';
import ProductProductList from './components/inventory/ProductProductList';
import ProductRoofSystems from './components/inventory/ProductRoofSystems';
import OrderHistoryNewOrder from './components/inventory/OrderHistoryNewOrder';
import OverviewSidebar from './components/pvm/OverviewSidebar';
import TransferCaspioData from './components/dataTable/TransferCaspioData';
import BatchUpdates from './components/dataTable/BatchUpdates';
import FormSidebar from './components/forms/FormSidebar';
import BuildingForm from './components/forms/BuildingForm';
import PropertyForm from './components/forms/PropertyForm';
import EntityForm from './components/forms/EntityForm';
import TenantForm from './components/forms/TenantForm';
import ManagementForm from './components/forms/ManagementForm';




function App() {

    const router = createBrowserRouter([
        {
            path:'',
            element: <Navigate replace to='/login' />,
        },
        {
            path: "/login",
            loader: () => document.title = 'Login',
            element: <Login />
        },
        // {
        //     path: "/create-account",
        //     element: <CreateAccount />
        // },
        {
            path: "/internal",
            element: <AuthContext />,
            loader: () => document.title = 'Internal',
            children: [
                {
                    path:'',
                    element: <InternalNavbar />,
                    children: [
                        {
                            index:true,
                            element: <Navigate replace to='home' />,
                        },
                        {
                            path:'home',
                            element: <HomeSidebar />,
                            loader: () => document.title = 'Home',
                            children: [
                                {
                                    index: true,
                                    element: <Home />
                                }
                            ]
                        },
                        {
                            path:'customers',
                            element: <Outlet />,
                            loader: () => document.title = 'Customers',
                            children: [
                                {
                                    index:true,
                                    element: <Navigate replace to='overview' />
                                },
                                {
                                    path:'overview',
                                    element: <CustomerSidebar />,
                                    children: [
                                        {
                                            index: true,
                                            element: <Navigate replace to='building' />,
                                        },
                                        {
                                            path:'building',
                                            element: <CustomerOverviewBuilding />,
                                        },
                                        {
                                            path:'property-managers',
                                            element: <CustomerOverviewPropertyManagers />,
                                        },
                                        {
                                            path:'entity-companies',
                                            element: <CustomerOverviewEntityCompanies />,
                                        },
                                        {
                                            path:'property-groups',
                                            element: <CusomterOverviewPropertyGroups />,
                                        },
                                    ]
                                },
                                {
                                    path:'quotes-contracts',
                                    element:<QuotesContractsSidebar />,
                                    children: [
                                        {
                                            index: true,
                                            element: <Navigate replace to='dashboard' />,
                                        },
                                        {
                                            path: 'dashboard',
                                            element: <div>dashboard</div>
                                        },
                                        {
                                            path: 'create-quote',
                                            element: <QuotesContractsCreateQuote />
                                        },
                                        {
                                            path: 'quote-requests',
                                            element: <QuotesContractsQuoteRequests />
                                        },
                                        {
                                            path: 'input-estimate',
                                            element: <QuotesContractsInputEstimate />
                                        },
                                        {
                                            path: 'proposals',
                                            element: <QuotesContractsQuotesProposals />
                                        },
                                        {
                                            path: 'contracts',
                                            element: <QuotesContractsContracts />
                                        },
                                    ]
                                },
                                {
                                    path:'historical-warranties',
                                    element: <HistoricalWarranties />,
                                },
                                
                            ]
                        },
                        {
                            path:'work-orders',
                            element: <Outlet />,
                            loader: () => document.title = 'Work Orders',
                            children: [
                                {
                                    index:true,
                                    element: <Navigate replace to='overview' />
                                },
                                {
                                    path:'overview',
                                    element:<WorkOrderOverview />,
                                },
                                {
                                    path:'scheduling',
                                    element:<WorkOrderSchedulingMap />,
                                },
                                {
                                    path:'invoicing',
                                    element:<InvoicingSidebar />,
                                    children: [
                                        {
                                            index: true,
                                            element: <Navigate replace to='leak-repair' />,
                                        },
                                        {
                                            path:'leak-repair',
                                            element:<WorkOrderInvoicingLeakRepair />,
                                        },
                                        {
                                            path:'contract-extensive',
                                            element:<WorkOrderInvoicingContractExtensiveRepair />,
                                        },
                                    ]
                                },
                                {
                                    path:'wo-companycam-status',
                                    element:'wo-companycam-status',
                                },
                                {
                                    path:'wo-property-management-portal',
                                    element:'wo-property-management-portal',
                                },
                            ]
                        },
                        {
                            path:'pvm',
                            element:<Outlet />,
                            loader: () => document.title = 'PVM',
                            children: [
                                {
                                    index:true,
                                    element: <Navigate replace to='overview' />
                                },
                                {
                                    path:'overview',
                                    element:<OverviewSidebar />,
                                    children: [
                                        {
                                            path:'proposals',
                                            element:'proposals',
                                        },
                                        {
                                            path:'contracts',
                                            element:'contracts',
                                        },
                                    ]
                                },
                                {
                                    path:'annual-contracts',
                                    element:'annual-contracts'
                                },
                                {
                                    path:'proposal-comparison',
                                    element:'proposal-comparison',
                                },
                                {
                                    path:'job-costing-by-contract-id',
                                    element:'job-costing-by-contract-id',
                                },
                                {
                                    path:'completion-report',
                                    element:'completion-report',
                                },
                                {
                                    path:'lead-roof-tech-aid',
                                    element:'lead-roof-tech-aid',
                                },
                                {
                                    path:'tutorials',
                                    element:'tutorials',
                                },
                            ]
                        },
                        {
                            path:'inventory',
                            element: <Outlet />,
                            loader: () => document.title = 'Inventory',
                            children:[
                                {
                                    index:true,
                                    element: <Navigate replace to='products' />
                                },
                                {
                                    path:'products',
                                    element:<ProductsSidebar />,
                                    children:[
                                        {
                                            index:true,
                                            element:<Navigate replace to='product-list' />
                                        },
                                        {
                                            path:'product-list',
                                            element:<ProductProductList />
                                        },
                                        {
                                            path:'product-used',
                                            element:'product-used'
                                        },
                                        {
                                            path:'roof-systems',
                                            element:<ProductRoofSystems />,
                                        },
                                    ]
                                },
                                {
                                    path:'order-history',
                                    element:<OrderHistorySidebar />,
                                    children: [
                                        {
                                            index:true,
                                            element:<Navigate replace to='order-history' />
                                        },
                                        {
                                            path:'order-history',
                                            element:'order-history',
                                        },
                                        {
                                            path:'new-order',
                                            element:<OrderHistoryNewOrder />,
                                        }
                                    ]
                                }
                                
                            ]
                        },
                        {
                            path:'admin',
                            element:'admin',
                            loader: () => document.title = 'Admin',
                        },
                        {
                            path:'forms',
                            element: <FormSidebar />,
                            loader: () => document.title = 'Forms',
                            children:[
                                {
                                    index:true,
                                    element:<Navigate replace to='select-form' />
                                },
                                {
                                    path:'select-form',
                                    element:<div />
                                },
                                {
                                    path:'property',
                                    element:<PropertyForm />
                                },
                                {
                                    path:'building',
                                    element:<BuildingForm />
                                },
                                {
                                    path:'entity',
                                    element:<EntityForm />
                                },
                                {
                                    path:'tenant',
                                    element:<TenantForm />
                                },
                                {
                                    path:'management',
                                    element:<ManagementForm />
                                },
                            ]
                        },
                        {
                            path:'transfer314',
                            element: <TransferCaspioData />,
                            loader: () => document.title = 'Transfer',
                        },
                        {
                            path:'update314',
                            element: <BatchUpdates />,
                            loader: () => document.title = 'Update',
                        },
                    ]
                },
            ]
        }
    ]);

    let theme = createTheme();

    theme = createTheme(theme, {
        palette: {
            red: theme.palette.augmentColor({
                color: {
                    main: '#FC1515',
                },
                name:'red',
            }),
            darkRed: theme.palette.augmentColor({
                color: {
                    main: '#D60000',
                },
                name:'red',
            }),
            white: {
                main: '#FFFFFF',
            },
            offGrey: theme.palette.augmentColor({
                color: {
                    main: '#D3D3D3'
                },
                name:'red',
            }),
        },
    });


    return (
        <>
            <CssBaseline />
            <ThemeProvider theme={theme}>
                <APIProvider apiKey={'AIzaSyD_uVKlMkmGj4HIbA3cg6f4uKcv3R9pCos'}>
                    <RouterProvider router={router} />
                </APIProvider>
            </ThemeProvider>
        </>
    );
}

export default App;









