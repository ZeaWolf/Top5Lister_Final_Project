import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { Typography } from '@mui/material'
import  AuthContext  from '../auth'
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';

/*
    Our Status bar React component goes at the bottom of our UI.
    
    @author McKilla Gorilla
*/
function Statusbar() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    let text ="Your Lists";
    let addButton = 
        <IconButton
            disabled = {store.currentList|| auth.currentScreen !== "homeScreen"}
            id = "add-list-button"
            size = "large"
            onClick = {handleCreateNewList}
        >
            <AddIcon fontSize="large" style={(store.currentList)? {color:"gray"} : {color: "black"}}/>
        </IconButton>;

    if (auth.currentScreen !== "homeScreen"){
        if(store.searchCriteria !== ""){
            text = store.searchCriteria + " Lists";
        }
        else{
            if(auth.currentScreen === "allListScreen"){
                text = "All Lists"
            }
            if(auth.currentScreen === "userScreen"){
                text = "User Lists"
            }
        }
        addButton = "";
    }

    if (auth.currentScreen === "communityScreen"){
        text = "Community Lists";
    }

    function handleCreateNewList() {
        store.createNewList();
    }

    return (
        <div id="top5-statusbar"> 
        {addButton}
        <Typography variant="h4" style={(store.currentList)? {color:"gray"} : {color:"black"}}>{text}</Typography> 
        </div>
    );
}

export default Statusbar;