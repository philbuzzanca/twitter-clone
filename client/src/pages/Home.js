import { useQuery } from "@apollo/client";
import { Grid } from "semantic-ui-react";
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
        <div>
            <Grid columns={1}>
                <Grid.Column>
                    <Grid.Row>
                        <h1 style={{ display: 'block', marginBottom: '10px', fontSize: '2rem' }}>
                            Recent posts
                        </h1>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <PostForm />
                        </Grid.Column>
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
        </div>
    ) : (
        <div>
            <h1>Login or Register!</h1>
        </div>
    )
    return homePage;
}

export default Home