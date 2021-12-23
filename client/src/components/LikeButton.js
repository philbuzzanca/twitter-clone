import { Button, Icon, Label } from "semantic-ui-react"
import { useMutation } from "@apollo/client"
import gql from "graphql-tag"
import { useEffect, useState } from "react"

const LikeButton = ({ post: { id, likeCount, likes }, user }) => {
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        if (user && likes.find(like => like.username === user.username)) {
            setLiked(true);
        } else setLiked(false)
    }, [user, likes]);

    const [likePost] = useMutation(LIKE_POST_MUTATION, {
        variables: { postId: id }
    })

    const likeButton = liked ? (
        <Button color='violet'>
            <Icon name='heart' />
        </Button>
    ) : (
        <Button color='violet' basic>
            <Icon name='heart' />
        </Button>
    )

    return (
        <Button as='div' labelPosition='right' onClick={likePost}>
            {likeButton}
            <Label basic color='violet' pointing='left'>
                {likeCount}
            </Label>
        </Button>
    )
}

const LIKE_POST_MUTATION = gql`
    mutation likePost($postId: ID!){
        likePost(postId: $postId){
            id
            likes{
                id username
            }
            likeCount
        }
    }
`

export default LikeButton
