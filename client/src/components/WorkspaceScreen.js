import { useContext, useEffect, useState } from 'react'
import Top5Item from './Top5Item.js'
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { GlobalStoreContext } from '../store/index.js';
import NavigationBar from "./NavigationBar";
import Statusbar from "./Statusbar";
/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function WorkspaceScreen() {
    const { store } = useContext(GlobalStoreContext);
    const [wantPublish, setWantPublish] = useState(false);
    const [allowPublish, setAllowPublish] = useState(false);

    useEffect(() => {
        let url = window.location.href;
        let tempIndex = url.indexOf("/top5list/")
        let id = url.substring(tempIndex+10);
        store.setCurrentList(id);
    }, []);

    const handleSumbit = (event) =>{
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        let listName = formData.get('list-name');
        let item1 = formData.get('item-1-name');
        let item2 = formData.get('item-2-name');
        let item3 = formData.get('item-3-name');
        let item4 = formData.get('item-4-name');
        let item5 = formData.get('item-5-name');

        if(wantPublish && allowPublish){
            store.publishList(listName, item1, item2, item3, item4, item5);
        }
        else{
            store.saveWorkspace(listName, item1, item2, item3, item4, item5);
        }
    };

    function handleTogglePublish(event){
        event.stopPropagation();
        togglePublish();
    }
    function togglePublish() {
        let newPublish = true;
        //store.setIsListNameEditActive(newActive);
        setWantPublish(newPublish);
    }


    function checkAllowPublish(event){
        event.preventDefault();
        let listname = document.getElementById('list-name').value;
        let item1 = document.getElementById('item-1-name').value;
        let item2 = document.getElementById('item-2-name').value;
        let item3 = document.getElementById('item-3-name').value;
        let item4 = document.getElementById('item-4-name').value;
        let item5 = document.getElementById('item-5-name').value;
        let samePublishedLists = store.idNamePairs.filter(pair => pair.name.toUpperCase()===listname.toUpperCase() && pair.hasPublished);
        console.log(samePublishedLists);
        console.log(store.idNamePairs);
        console.log(samePublishedLists.length1);

        if(listname==='' || item1==='' || item2==='' || item3==='' || item4==='' || item5===''){
            setAllowPublish(false);
        } 
        else if(item1===item2 || item1===item3 || item1===item4 || item1===item5 || item2===item3  || 
            item2===item4 || item2===item5 || item3===item4|| item3===item5|| item4===item5){
                setAllowPublish(false);
            }
        else if(samePublishedLists.length > 0 ){
            setAllowPublish(false);
        }
        else{
            setAllowPublish(true);
        }
    }
    // let clistname = document.getElementById('list-name');
    // let citem1 = document.getElementById('item-1-name');
    // let citem2 = document.getElementById('item-2-name');
    // let citem3 = document.getElementById('item-3-name');
    // let citem4 = document.getElementById('item-4-name');
    // let citem5 = document.getElementById('item-5-name');

    let listForm = "";
    if (store.currentList) {
        listForm =
            <div id="top5-workspace">
                <Box component="form" noValidate onSubmit={handleSumbit} sx={{ mt: 3 }}>
                    <TextField
                        name="list-name"
                        required
                        id="list-name"
                        size="small"
                        autoFocus
                        onChange= {(event)=>(checkAllowPublish(event))}
                        defaultValue={store.currentList.name}
                        inputProps = {{style:{fontSize:20, fontWeight: "bold"}}}
                        sx = {{width: '40%', left: '5%', border:2, borderRadius:3, bgcolor:'#FFFFFF'}}
                    />

                    <div id = "item-section">
                        <Grid container spacing={1} my={1} mx={1}>
                            <Grid item md={1} mx={1} div><Typography style={{fontSize: 30, fontWeight: "bold"}} className="item-number">1.</Typography></Grid>
                            <Grid item md={10} div className="item-name-field">
                                <TextField
                                    required
                                    fullWidth
                                    id="item-1-name"
                                    name="item-1-name"
                                    size="small"
                                    onChange= {(event)=>(checkAllowPublish(event))}
                                    defaultValue = {store.currentList.items[0]}
                                    inputProps = {{style:{fontSize: 20, fontWeight: "bold"}}}
                                    sx = {{border:3, borderRadius:3, bgcolor:'#D4AF37'}}
                                />
                            </Grid>

                            <Grid item md={1} mx={1} div><Typography style={{fontSize: 30, fontWeight: "bold"}} className="item-number">2.</Typography></Grid>
                            <Grid item md={10} div className="item-name-field">
                                <TextField
                                    required
                                    fullWidth
                                    id="item-2-name"
                                    name="item-2-name"
                                    size="small"
                                    onChange= {(event)=>(checkAllowPublish(event))}
                                    defaultValue = {store.currentList.items[1]}
                                    inputProps = {{style:{fontSize:20, fontWeight: "bold"}}}
                                    sx = {{border:3, borderRadius:3, bgcolor:'#D4AF37'}}
                                />
                            </Grid>

                            <Grid item md={1} mx={1} div><Typography style={{fontSize: 30, fontWeight: "bold"}} className="item-number">3.</Typography></Grid>
                            <Grid item md={10} div className="item-name-field">
                                <TextField
                                    required
                                    fullWidth
                                    id="item-3-name"
                                    name="item-3-name"
                                    size="small"
                                    onChange= {(event)=>(checkAllowPublish(event))}
                                    defaultValue = {store.currentList.items[2]}
                                    inputProps = {{style:{fontSize:20, fontWeight: "bold"}}}
                                    sx = {{border:3, borderRadius:3, bgcolor:'#D4AF37'}}
                                />
                            </Grid>

                            <Grid item md={1} mx={1} div><Typography style={{fontSize: 30, fontWeight: "bold"}} className="item-number">4.</Typography></Grid>
                            <Grid item md={10} div className="item-name-field">
                                <TextField
                                    required
                                    fullWidth
                                    id="item-4-name"
                                    name="item-4-name"
                                    size="small"
                                    onChange= {(event)=>(checkAllowPublish(event))}
                                    defaultValue = {store.currentList.items[3]}
                                    inputProps = {{style:{fontSize:20, fontWeight: "bold"}}}
                                    sx = {{border:3, borderRadius:3, bgcolor:'#D4AF37'}}
                                />
                            </Grid>

                            <Grid item md={1} mx={1} div><Typography style={{fontSize: 30, fontWeight: "bold"}} className="item-number">5.</Typography></Grid>
                            <Grid item md={10} div className="item-name-field">
                                <TextField
                                    required
                                    fullWidth
                                    id="item-5-name"
                                    name="item-5-name"
                                    size="small"
                                    onChange= {(event)=>(checkAllowPublish(event))}
                                    defaultValue = {store.currentList.items[4]}
                                    inputProps = {{style:{fontSize:20, fontWeight: "bold"}}}
                                    sx = {{border:3, borderRadius:3, bgcolor:'#D4AF37'}}
                                />
                            </Grid>
                        </Grid>
                    </div>
                    <div id="button-section">
                        <Button
                            type="submit"
                            id='save-button'
                            fullWidth
                            variant="contained"
                            sx={{ my: 3, mx: 3}}
                            style={{maxWidth:'120px', minWidth:'120px', fontWeight:'bold', fontSize: 15, color:"black"}}
                        >
                            Save
                        </Button>
                        <Button
                            disabled = {!allowPublish}
                            type="submit"
                            id='publish-button'
                            fullWidth
                            variant="contained"
                            onClick={handleTogglePublish}
                            sx={{ my: 3, mx: 1 }}
                            style={(allowPublish)?
                                {maxWidth:'120px', minWidth:'120px', fontWeight:'bold', fontSize: 15, color:"black"}:
                                {maxWidth:'120px', minWidth:'120px', fontWeight:'bold', fontSize: 15, color:"gray"}}
                        >
                            Publish
                        </Button>
                    </div>
                </Box>
            </div>
    }
    return(
        <div id="main-screen">
            <NavigationBar/>
            {listForm}
            <Statusbar/>
        </div>
    )

    // let editItems = "";
    // if (store.currentList) {
    //     editItems = 
    //         <List id="edit-items" sx={{ width: '100%', bgcolor: 'background.paper' }}>
    //             {
    //                 store.currentList.items.map((item, index) => (
    //                     <Top5Item 
    //                         key={'top5-item-' + (index+1)}
    //                         text={item}
    //                         index={index} 
    //                     />
    //                 ))
    //             }
    //         </List>;
    // }
    // return (
    //     <div id="top5-workspace">
    //         <div id="workspace-edit">
    //             <div id="edit-numbering">
    //                 <div className="item-number"><Typography variant="h3">1.</Typography></div>
    //                 <div className="item-number"><Typography variant="h3">2.</Typography></div>
    //                 <div className="item-number"><Typography variant="h3">3.</Typography></div>
    //                 <div className="item-number"><Typography variant="h3">4.</Typography></div>
    //                 <div className="item-number"><Typography variant="h3">5.</Typography></div>
    //             </div>
    //             {editItems}
    //         </div>
    //     </div>
    // )
}

export default WorkspaceScreen;