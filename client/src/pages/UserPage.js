import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { Grid, Transition } from 'semantic-ui-react';

import PostCard from '../components/PostCard';

const UserPage = () => {

    let { username } = useParams();

    const { loading, data } = useQuery(FETCH_POSTS_BY_USER_QUERY, {
        variables: {
            username
        }
    });

    let postMarkup;
    if (!data) {
        postMarkup = <p>Loading ...</p>
    } else {
        let reverseData = [...data.getPostsByUser];
        reverseData.reverse();

        postMarkup =
            (
                <Grid columns={1}>
                    <Grid.Column>
                        <Grid.Row>
                            <h1 style={{ display: 'block', marginBottom: '10px', fontSize: '2rem' }}>
                                Posts by {username}
                            </h1>
                        </Grid.Row>
                        {loading ? (
                            <h1>Loading posts</h1>
                        ) : (<Transition.Group>{
                            reverseData && reverseData.map((post) => (
                                <Grid.Row key={post.id}>
                                    <PostCard post={post} />
                                </Grid.Row>
                            ))
                        }</Transition.Group>)}
                    </Grid.Column>
                </Grid>
            )
    }
    return postMarkup;
}

const FETCH_POSTS_BY_USER_QUERY = gql`
    query($username: String!){
        getPostsByUser(username: $username){
            id
            body
            createdAt
            username
            likeCount
            likes{
                username
            }
            commentCount
            comments{
                id
                username
                createdAt
                body
            }
        }
    }
`

export default UserPage
