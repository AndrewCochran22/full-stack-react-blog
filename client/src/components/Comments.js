import { Button, TextField } from '@material-ui/core'
import React, { useState } from 'react'

export default function Comments(props) {
    const [ showForm, setShowForm ] = useState(false);
    const [ text, setText ] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`/api/v1/posts/${props.postId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text,
            }),
        })
        .then(res=> res.json())
        .then(data => {
            if (data.error) {
                alert(data.error)
            } else {
                alert('Comment Submitted')
            }
        })
    }

    return (
        <div>
            <div>comments coming soon</div>
            <div>
                { showForm ? (
                    <form onSubmit={handleSubmit}>
                        <TextField label="Comment" type="text" onChange={(e) => setText(e.target.value)} value={text} name="title" fullWidth required /><br />
                        <Button type="submit" variant="contained" color="primary">Submit</Button>
                    </form>
                ) : (
                    <Button variant="contained" 
                    color="primary" 
                    onClick={() => setShowForm(!showForm)}>
                        Add Comment
                    </Button>
                )}
            </div>
        </div>
    )
}
