import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import CommentCard from './CommentCard.js';
import AuthContext from '../auth'


/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [expandActive, setExpandActive] = useState(false);
    const [text, setText] = useState("");
    const { idNamePair } = props;
    const { auth } = useContext(AuthContext);

    function handleLoadList(event, id) {
        if (!event.target.disabled) {
            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);
        }
    }

    function handleToggleExpand(event) {
        event.stopPropagation();
        toggleExpand();
    }

    function toggleExpand() {
        let newActive = !expandActive;
        //store.setIsListNameEditActive(newActive);
        setExpandActive(newActive);
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        store.markListForDeletion(id);
    }

    function handleIncreaseView(event, id){
        event.stopPropagation();
        store.increaseListView(id);
    }

    function handleLike(event, id){
        event.stopPropagation();
        if(auth.loggedIn){
            if(idNamePair.likeList.indexOf(auth.user.email) === -1 && idNamePair.dislikeList.indexOf(auth.user.email) === -1){
                store.likeList(id);
            }
            else if(idNamePair.likeList.indexOf(auth.user.email) > -1){
                store.unlikeList(id);
            }
            else if(idNamePair.likeList.indexOf(auth.user.email) === -1 && idNamePair.dislikeList.indexOf(auth.user.email) > -1){
                store.likeAndUndislike(id);
            }
        }

    }

    function handleDislike(event, id){
        event.stopPropagation();
        if(auth.loggedIn){
            console.log("DISLIKE HERE")
            if(idNamePair.likeList.indexOf(auth.user.email) === -1 && idNamePair.dislikeList.indexOf(auth.user.email) === -1){
                store.dislikeList(id);
            }
            else if(idNamePair.likeList.indexOf(auth.user.email) > -1 && idNamePair.dislikeList.indexOf(auth.user.email) === -1){
                store.dislikeAndUnlike(id);
            }
            else if(idNamePair.dislikeList.indexOf(auth.user.email) > -1){
                store.undislikeList(id);
            }
        }
    }

    function handlePostComment(event, id){
        if(event.code === "Enter"){
            let commentContent = [auth.user.firstName+" "+auth.user.lastName, event.target.value];
            store.postComment(id, commentContent);
            event.target.value = "";
        }
    }

    // function handleKeyPress(event) {
    //     if (event.code === "Enter") {
    //         let id = event.target.id.substring("list-".length);
    //         store.changeListName(id, text);
    //         toggleEdit();
    //     }
    // }
    // function handleUpdateText(event) {
    //     setText(event.target.value);
    // }

    let likeColor = "black";
    if(auth.loggedIn){
        if(idNamePair.likeList.indexOf(auth.user.email) > -1){
            likeColor = "red";
        }
    }
    let dislikeColor = "black";
    if(auth.loggedIn){
        if(idNamePair.dislikeList.indexOf(auth.user.email) > -1){
            dislikeColor = "red";
        }
    }
    let listBackground = '#FFFFF1';
    if(idNamePair.hasPublished){
        listBackground = '#D4D4F5';
    }

    let deleteButton ="";
    if(auth.currentScreen === "homeScreen"){
        deleteButton = 
            <IconButton 
                id = "delete-button" 
                size = "small" 
                sx = {{ml:10}} 
                onClick={(event) => {handleDeleteList(event, idNamePair._id)}}
            >
                <DeleteOutlinedIcon fontSize="large"/>
            </IconButton>
    }

    let editOrPublish = 
            <Grid item md={6} ml={1}>
                <Typography mt={2}
                    style={{fontSize: 15,  fontWeight: "bold", color:"red", textDecorationLine:"underline", cursor:'pointer'}} 
                    onClick={(event) => {handleLoadList(event, idNamePair._id)}}
                >
                        Edit
                </Typography>
                <Typography></Typography>
            </Grid>;

    if(idNamePair.hasPublished){
        editOrPublish =
                <Grid item md={6} ml={1} mt={2}> 
                    <Typography display="inline" style={{fontSize: 15,  fontWeight: "bold"}} >
                        Published: &nbsp; &nbsp;
                    </Typography>
                    <Typography display="inline" style={{fontSize: 15,  fontWeight: "bold", color:"green"}}>
                        {idNamePair.publishDateString}
                    </Typography>
                </Grid>;
    }

    let cardElement = "";

    if(auth.currentScreen === "communityScreen"){
        let items = Object.keys(idNamePair.itemScores).map(function(key) {
            return [key, idNamePair.itemScores[key]];
        });
          
          // Sort the array based on the second element
        items.sort(function(first, second) {
            return second[1] - first[1];
        });
          
          // Create a new array with only the first 5 items
        let top5items = items.slice(0, 5);

        /////
        cardElement = 
            <ListItem 
                sx={{ 
                    width: '100%', 
                    display: 'flex', 
                    bgcolor: '#D4D4F5', 
                    border: 1,
                    borderRadius: 3, 
                    borderColor: 'black',
                    margin: 2
                }}
            >
                <Grid container spacing={1} columns={12}>
                    <Grid item md={6} container direction="column" spacing={2} ml={1} mt={1}>
                        <Typography style={{fontSize: 20,  fontWeight: "bold"}} >
                            {idNamePair.name} 
                        </Typography>
                    </Grid>
                    <Grid item md={1} mt={2}>
                        
                        <IconButton disabled = {auth.guest} id = "thumb-up-button" size = "small" sx = {{ml:4}} 
                        onClick={(event) => {handleLike(event, idNamePair._id)}}>
                            <ThumbUpIcon fontSize="large" style={{color: likeColor}} />
                        </IconButton>
                    </Grid>
                    <Grid item md={1} mt={3}>
                        <Typography style={{fontSize: 20,  fontWeight: "bold"}} >
                            {idNamePair.like}
                        </Typography>
                    </Grid>
                    <Grid item md={1} mt={2}>
                        <IconButton disabled = {auth.guest} id = "thumb-down-button" size = "small" sx = {{ml:4}}
                        onClick={(event) => {handleDislike(event, idNamePair._id)}}>
                            <ThumbDownIcon fontSize="large" style={{color: dislikeColor}}/>
                        </IconButton>
                    </Grid>
                    <Grid item md={1} mt={3}>
                        <Typography style={{fontSize: 20,  fontWeight: "bold"}} >
                            {idNamePair.dislike}
                        </Typography>
                    </Grid>
                    <Grid item md={1} mt={2}></Grid>
                    <Grid item md={6} ml={1} mt={2}> 
                        <Typography display="inline" style={{fontSize: 15,  fontWeight: "bold"}} >
                            Updated: &nbsp; &nbsp;
                        </Typography>
                        <Typography display="inline" style={{fontSize: 15,  fontWeight: "bold", color:"green"}}>
                            {new Date(idNamePair.updateDate).toLocaleString('default', { month: 'short' })
                            +" "+new Date(idNamePair.updateDate).getDate()
                            +", "+new Date(idNamePair.updateDate).getFullYear()}
                        </Typography>
                    </Grid>
                    <Grid item md={2}></Grid>
                    <Grid item md={1}  ml={5}>
                        <Typography style={{fontSize: 20,  fontWeight: "bold"}} ml={2} mt={2}>
                            Views: 
                        </Typography>
                    </Grid>
                    <Grid item md={1} >
                        <Typography style={{fontSize: 20,  fontWeight: "bold", color:"red"}} mt={2}>
                            {idNamePair.view}
                        </Typography>
                    </Grid>
                    <Grid item md={1} mt={2}>
                        <IconButton 
                            id = "expand-more-button" 
                            size = "small" 
                            sx = {{ml:7}}
                            onClick = {(event)=> {handleToggleExpand(event); handleIncreaseView(event, idNamePair._id)}}
                        >
                            <ExpandMoreIcon fontSize="large"/>
                        </IconButton>
                    </Grid>
                </Grid>
            </ListItem>

        if(expandActive){
            cardElement = 
                <ListItem 
                    sx={{ 
                        width: '100%', 
                        display: 'flex', 
                        bgcolor:'#D4D4F5', 
                        border: 1,
                        borderRadius: 3, 
                        borderColor: 'black',
                        margin: 2
                    }}
                >
                    <Grid container spacing={1} columns={12}>
                        <Grid item md={6} container direction="column" spacing={2} ml={1} mt={1}>
                            <Typography style={{fontSize: 20,  fontWeight: "bold"}} >
                                {idNamePair.name} 
                            </Typography>
                            
                        </Grid>
                        <Grid item md={1} mt={2}>
                            <IconButton disabled = {auth.guest} id = "thumb-up-button" size = "small" sx = {{ml:5}} 
                            onClick={(event) => {handleLike(event, idNamePair._id)}}>
                                <ThumbUpIcon fontSize="large" style={{color: likeColor}}/>
                            </IconButton>
                        </Grid>
                        <Grid item md={1} mt={3}>
                            <Typography style={{fontSize: 20,  fontWeight: "bold"}} >
                                {idNamePair.like}
                            </Typography>
                        </Grid>
                        <Grid item md={1} mt={2}>
                            <IconButton disabled = {auth.guest} id = "thumb-down-button" size = "small" sx = {{ml:5}}
                            onClick={(event) => {handleDislike(event, idNamePair._id)}}>
                                <ThumbDownIcon fontSize="large" style={{color: dislikeColor}}/>
                            </IconButton>
                        </Grid>
                        <Grid item md={1} mt={3}>
                            <Typography style={{fontSize: 20,  fontWeight: "bold"}} >
                                {idNamePair.dislike}
                            </Typography>
                        </Grid>
                        <Grid item md={1} mt={2}>
                            {deleteButton}
                        </Grid>

                        <Grid item md={6}>
                            <Box sx={{bgcolor:'#2C2F70', borderRadius:2}}>
                                <Typography ml={1} mt={1} style={{fontSize: 25,  fontWeight: "bold", color:"#D4AF37"}}>1.  {top5items[0][0]}</Typography>
                                <Typography ml={10} mb={1} style={{fontSize: 15,  fontWeight: "bold", color:"#D4AF37"}}>({top5items[0][1]} Votes)</Typography>
                                <Typography ml={1} mt={1} style={{fontSize: 25,  fontWeight: "bold", color:"#D4AF37"}}>2.  {top5items[1][0]}</Typography>
                                <Typography ml={10} mb={1} style={{fontSize: 15,  fontWeight: "bold", color:"#D4AF37"}}>({top5items[1][1]} Votes)</Typography>
                                <Typography ml={1} mt={1} style={{fontSize: 25,  fontWeight: "bold", color:"#D4AF37"}}>3.  {top5items[2][0]}</Typography>
                                <Typography ml={10} mb={1} style={{fontSize: 15,  fontWeight: "bold", color:"#D4AF37"}}>({top5items[2][1]} Votes)</Typography>
                                <Typography ml={1} mt={1} style={{fontSize: 25,  fontWeight: "bold", color:"#D4AF37"}}>4.  {top5items[3][0]}</Typography>
                                <Typography ml={10} mb={1} style={{fontSize: 15,  fontWeight: "bold", color:"#D4AF37"}}>({top5items[3][1]} Votes)</Typography>
                                <Typography ml={1} mt={1} style={{fontSize: 25,  fontWeight: "bold", color:"#D4AF37"}}>5.  {top5items[4][0]}</Typography>
                                <Typography ml={10} mb={1} style={{fontSize: 15,  fontWeight: "bold", color:"#D4AF37"}}>({top5items[4][1]} Votes)</Typography>
                            </Box>
                        </Grid>

                        <Grid item md={6}>
                            <div id="comment-list-community">
                                <List>
                                {
                                    idNamePair.comments.map((comment) => (
                                        <CommentCard
                                            user={comment[0]}
                                            comment={comment[1]}
                                            selected={false}
                                        />
                                    ))
                                }       
                                </List>
                            </div>
                            <TextField
                                disabled = {auth.guest}
                                fullWidth
                                id="add-comment-field"
                                name="add-comment-field"
                                label="Add Comment"
                                size="small"
                                autoFocus
                                inputProps = {{style:{fontSize:20, fontWeight: "bold"}}}
                                sx = {{width: '95%', bottom: '7%', borderRadius:3, bgcolor:'#FFFFFF'}}
                                onKeyPress = {(event)=>{handlePostComment(event, idNamePair._id)}}
                            />
                        </Grid>

                        <Grid item md={6} ml={1} mt={2}> 
                            <Typography display="inline" style={{fontSize: 15,  fontWeight: "bold"}} >
                                Updated: &nbsp; &nbsp;
                            </Typography>
                            <Typography display="inline" style={{fontSize: 15,  fontWeight: "bold", color:"green"}}>
                                {new Date(idNamePair.updateDate).toLocaleString('default', { month: 'short' })
                                +" "+new Date(idNamePair.updateDate).getDate()
                                +", "+new Date(idNamePair.updateDate).getFullYear()}
                            </Typography>
                        </Grid>
                        <Grid item md={2}></Grid>
                        <Grid item md={1}  ml={5}>
                            <Typography style={{fontSize: 20,  fontWeight: "bold"}} ml={2} mt={2}>
                                Views: 
                            </Typography>
                        </Grid>
                        <Grid item md={1} >
                            <Typography style={{fontSize: 20,  fontWeight: "bold", color:"red"}} mt={2}>
                                {idNamePair.view}
                            </Typography>
                        </Grid>
                            <Grid item md={1} mt={2}>
                            <IconButton 
                                id = "expand-less-button" 
                                size = "small" 
                                sx = {{ml:7}}
                                onClick = {(event)=>{handleToggleExpand(event)}}
                            >
                                <ExpandLessIcon fontSize="large"/>
                            </IconButton>
                        </Grid>
                    </Grid>
                </ListItem>
        }

        ///////////////
    }
    else{
        cardElement = 
            <ListItem 
                sx={{ 
                    width: '100%', 
                    display: 'flex', 
                    bgcolor:listBackground, 
                    border: 1,
                    borderRadius: 3, 
                    borderColor: 'black',
                    margin: 2
                }}
            >
                <Grid container spacing={1} columns={12}>
                    <Grid item md={6} container direction="column" spacing={2} ml={1} mt={1}>
                        <Typography style={{fontSize: 20,  fontWeight: "bold"}} >
                            {idNamePair.name} 
                        </Typography>
                        <div>
                        <Typography display="inline" style={{fontSize: 13,  fontWeight: "bold"}} mt={1}>
                            By: &nbsp; &nbsp;
                        </Typography>
                        <Typography display="inline" style={{fontSize: 13,  fontWeight: "bold", color:"blue", textDecorationLine:"underline",}} mt={1}>
                            {idNamePair.ownerName} 
                        </Typography>
                        </div>
                    </Grid>
                    <Grid item md={1} mt={2}>
                        <IconButton disabled = {auth.guest} id = "thumb-up-button" size = "small" sx = {{ml:4}} 
                        onClick={(event) => {handleLike(event, idNamePair._id)}}>
                            <ThumbUpIcon fontSize="large" style={{color: likeColor}} />
                        </IconButton>
                    </Grid>
                    <Grid item md={1} mt={3}>
                        <Typography style={{fontSize: 20,  fontWeight: "bold"}} >
                            {idNamePair.like}
                        </Typography>
                    </Grid>
                    <Grid item md={1} mt={2}>
                        <IconButton disabled = {auth.guest} id = "thumb-down-button" size = "small" sx = {{ml:4}}
                        onClick={(event) => {handleDislike(event, idNamePair._id)}}>
                            <ThumbDownIcon fontSize="large" style={{color: dislikeColor}}/>
                        </IconButton>
                    </Grid>
                    <Grid item md={1} mt={3}>
                        <Typography style={{fontSize: 20,  fontWeight: "bold"}} >
                            {idNamePair.dislike}
                        </Typography>
                    </Grid>
                    <Grid item md={1} mt={2}>
                        {deleteButton}
                    </Grid>
                    {editOrPublish}
                    <Grid item md={2}></Grid>
                    <Grid item md={1}  ml={5}>
                        <Typography style={{fontSize: 20,  fontWeight: "bold"}} ml={2} mt={2}>
                            Views: 
                        </Typography>
                    </Grid>
                    <Grid item md={1} >
                        <Typography style={{fontSize: 20,  fontWeight: "bold", color:"red"}} mt={2}>
                            {idNamePair.view}
                        </Typography>
                    </Grid>
                    <Grid item md={1} mt={2}>
                        <IconButton 
                            id = "expand-more-button" 
                            size = "small" 
                            sx = {{ml:7}}
                            onClick = {(event)=> {handleToggleExpand(event); handleIncreaseView(event, idNamePair._id)}}
                        >
                            <ExpandMoreIcon fontSize="large"/>
                        </IconButton>
                    </Grid>
                </Grid>
            </ListItem>

        if(expandActive){
            cardElement = 
                <ListItem 
                    sx={{ 
                        width: '100%', 
                        display: 'flex', 
                        bgcolor:listBackground, 
                        border: 1,
                        borderRadius: 3, 
                        borderColor: 'black',
                        margin: 2
                    }}
                >
                    <Grid container spacing={1} columns={12}>
                        <Grid item md={6} container direction="column" spacing={2} ml={1} mt={1}>
                            <Typography style={{fontSize: 20,  fontWeight: "bold"}} >
                                {idNamePair.name} 
                            </Typography>
                            <div>
                            <Typography display="inline" style={{fontSize: 13,  fontWeight: "bold"}} mt={1}>
                                By: &nbsp; &nbsp;
                            </Typography>
                            <Typography display="inline" style={{fontSize: 13,  fontWeight: "bold", color:"blue", textDecorationLine:"underline",}} mt={1}>
                                {idNamePair.ownerName} 
                            </Typography>
                            </div>
                        </Grid>
                        <Grid item md={1} mt={2}>
                            <IconButton disabled = {auth.guest} id = "thumb-up-button" size = "small" sx = {{ml:5}} 
                            onClick={(event) => {handleLike(event, idNamePair._id)}}>
                                <ThumbUpIcon fontSize="large" style={{color: likeColor}}/>
                            </IconButton>
                        </Grid>
                        <Grid item md={1} mt={3}>
                            <Typography style={{fontSize: 20,  fontWeight: "bold"}} >
                                {idNamePair.like}
                            </Typography>
                        </Grid>
                        <Grid item md={1} mt={2}>
                            <IconButton disabled = {auth.guest} id = "thumb-down-button" size = "small" sx = {{ml:5}}
                            onClick={(event) => {handleDislike(event, idNamePair._id)}}>
                                <ThumbDownIcon fontSize="large" style={{color: dislikeColor}}/>
                            </IconButton>
                        </Grid>
                        <Grid item md={1} mt={3}>
                            <Typography style={{fontSize: 20,  fontWeight: "bold"}} >
                                {idNamePair.dislike}
                            </Typography>
                        </Grid>
                        <Grid item md={1} mt={2}>
                            {deleteButton}
                        </Grid>

                        <Grid item md={6}>
                            <Box sx={{bgcolor:'#2C2F70', borderRadius:2}}>
                                <Typography ml={1} my={1} style={{fontSize: 25,  fontWeight: "bold", color:"#D4AF37"}}>1.  {idNamePair.items[0]}</Typography>
                                <Typography ml={1} my={1} style={{fontSize: 25,  fontWeight: "bold", color:"#D4AF37"}}>2.  {idNamePair.items[1]}</Typography>
                                <Typography ml={1} my={1} style={{fontSize: 25,  fontWeight: "bold", color:"#D4AF37"}}>3.  {idNamePair.items[2]}</Typography>
                                <Typography ml={1} my={1} style={{fontSize: 25,  fontWeight: "bold", color:"#D4AF37"}}>4.  {idNamePair.items[3]}</Typography>
                                <Typography ml={1} my={1} style={{fontSize: 25,  fontWeight: "bold", color:"#D4AF37"}}>5.  {idNamePair.items[4]}</Typography>
                            </Box>
                        </Grid>

                        <Grid item md={6}>
                            <div id="comment-list">
                                <List>
                                {
                                    idNamePair.comments.map((comment) => (
                                        <CommentCard
                                            user={comment[0]}
                                            comment={comment[1]}
                                            selected={false}
                                        />
                                    ))
                                }       
                                </List>
                            </div>
                            <TextField
                                disabled = {auth.guest}
                                fullWidth
                                id="add-comment-field"
                                name="add-comment-field"
                                label="Add Comment"
                                size="small"
                                autoFocus
                                inputProps = {{style:{fontSize:20, fontWeight: "bold"}}}
                                sx = {{width: '95%', bottom: '7%', borderRadius:3, bgcolor:'#FFFFFF'}}
                                onKeyPress = {(event)=>{handlePostComment(event, idNamePair._id)}}
                            />
                        </Grid>

                        {editOrPublish}
                        <Grid item md={2}></Grid>
                        <Grid item md={1}  ml={5}>
                            <Typography style={{fontSize: 20,  fontWeight: "bold"}} ml={2} mt={2}>
                                Views: 
                            </Typography>
                        </Grid>
                        <Grid item md={1} >
                            <Typography style={{fontSize: 20,  fontWeight: "bold", color:"red"}} mt={2}>
                                {idNamePair.view}
                            </Typography>
                        </Grid>
                            <Grid item md={1} mt={2}>
                            <IconButton 
                                id = "expand-less-button" 
                                size = "small" 
                                sx = {{ml:7}}
                                onClick = {(event)=>{handleToggleExpand(event)}}
                            >
                                <ExpandLessIcon fontSize="large"/>
                            </IconButton>
                        </Grid>
                    </Grid>
                </ListItem>
        }
    }
    
    return (
        cardElement
    );
}

export default ListCard;