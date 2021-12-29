import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/client';
import { Button, Card, Form, Grid, Icon, Image, Label } from 'semantic-ui-react';
import moment from 'moment';
import { useContext, useRef, useState } from 'react';

import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';
import { AuthContext } from '../context/auth';
import { useParams } from 'react-router-dom';
import { Navigate, useNavigate, Link } from 'react-router-dom';


const SinglePost = () => {
    const { user } = useContext(AuthContext);
    const commentInputRef = useRef(null);
    const navigate = useNavigate();
    let { postId } = useParams();

    const [comment, setComment] = useState('');

    const { data } = useQuery(FETCH_POST_QUERY, {
        variables: {
            postId
        }
    })

    const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
        update() {
            setComment('');
            commentInputRef.current.blur();
        },
        variables: {
            postId,
            body: comment
        }
    })

    function deletePostCallback() {
        navigate('/');
    }

    let postMarkup;


    if (!data) {
        postMarkup = <p>Loading post...</p>
    } else {
        const { id, body, createdAt, username, likes, likeCount, comments, commentCount } = data.getPost;
        let reverseComments = [...comments];
        reverseComments = reverseComments.reverse();

        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image
                            src='https://react.semantic-ui.com/images/avatar/large/steve.jpg'
                            size="small"
                            float="right" />
                    </Grid.Column>
                    <Grid.Column width={10} ><Card>
                        <Card.Content>
                            <Card.Header as={Link} to={`/user/${username}`}>{username}</Card.Header>
                            <Card.Meta as='div'>{moment(createdAt).fromNow(true)}</Card.Meta>
                            <Card.Description>
                                {body}
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <Button as='div' labelPosition='right'>
                                <Button color='blue'>
                                    <Icon name='comments' />
                                </Button>
                                <Label as='div' basic color='blue' pointing='left'>
                                    {commentCount}
                                </Label>
                            </Button>
                            <LikeButton user={user} post={{ id, likeCount, likes }} />
                            {user && user.username === username && <DeleteButton postId={id} callback={deletePostCallback} />}
                        </Card.Content>
                    </Card>
                        {user &&
                            <Card fluid>
                                <Card.Content>
                                    <p>Post a comment</p>
                                    <Form>
                                        <div className="ui action input fluid">
                                            <input
                                                type="text"
                                                name="comment"
                                                value={comment}
                                                onChange={event => setComment(event.target.value)}
                                                ref={commentInputRef}
                                            />
                                            <button type="submit"
                                                className="ui button violet"
                                                disabled={comment.trim() === ''}
                                                onClick={submitComment}
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </Form>
                                </Card.Content>
                            </Card>}
                        {reverseComments.map(comment => (
                            <Card fluid key={comment.id}>
                                <Card.Content>
                                    {user && user.username === comment.username && (
                                        <DeleteButton postId={id} commentId={comment.id} />
                                    )}
                                    <Card.Header as={Link} to={`/user/${comment.username}`}>{comment.username}</Card.Header>
                                    <Card.Meta>{moment(comment.createdAt).fromNow(true)}</Card.Meta>
                                    <Card.Description>{comment.body}</Card.Description>
                                </Card.Content>
                            </Card>
                        ))}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
    return postMarkup;
}

const SUBMIT_COMMENT_MUTATION = gql`
    mutation($postId: ID!, $body: String!){
        createComment(postId: $postId, body: $body){
            id
            comments{
                id body createdAt username
            }
            commentCount
        }
    }
`

const FETCH_POST_QUERY = gql`
    query($postId: ID!){
        getPost(postId: $postId){
            id body createdAt username likeCount
            likes{
                username
            }
            commentCount
            comments{
                id username createdAt body
            }
        }
    }
`

export default SinglePost
