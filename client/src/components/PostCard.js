import { Card, Icon, Label } from "semantic-ui-react"

const PostCard =
  ({ post: { body, id, createdAt, username, likes, likeCount, commentCount, comments }}) => {
    return (
        <Card>
            <Card.Content header={username}/>
            <Card.Content description={ body }/>
            <Card.Content extra>
                {createdAt.substring(0,10)}
            </Card.Content>
        </Card>
    )
}

export default PostCard
