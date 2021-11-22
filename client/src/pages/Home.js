import { useQuery } from "@apollo/client";
import { Grid } from "semantic-ui-react";
import gql from 'graphql-tag';

import PostCard from "../components/PostCard";

const Home = () => {
    const {
        loading,
        data
    } = useQuery(FETCH_POSTS_QUERY);
    return (
        <Grid columns={1}>
            <Grid.Column>
                <Grid.Row>
                    <h1>Recent posts</h1>
                </Grid.Row>
                <Grid.Row>
                    {loading ? (
                        <h1>Loading posts</h1>
                    ) : (
                        data.getPosts && data.getPosts.map((post) => (
                            <PostCard post={post} key={post.id} />
                        ))
                    )}
                </Grid.Row>
            </Grid.Column>
        </Grid>
    )
}

const FETCH_POSTS_QUERY = gql`
    {
        getPosts{
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
export default Home