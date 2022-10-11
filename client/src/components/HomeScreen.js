import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import { Fab, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import List from '@mui/material/List';
import DeletionModal from "./DeletionModal";
import NavigationBar from "./NavigationBar";
import Statusbar from "./Statusbar";
import AuthContext from '../auth'
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    useEffect(() => {
        store.closeCurrentList();
        store.loadIdNamePairs({screen:auth.currentScreen});
    }, []);

    let sortedPairs = "";
    if(store.sortCriteria === "PublishDateNewest"){
        store.idNamePairs.sort(function(a, b) {
            if(a.publishDate === undefined){
                return 1;
            }
            if(b.publishDate === undefined){
                return -1;
            }
            return new Date(b.publishDate) - new Date(a.publishDate);
        });
        store.communityLists.sort(function(a, b) {
            if(a.updateDate === undefined){
                return 1;
            }
            if(b.updateDate === undefined){
                return -1;
            }
            return new Date(b.updateDate) - new Date(a.updateDate);
        });
    }
    if(store.sortCriteria === "PublishDateOldest"){
        store.idNamePairs.sort(function(a, b) {
            if(a.publishDate === undefined){
                return 1;
            }
            if(b.publishDate === undefined){
                return -1;
            }
            return new Date(a.publishDate) - new Date(b.publishDate);
        });
        store.communityLists.sort(function(a, b) {
            if(a.updateDate === undefined){
                return 1;
            }
            if(b.updateDate === undefined){
                return -1;
            }
            return new Date(a.updateDate) - new Date(b.updateDate);
        });
    }
    if(store.sortCriteria === "Views"){
        store.idNamePairs.sort(function(a, b) {return b.view - a.view;});
        store.communityLists.sort(function(a, b) {return b.view - a.view;});
    }
    if(store.sortCriteria === "Likes"){
        store.idNamePairs.sort(function(a, b) {return b.like - a.like;});
        store.communityLists.sort(function(a, b) {return b.like - a.like;});
    }
    if(store.sortCriteria === "Dislikes"){
        store.idNamePairs.sort(function(a, b) {return b.dislike - a.dislike;});
        store.communityLists.sort(function(a, b) {return b.dislike - a.dislike;});
    }

    let listCard = "";
    if (auth.currentScreen==="homeScreen") {
        const filteredPairs = store.idNamePairs.filter(pair => pair.name.toUpperCase().startsWith(store.searchCriteria.toUpperCase()));
        listCard = 
            <List sx={{ width: '90%', left: '5%', bgcolor: '#C4C4C4'}}>
            {
                filteredPairs.map((pair) => (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                    />
                ))
            }
            </List>;
    }
    else if (auth.currentScreen==="allListScreen"){
        if(store.searchCriteria===""){
            let filteredPairs = store.idNamePairs;
            listCard = 
                <List sx={{ width: '90%', left: '5%', bgcolor: '#C4C4C4'}}>
                {
                    filteredPairs.map((pair) => (
                        
                        <ListCard
                            key={pair._id}
                            idNamePair={pair}
                            selected={false}
                        />
                    ))
                }
                </List>; 
        }
        else{
            const filteredPairs = store.idNamePairs.filter(pair => pair.name.toUpperCase() === store.searchCriteria.toUpperCase());
            listCard = 
                <List sx={{ width: '90%', left: '5%', bgcolor: '#C4C4C4'}}>
                {
                    filteredPairs.map((pair) => (
                        <ListCard
                            key={pair._id}
                            idNamePair={pair}
                            selected={false}
                        />
                    ))
                }
                </List>;
            }
    }
    else if (auth.currentScreen==="userScreen"){
        const filteredPairs = store.idNamePairs.filter(pair => pair.ownerName.toUpperCase() === store.searchCriteria.toUpperCase());
        listCard = 
            <List sx={{ width: '90%', left: '5%', bgcolor: '#C4C4C4'}}>
            {
                filteredPairs.map((pair) => (
                    
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                    />
                ))
            }
            </List>;
    }
    else if(auth.currentScreen==="communityScreen"){
        const filteredPairs = store.communityLists.filter(pair => pair.name.toUpperCase().startsWith(store.searchCriteria.toUpperCase()));
        listCard = 
            <List sx={{ width: '90%', left: '5%', bgcolor: '#C4C4C4'}}>
            {
                filteredPairs.map((pair) => (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                    />
                ))
            }
            </List>;
    }
    return (
        <div id="main-screen">
            <NavigationBar/>
            <div id="lists-selector">
                {
                    listCard
                }
            </div>
            <Statusbar />
            <DeletionModal/>
        </div>)
}

export default HomeScreen;