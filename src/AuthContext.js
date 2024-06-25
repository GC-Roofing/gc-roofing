import { createContext, useState, useContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";

import {auth} from './firebase';



// Context
const Context = createContext();

export default function AuthContext({children}) {
    // initialize
    const navigate = useNavigate();

    // state
    const [user, setUser] = useState(null);
    const [caspioTokens, setCaspioTokens] = useState(null);

    // get tokens for caspio access
    async function getTokens() {
        const url = 'https://c1acl820.caspio.com/oauth/token';
        const clientId = 'aff40c25374b4b75cb6a856f5b454d30135c74c3e87350d098';
        const clientSecret = '605c8813df2c49ccb506330467e8de7d1415749f6b8816768b';

        const response = await fetch(url, {
            method: 'POST',
            body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
        });

        const data = await response.json();    
        setCaspioTokens(data);
        return data && 'success';
    }

    // update and login
    useEffect(() => {
        // log user in if possible
        onAuthStateChanged(auth, (u) => {
            if (u) {
                setUser(u);
                getTokens();
            } else {
                navigate('/login');
            }
        });
    }, [navigate]);

    return (
        <Context.Provider value={{user, setUser, caspioTokens, getTokens}} >
            <Outlet />
        </Context.Provider>
    );
}

// hook to get authenticated user
export function useAuth() {
    return useContext(Context);
}