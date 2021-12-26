import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import { Button, Card, Grid, Icon, Image, Label } from 'semantic-ui-react';
import moment from 'moment';
import { useContext } from 'react';

import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';
import { AuthContext } from '../context/auth';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const SinglePost = ({ props }) => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    let { postId } = useParams();
    const { data } = useQuery(FETCH_POST_QUERY, {
        variables: {
            postId
        }
    })

    function deletePostCallback(){
        navigate('/');
    }

    let postMarkup;
    if (!data) {
        postMarkup = <p>Loading post...</p>
    } else {
        const { id, body, createdAt, username, likes, likeCount, commentCount } = data.getPost;
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
                            <Card.Header>{username}</Card.Header>
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
                            {user.username === username && <DeleteButton postId={id} callback={deletePostCallback}/>}
                        </Card.Content>
                    </Card>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
    return postMarkup;
}

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
