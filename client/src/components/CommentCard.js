import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';

function CommentCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { user, comment } = props;

    let thisComment = 
            <ListItem 
                sx={{ 
                    size: "small",
                    width: '95%', 
                    display: 'flex', 
                    bgcolor:'#D4AF37', 
                    border: 2,
                    borderRadius: 3, 
                    borderColor: 'black',
                    marginBottom: 2
                }}
            >
                <Box>
                    <Typography style={{fontSize: 15,  fontWeight: "bold", color:'blue', textDecorationLine:"underline"}} >
                        {user}
                    </Typography>
                    <Typography style={{fontSize: 18,  fontWeight: "normal"}} >
                        {comment} 
                    </Typography>
                </Box>
            </ListItem>;

    return(thisComment);
}
export default CommentCard;