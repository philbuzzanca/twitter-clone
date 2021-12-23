import { useQuery } from "@apollo/client";
import { Grid, Transition } from "semantic-ui-react";
import { useContext } from "react";

import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { AuthContext } from "../context/auth";
import { FETCH_POSTS_QUERY } from "../util/graphql";

const Home = () => {
    const {
        loading,
        data
    } = useQuery(FETCH_POSTS_QUERY);

    const { user } = useContext(AuthContext);

    const homePage = user ? (
        <Grid columns={1}>
            <Grid.Column>
                <Grid.Row>
                    <PostForm className='postForm' />
                </Grid.Row>
                <Grid.Row>
                    <h1 style={{ display: 'block', marginBottom: '10px', fontSize: '2rem' }}>
                        Recent posts
                    </h1>
                </Grid.Row>
                {loading ? (
                    <h1>Loading posts</h1>
                ) : (<Transition.Group>{
                    data.getPosts && data.getPosts.map((post) => (
                        <Grid.Row key={post.id}>
                            <PostCard post={post} />
                        </Grid.Row>
                    ))
                }</Transition.Group>)}
            </Grid.Column>
        </Grid>
    ) : (
        <div>
            <h3 style={{ marginTop: "2rem" }}><a href="/login">Login</a> or <a href="/register">Register!</a></h3>
        </div>
    )
    return homePage;
}

export default Home