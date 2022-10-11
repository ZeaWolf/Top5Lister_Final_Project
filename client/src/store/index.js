import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
import api from '../api'
import MoveItem_Transaction from '../transactions/MoveItem_Transaction'
import UpdateItem_Transaction from '../transactions/UpdateItem_Transaction'
import AuthContext from '../auth'
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    UNMARK_LIST_FOR_DELETION: "UNMARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_ITEM_EDIT_ACTIVE: "SET_ITEM_EDIT_ACTIVE",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    SEARCH_LIST:"SEARCH_LIST",
    SORT_LIST:"SORT_LIST",
    LOAD_COMMUNITY_LISTS:"LOAD_COMMUNITY_LISTS"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false,
        itemActive: false,
        listMarkedForDeletion: null,
        searchCriteria:"",
        sortCriteria:"PublishDateNewest",
        communityLists:[]
    });
    const history = useHistory();

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: null, //payload.top5List,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    searchCriteria: store.searchCriteria,
                    sortCriteria: store.sortCriteria,
                    communityLists: store.communityLists
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    searchCriteria: store.searchCriteria,
                    sortCriteria: store.sortCriteria,
                    communityLists: store.communityLists
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter + 1,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    searchCriteria: store.searchCriteria,
                    sortCriteria: store.sortCriteria,
                    communityLists: store.communityLists
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    searchCriteria: store.searchCriteria,
                    sortCriteria: store.sortCriteria,
                    communityLists: store.communityLists
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: payload,
                    searchCriteria: store.searchCriteria,
                    sortCriteria: store.sortCriteria,
                    communityLists: store.communityLists
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.UNMARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    searchCriteria: store.searchCriteria,
                    sortCriteria: store.sortCriteria,
                    communityLists: store.communityLists
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    searchCriteria: store.searchCriteria,
                    sortCriteria: store.sortCriteria,
                    communityLists: store.communityLists
                });
            }
            // START EDITING A LIST ITEM
            case GlobalStoreActionType.SET_ITEM_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: payload,
                    listMarkedForDeletion: null,
                    searchCriteria: store.searchCriteria,
                    sortCriteria: store.sortCriteria,
                    communityLists: store.communityLists
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: payload,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    searchCriteria: store.searchCriteria,
                    sortCriteria: store.sortCriteria,
                    communityLists: store.communityLists
                });
            }
            case GlobalStoreActionType.SEARCH_LIST:{
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null, //payload.top5List,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    searchCriteria: payload.searchCriteria,
                    sortCriteria: store.sortCriteria,
                    communityLists: store.communityLists
                });
            }
            case GlobalStoreActionType.SORT_LIST:{
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null, //payload.top5List,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    searchCriteria: store.searchCriteria,
                    sortCriteria: payload.sortCriteria,
                    communityLists: store.communityLists
                });
            }
            case GlobalStoreActionType.LOAD_COMMUNITY_LISTS:{
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null, //payload.top5List,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    searchCriteria: store.searchCriteria,
                    sortCriteria: store.sortCriteria,
                    communityLists: payload,
                });
            }
            default:
                return store;
        }
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = async function (id, newName) {
        let response = await api.getTop5ListById(id);
        if (response.data.success) {
            let top5List = response.data.top5List;
            top5List.name = newName;
            async function updateList(top5List) {
                response = await api.updateTop5ListById(top5List._id, top5List);
                if (response.data.success) {
                    async function getListPairs(top5List) {
                        response = await api.getTop5ListPairs();
                        if (response.data.success) {
                            let pairsArray = response.data.idNamePairs;
                            storeReducer({
                                type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                payload: {
                                    idNamePairs: pairsArray,
                                    top5List: top5List
                                }
                            });
                        }
                    }
                    getListPairs(top5List);
                }
            }
            updateList(top5List);
        }
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        
        tps.clearAllTransactions();
        history.push("/");
    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        let newListName = "Untitled" + store.newListCounter;
        let payload = {
            name: newListName,
            items: ["?", "?", "?", "?", "?"],
            ownerEmail: auth.user.email,
            ownerName: auth.user.firstName+" "+auth.user.lastName,
            view: 0,
            like: 0,
            dislike: 0,
            likeList:[],
            dislikeList:[],
            comments: [],
            hasPublished: false,
        };
        const response = await api.createTop5List(payload);
        if (response.data.success) {
            tps.clearAllTransactions();
            let newList = response.data.top5List;
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: newList
            }
            );

            // IF IT'S A VALID LIST THEN LET'S START EDITING IT
            history.push("/top5list/" + newList._id);
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = async function (criteria) {
        try{
            if(criteria.screen === "communityScreen" ){
                const response = await api.getCommunityListPairs(criteria);
                if (response.data.success) {
                    let pairsArray = response.data.idNamePairs;
                    console.log(pairsArray)
                    storeReducer({
                        type: GlobalStoreActionType.LOAD_COMMUNITY_LISTS,
                        payload: pairsArray
                    });
                }
                else {
                    console.log("API FAILED TO GET THE LIST PAIRS");
                }
            }
            else{
                const response = await api.getTop5ListPairs(criteria);
                if (response.data.success) {
                    let pairsArray = response.data.idNamePairs;
                    
                    storeReducer({
                        type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                        payload: pairsArray
                    });
                }
                else {
                    console.log("API FAILED TO GET THE LIST PAIRS");
                }
            }
        }catch(err){
            console.log("err");
        }
    }

    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = async function (id) {
        // GET THE LIST
        let response = await api.getTop5ListById(id);
        if (response.data.success) {
            let top5List = response.data.top5List;
            storeReducer({
                type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                payload: top5List
            });
        }
    }

    store.deleteList = async function (listToDelete) {
        let response = await api.deleteTop5ListById(listToDelete._id);
        if (response.data.success) {
            store.loadIdNamePairs({screen:auth.currentScreen});
            history.push("/");
            store.updateCommunityDelete(listToDelete.name, listToDelete.items);
        }
    }

    store.deleteMarkedList = function () {
        store.deleteList(store.listMarkedForDeletion);
    }

    store.unmarkListForDeletion = function () {
        storeReducer({
            type: GlobalStoreActionType.UNMARK_LIST_FOR_DELETION,
            payload: null
        });
    }

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = async function (id) {
        let response = await api.getTop5ListById(id);
        if (response.data.success) {
            let top5List = response.data.top5List;

            response = await api.updateTop5ListById(top5List._id, top5List);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: top5List
                });
                history.push("/top5list/" + top5List._id);
            }
        }
    }

    // store.addMoveItemTransaction = function (start, end) {
    //     let transaction = new MoveItem_Transaction(store, start, end);
    //     tps.addTransaction(transaction);
    // }

    // store.addUpdateItemTransaction = function (index, newText) {
    //     let oldText = store.currentList.items[index];
    //     let transaction = new UpdateItem_Transaction(store, index, oldText, newText);
    //     tps.addTransaction(transaction);
    // }

    // store.moveItem = function (start, end) {
    //     start -= 1;
    //     end -= 1;
    //     if (start < end) {
    //         let temp = store.currentList.items[start];
    //         for (let i = start; i < end; i++) {
    //             store.currentList.items[i] = store.currentList.items[i + 1];
    //         }
    //         store.currentList.items[end] = temp;
    //     }
    //     else if (start > end) {
    //         let temp = store.currentList.items[start];
    //         for (let i = start; i > end; i--) {
    //             store.currentList.items[i] = store.currentList.items[i - 1];
    //         }
    //         store.currentList.items[end] = temp;
    //     }

    //     // NOW MAKE IT OFFICIAL
    //     store.updateCurrentList();
    // }

    store.updateItem = function (index, newItem) {
        store.currentList.items[index] = newItem;
        store.updateCurrentList();
    }

    store.updateCurrentList = async function () {
        const response = await api.updateTop5ListById(store.currentList._id, store.currentList);
        if (response.data.success) {
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_LIST,
                payload: store.currentList
            });
        }
    }

    store.undo = function () {
        if(store.canUndo()){
            tps.undoTransaction();
        }
    }

    store.redo = function () {
        if(store.canRedo()){
            tps.doTransaction();
        }
    }

    store.canUndo = function() {
        return tps.hasTransactionToUndo();
    }

    store.canRedo = function() {
        return tps.hasTransactionToRedo();
    }

    

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function (active) {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: active
        });
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING AN ITEM
    store.setIsItemEditActive = function (active) {
        storeReducer({
            type: GlobalStoreActionType.SET_ITEM_EDIT_ACTIVE,
            payload: active
        });
    }

    //save workspace
    store.saveWorkspace = function(listName, item1, item2, item3, item4, item5){
        store.currentList.name = listName;
        store.currentList.items[0] = item1;
        store.currentList.items[1] = item2;
        store.currentList.items[2] = item3;
        store.currentList.items[3] = item4;
        store.currentList.items[4] = item5;
        store.updateCurrentList();
        store.closeCurrentList();
    }

    //publish list
    store.publishList = function(listName, item1, item2, item3, item4, item5){
        store.currentList.name = listName;
        store.currentList.items[0] = item1;
        store.currentList.items[1] = item2;
        store.currentList.items[2] = item3;
        store.currentList.items[3] = item4;
        store.currentList.items[4] = item5;
        store.currentList.hasPublished = true;
        let date = new Date();
        store.currentList.publishDate = date;
        store.currentList.publishDateString = date.toLocaleString('default', { month: 'short' })+" "+date.getDate()+", "+date.getFullYear();
        store.updateCommunityPublish(store.currentList.name, store.currentList.items);
        store.updateCurrentList();
        store.closeCurrentList();
    }

    store.updateCommunityPublish = async function(publishListName, publishListItems){
        try{
            //update
            const response = await api.getCommunityListPairs({screen:"communityScreen"});
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                let foundTarget = false;
                let targetList = "";
                for(let i=0; i<pairsArray.length; i++){
                    if(pairsArray[i].name.toUpperCase() === publishListName.toUpperCase()){
                        targetList = pairsArray[i];
                        foundTarget = true;
                    }
                }
                if(foundTarget){
                    let id = targetList._id;
                    let newItemScores = targetList.itemScores;
                    for (let i = 0; i < publishListItems.length; i++){
                        if(publishListItems[i] in newItemScores){
                            newItemScores[publishListItems[i]] = newItemScores[publishListItems[i]]+(5-i);
                        }
                        else{
                            newItemScores[publishListItems[i]] = (5-i);
                        }
                    }
                    let date = new Date();
                    
                    targetList.itemScores = newItemScores;
                    targetList.updateDate = date;
                    
                    const response = await api.updateCommunityListById(id, targetList);
                    if (response.data.success){
                        console.log('Done');
                    }
                }
                else{
                    store.createCommunityList(publishListName, publishListItems);
                }


            }
        }catch(err){
            console.log(err);
        }
    }

    // update community after delete list
    store.updateCommunityDelete = async function(deleteListName, deleteListItems){
        try{
            //update
            const response = await api.getCommunityListPairs({screen:"communityScreen"});
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                let foundTarget = false;
                let targetList = "";
                for(let i=0; i<pairsArray.length; i++){
                    if(pairsArray[i].name.toUpperCase() === deleteListName.toUpperCase()){
                        targetList = pairsArray[i];
                        foundTarget = true;
                    }
                }
                if(foundTarget){
                    let id = targetList._id;
                    let newItemScores = targetList.itemScores;
                    for (let i = 0; i < deleteListItems.length; i++){
                        if(deleteListItems[i] in newItemScores){
                            newItemScores[deleteListItems[i]] = newItemScores[deleteListItems[i]]-(5-i);

                            if(newItemScores[deleteListItems[i]] === 0){
                                delete newItemScores[deleteListItems[i]];
                            }
                        }
                    }
                    if( Object.keys(newItemScores).length < 1){
                        const response = await api.deleteCommunityListById(id, targetList);
                        if (response.data.success){
                            console.log('Done');
                        }
                    }
                    else{
                        let date = new Date();
                        
                        targetList.itemScores = newItemScores;
                        targetList.updateDate = date;
                        
                        const response = await api.updateCommunityListById(id, targetList);
                        if (response.data.success){
                            console.log('Done');
                        }
                    }
                }


            }
        }catch(err){
            console.log(err);
        }
    }

    //post comment
    store.postComment = async function(id, comment){
        if(auth.currentScreen === "communityScreen"){
            let response = await api.getCommunityListById(id);
            if (response.data.success) {
                let communityList = response.data.communityList;
                communityList.comments.unshift(comment);
                async function updateList(communityList) {
                    response = await api.updateCommunityListById(communityList._id, communityList);
                    if (response.data.success) {
                        store.loadIdNamePairs({screen:auth.currentScreen});
                    }
                }
                updateList(communityList);
            }
        }
        else{
            let response = await api.getTop5ListById(id);
            if (response.data.success) {
                let top5List = response.data.top5List;
                top5List.comments.unshift(comment);
                async function updateList(top5List) {
                    response = await api.updateTop5ListById(top5List._id, top5List);
                    if (response.data.success) {
                        store.loadIdNamePairs({screen:auth.currentScreen});
                    }
                }
                updateList(top5List);
            }
        }
    }

    //increase view
    store.increaseListView = async function(id){
        if(auth.currentScreen === "communityScreen"){
            let response = await api.getCommunityListById(id);
            if (response.data.success) {
                let communityList = response.data.communityList;
                communityList.view = communityList.view+1;
                async function updateList(communityList) {
                    response = await api.updateCommunityListById(communityList._id, communityList);
                    if (response.data.success) {
                        store.loadIdNamePairs({screen:auth.currentScreen});
                    }
                }
                updateList(communityList);
            }
        }
        else{
            let response = await api.getTop5ListById(id);
            if (response.data.success) {
                let top5List = response.data.top5List;
                top5List.view = top5List.view+1;
                async function updateList(top5List) {
                    response = await api.updateTop5ListById(top5List._id, top5List);
                    if (response.data.success) {
                        store.loadIdNamePairs({screen:auth.currentScreen});
                    }
                }
                updateList(top5List);
            }
        }
    }

    //like list
    store.likeList = async function(id){
        if(auth.currentScreen === "communityScreen"){
            let response = await api.getCommunityListById(id);
            if (response.data.success) {
                let communityList = response.data.communityList;
                communityList.like = communityList.like+1;
                communityList.likeList.push(auth.user.email);
                async function updateList(communityList) {
                    response = await api.updateCommunityListById(communityList._id, communityList);
                    if (response.data.success) {
                        store.loadIdNamePairs({screen:auth.currentScreen});
                    }
                }
                updateList(communityList);
            }
        }
        else{
            let response = await api.getTop5ListById(id);
            if (response.data.success) {
                let top5List = response.data.top5List;
                top5List.like = top5List.like+1;
                top5List.likeList.push(auth.user.email);
                async function updateList(top5List) {
                    response = await api.updateTop5ListById(top5List._id, top5List);
                    if (response.data.success) {
                        store.loadIdNamePairs({screen:auth.currentScreen});
                    }
                }
                updateList(top5List);
            }
        }
    }
    //unlike list
    store.unlikeList = async function(id){
        if(auth.currentScreen === "communityScreen"){
            let response = await api.getCommunityListById(id);
            if (response.data.success) {
                let communityList = response.data.communityList;
                communityList.like = communityList.like-1;
                let index = communityList.likeList.indexOf(auth.user.email);
                if(index>-1){
                    communityList.likeList.splice(index, 1);
                }
                async function updateList(communityList) {
                    response = await api.updateCommunityListById(communityList._id, communityList);
                    if (response.data.success) {
                        store.loadIdNamePairs({screen:auth.currentScreen});
                    }
                }
                updateList(communityList);
            }
        }
        else{
            let response = await api.getTop5ListById(id);
            if (response.data.success) {
                let top5List = response.data.top5List;
                top5List.like = top5List.like-1;
                let index = top5List.likeList.indexOf(auth.user.email);
                if(index>-1){
                    top5List.likeList.splice(index, 1);
                }
                async function updateList(top5List) {
                    response = await api.updateTop5ListById(top5List._id, top5List);
                    if (response.data.success) {
                        store.loadIdNamePairs({screen:auth.currentScreen});
                    }
                }
                updateList(top5List);
            }
        }
    }

    //dislike list
    store.dislikeList = async function(id){
        if(auth.currentScreen === "communityScreen"){
            let response = await api.getCommunityListById(id);
            if (response.data.success) {
                let communityList = response.data.communityList;
                communityList.dislike = communityList.dislike+1;
                communityList.dislikeList.push(auth.user.email);
                async function updateList(communityList) {
                    response = await api.updateCommunityListById(communityList._id, communityList);
                    if (response.data.success) {
                        store.loadIdNamePairs({screen:auth.currentScreen});
                    }
                }
                updateList(communityList);
            }
        }
        else{
            let response = await api.getTop5ListById(id);
            if (response.data.success) {
                let top5List = response.data.top5List;
                top5List.dislike = top5List.dislike+1;
                top5List.dislikeList.push(auth.user.email);
                async function updateList(top5List) {
                    response = await api.updateTop5ListById(top5List._id, top5List);
                    if (response.data.success) {
                        store.loadIdNamePairs({screen:auth.currentScreen});
                    }
                }
                updateList(top5List);
            }
        }
    }

    store.undislikeList = async function(id){
        if(auth.currentScreen === "communityScreen"){
            let response = await api.getCommunityListById(id);
            if (response.data.success) {
                let communityList = response.data.communityList;
                communityList.dislike = communityList.dislike-1;
                let index = communityList.dislikeList.indexOf(auth.user.email)
                if(index>-1){
                    communityList.dislikeList.splice(index, 1);
                }
                async function updateList(communityList) {
                    response = await api.updateCommunityListById(communityList._id, communityList);
                    if (response.data.success) {
                        store.loadIdNamePairs({screen:auth.currentScreen});
                    }
                }
                updateList(communityList);
            }
        }
        else{
            let response = await api.getTop5ListById(id);
            if (response.data.success) {
                let top5List = response.data.top5List;
                top5List.dislike = top5List.dislike-1;
                let index = top5List.dislikeList.indexOf(auth.user.email)
                if(index>-1){
                    top5List.dislikeList.splice(index, 1);
                }
                async function updateList(top5List) {
                    response = await api.updateTop5ListById(top5List._id, top5List);
                    if (response.data.success) {
                        store.loadIdNamePairs({screen:auth.currentScreen});
                    }
                }
                updateList(top5List);
            }
        }
    }

    store.likeAndUndislike = async function(id){
        if(auth.currentScreen === "communityScreen"){
            let response = await api.getCommunityListById(id);
            if (response.data.success) {
                let communityList = response.data.communityList;
                communityList.like = communityList.like+1;
                communityList.likeList.push(auth.user.email);
                communityList.dislike = communityList.dislike-1;
                let index = communityList.dislikeList.indexOf(auth.user.email)
                if(index>-1){
                    communityList.dislikeList.splice(index, 1);
                }
                async function updateList(communityList) {
                    response = await api.updateCommunityListById(communityList._id, communityList);
                    if (response.data.success) {
                        store.loadIdNamePairs({screen:auth.currentScreen});
                    }
                }
                updateList(communityList);
            }
        }
        else{
            let response = await api.getTop5ListById(id);
            if (response.data.success) {
                let top5List = response.data.top5List;
                top5List.like = top5List.like+1;
                top5List.likeList.push(auth.user.email);
                top5List.dislike = top5List.dislike-1;
                let index = top5List.dislikeList.indexOf(auth.user.email)
                if(index>-1){
                    top5List.dislikeList.splice(index, 1);
                }
                async function updateList(top5List) {
                    response = await api.updateTop5ListById(top5List._id, top5List);
                    if (response.data.success) {
                        store.loadIdNamePairs({screen:auth.currentScreen});
                    }
                }
                updateList(top5List);
            }
        }
    }
    store.dislikeAndUnlike = async function(id){
        if(auth.currentScreen === "communityScreen"){
            let response = await api.getCommunityListById(id);
            if (response.data.success) {
                let communityList = response.data.communityList;
                communityList.dislike = communityList.dislike+1;
                communityList.dislikeList.push(auth.user.email);
                communityList.like = communityList.like-1;
                let index = communityList.likeList.indexOf(auth.user.email);
                if(index>-1){
                    communityList.likeList.splice(index, 1);
                }
                async function updateList(communityList) {
                    response = await api.updateCommunityListById(communityList._id, communityList);
                    if (response.data.success) {
                        store.loadIdNamePairs({screen:auth.currentScreen});
                    }
                }
                updateList(communityList);
            }
        }
        else{
            let response = await api.getTop5ListById(id);
            if (response.data.success) {
                let top5List = response.data.top5List;
                top5List.dislike = top5List.dislike+1;
                top5List.dislikeList.push(auth.user.email);
                top5List.like = top5List.like-1;
                let index = top5List.likeList.indexOf(auth.user.email);
                if(index>-1){
                    top5List.likeList.splice(index, 1);
                }
                async function updateList(top5List) {
                    response = await api.updateTop5ListById(top5List._id, top5List);
                    if (response.data.success) {
                        store.loadIdNamePairs({screen:auth.currentScreen});
                    }
                }
                updateList(top5List);
            }
        }
    }

    // search list
    store.searchList = function (search){
        storeReducer({
            type: GlobalStoreActionType.SEARCH_LIST,
            payload:{
                searchCriteria: search,
            }
        });
    }

    store.sortList = function (sort){
        storeReducer({
            type: GlobalStoreActionType.SORT_LIST,
            payload:{
                sortCriteria: sort,
            }
        });
    }


    //Community List
    store.createCommunityList = async function (name, items) {
        let newListName = name;
        let newItemScores = {};
        for (let i = 0; i < items.length; i++){
            if(items[i] in newItemScores){
                newItemScores[items[i]] = newItemScores[items[i]]+(5-i);
            }
            else{
                newItemScores[items[i]] = (5-i);
            }
        }
        let date = new Date()
        console.log(newItemScores)
        let payload = {
            name: newListName,
            itemScores: newItemScores,
            view: 0,
            like: 0,
            dislike: 0,
            likeList:[],
            dislikeList:[],
            comments: [],
            publishDate: date,
            updateDate: date,
        };
        const response = await api.createCommunityList(payload);
        if (response.data.success) {
            console.log("Yes, community list created")
        }
        else {
            console.log("API FAILED TO CREATE A Community LIST");
        }
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };