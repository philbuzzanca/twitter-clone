import { Card, Image, Button, Icon, Label } from "semantic-ui-react"
import moment from 'moment'
import { Link } from "react-router-dom"
import { useContext } from "react"

import { AuthContext } from "../context/auth"
import LikeButton from "./LikeButton"

const PostCard =
    ({ post: { body, createdAt, id, username, likes, likeCount, commentCount, comments } }) => {
        const { user } = useContext(AuthContext);

        const commentOnPost = () => {

        }

        return (
            <Card>
                <Card.Content>
                    <Image
                        floated='right'
                        size='mini'
                        src='https://react.semantic-ui.com/images/avatar/large/steve.jpg'
                    />
                    <Card.Header>{username}</Card.Header>
                    <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow(true)}</Card.Meta>
                    <Card.Description>
                        {body}
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <Button as={Link} to={`/posts/${id}`} labelPosition='right'>
                        <Button color='blue' basic>
                            <Icon name='comments' />
                        </Button>
                        <Label basic color='blue' pointing='left' onClick={commentOnPost}>
                            {commentCount}
                        </Label>
                    </Button>
                    <LikeButton user={user} post={{id, likeCount, likes}} />
                    {user.username === username && (
                        <Link to={'/'} onClick={()=>{}}>
                        <Icon name='trash' style={{float: 'right', marginTop: '0.6rem'}}/>
                        </Link>
                    )}
                </Card.Content>
            </Card>
        )
    }

export default PostCard
