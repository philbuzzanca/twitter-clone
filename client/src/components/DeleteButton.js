import { Icon, Confirm } from 'semantic-ui-react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'
import { useState } from 'react'

const DeleteButton = ({ postId }) => {

    const [open, setOpen] = useState(false)

    const [deletePost] = useMutation(DELETE_POST_MUTATION, {
        update(proxy) {
            setOpen(false);
        },
        variables: {
            postId
        }
    })

    return (
        <>
            <Icon
                style={{float: 'right', marginTop: '0.6rem'}}
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
