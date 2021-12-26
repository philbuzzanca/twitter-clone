import { Icon, Confirm } from 'semantic-ui-react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { FETCH_POSTS_QUERY } from '../util/graphql'

const DeleteButton = ({ postId, callback }) => {

    const [open, setOpen] = useState(false)

    const [deletePost] = useMutation(DELETE_POST_MUTATION, {
        update(proxy) {
            setOpen(false);
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            });

            let newData = [...data.getPosts]
            newData = newData.filter(p => p.id !== postId);
            proxy.writeQuery({
                query: FETCH_POSTS_QUERY,
                data: {
                    ...data,
                    getPosts: {
                        newData
                    }
                }
            });
            
            if (callback) callback();
        },
        variables: {
            postId
        }
    })

    return (
        <>
            <Icon
                style={{float: 'right', marginTop: '0.6rem', cursor: 'pointer', opacity: '67%'}}
                onClick={() => {
                    setOpen(true);
                }}
                name='trash' />
            <Confirm
                open={open}
                onCancel={() => setOpen(false)}
                onConfirm={deletePost} />
        </>
    )
}

const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId: ID!){
        deletePost(postId: $postId)
    }
`

export default DeleteButton
