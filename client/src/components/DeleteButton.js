import { Icon, Confirm } from 'semantic-ui-react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { FETCH_POSTS_QUERY } from '../util/graphql'

const DeleteButton = ({ postId, commentId, callback, }) => {

    const [open, setOpen] = useState(false)

    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

    const [deletePostOrComment] = useMutation(mutation, {
        update(proxy) {
            setOpen(false);
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            });

            if (!commentId) {
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
            }

            if (callback) callback();
        },
        variables: {
            postId,
            commentId
        }
    })

    return (
        <>
            <Icon
                style={{ float: 'right', marginTop: '0.6rem', cursor: 'pointer', opacity: '67%' }}
                onClick={() => {
                    setOpen(true);
                }}
                name='trash' />
            <Confirm
                open={open}
                onCancel={() => setOpen(false)}
                onConfirm={deletePostOrComment} />
        </>
    )
}

const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId: ID!){
        deletePost(postId: $postId)
    }
`

const DELETE_COMMENT_MUTATION = gql`
    mutation deleteComment($postId: ID!, $commentId: ID!){
        deleteComment(postId: $postId, commentId: $commentId){
            id
            comments{
                id
                username
                createdAt
                body
            }
            commentCount
        }
    }
`

export default DeleteButton
