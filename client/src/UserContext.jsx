import { createContext, useState } from "react";
export const UserContext = createContext({});
// eslint-disable-next-line react/prop-types
function UserContextProvider({children}) {    
    const [user,setUser] = useState(null);
    const [listUsers,setListUsers] = useState(null);
    const [amountUser,setAmountUser] = useState();
    const [amountMovie,setAmountMovie] = useState();
    const [userSubs,setUserSubs] = useState();
    const [alert,setAlert] = useState();
    const [buyVip,setBuyVip] = useState();

    return ( <UserContext.Provider value={{user,setUser,listUsers,setListUsers
                ,amountUser,setAmountUser,amountMovie,setAmountMovie,userSubs,
                setUserSubs,alert,setAlert,buyVip,setBuyVip}}>
        {children}
    </UserContext.Provider> );
}

export default UserContextProvider;