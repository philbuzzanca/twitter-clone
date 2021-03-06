import { Button, Form } from "semantic-ui-react"
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";

import { useForm } from "../util/hooks"
import { FETCH_POSTS_QUERY } from "../util/graphql";

const PostForm = () => {

    const { values, onChange, onSubmit } = useForm(createPostCallback, {
        body: ''
    });

    const [createPost, { error }] = useMutation(CREATE_POST_MUSTATION, {
        variables: values,
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            })
            proxy.writeQuery({
                query: FETCH_POSTS_QUERY,
                data: {
                    getPosts: [result.data.createPost, ...data.getPosts],
                }
            })
            values.body = '';
        }
    });

    function createPostCallback() {
        createPost();
    }

    return (
        <>
            <Form onSubmit={onSubmit}>
                <h3>Create a post:</h3>
                <Form.Field className="createPostForm">
                    <Form.Group>
                        <Form.Input className="createPostFormInput"
                            name="body"
                            onChange={onChange}
                            value={values.body}
                            error={error ? true : false}
                        />
                        <Button
                            type="submit"
                            color="violet"
                            disabled={values.body.trim() === ''}
                        >
                            Submit
                        </Button>
                    </Form.Group>
                </Form.Field>
            </Form>
            {error && (
                <div className="ui error message">
                    <ul className="list">
                        <li>{error.graphQLErrors[0].message}</li>
                    </ul>
                </div>
            )}
        </>
    )
}

const CREATE_POST_MUSTATION = gql`
mutation createPost($body: String!){
    createPost(body: $body){
        id body createdAt username
        likes{
            id
            username
            createdAt
        }
        likeCount
        comments{
            id body username createdAt
        }
        commentCount
    }
}
`

export default PostForm
