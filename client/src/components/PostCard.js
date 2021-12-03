import { Card, Image, Button, Icon, Label } from "semantic-ui-react"
import moment from 'moment'
import { Link } from "react-router-dom"

const PostCard =
    ({ post: { body, createdAt, id, username, likes, likeCount, commentCount, comments } }) => {

        const likePost = () => {

        }

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
                    <Button as='div' labelPosition='right'>
                        <Button color='blue' basic>
                            <Icon name='comments' />
                        </Button>
                        <Label basic color='blue' pointing='left' onClick={commentOnPost}>
                            {commentCount}
                        </Label>
                    </Button>
                    <Button as='div' labelPosition='right' onClick={likePost}>
                        <Button color='violet' basic>
                            <Icon name='heart' />
                        </Button>
                        <Label basic color='violet' pointing='left  '>
                            {likeCount}
                        </Label>
                    </Button>
                </Card.Content>
            </Card>
        )
    }

export default PostCard
