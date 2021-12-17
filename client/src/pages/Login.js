import { useContext, useState } from "react"
import { Form, Button } from "semantic-ui-react"
import gql from 'graphql-tag'
import { useMutation } from "@apollo/client"
import { Navigate, useNavigate } from "react-router-dom"

import { AuthContext } from "../context/auth"
import { useForm } from "../util/hooks"

const Login = () => {

    const context = useContext(AuthContext);
    const navigate = useNavigate();

    const [errors, setErrors] = useState({});

    const { onChange, onSubmit, values } = useForm(loginTheUser, {
        email: '',
        password: ''
    })

    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        update(_, result) {
            context.login(result.data.login);
            navigate('/');
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.errors ? err.graphQLErrors[0].extensions.errors : err);
        },
        variables: values
    })

    function loginTheUser() {
        loginUser();
    }

    return (context.user) ? (
        <Navigate to="/" />
    ) : (
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
                <h1>Login</h1>
                <Form.Input
                    label="Email"
                    name="email"
                    type="email"
                    value={values.email}
                    error={errors.email ? true : false}
                    onChange={onChange}
                />
                <Form.Input
                    label="Password"
                    name="password"
                    type="password"
                    value={values.password}
                    error={errors.password ? true : false}
                    onChange={onChange}
                />
                <Button type="submit" color='violet'>
                    Login
                </Button>
            </Form>
            {Object.keys(errors).length > 0 && (
                <div className="ui error message">
                    <ul className="list">
                        {Object.values(errors).map(value => (
                            <li key={value}>
                                {value}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

const LOGIN_USER = gql`
    mutation login(
        $email: String!
        $password: String!
    ) {
        login(
            email: $email
            password: $password
        ) {
            id email username token
        }
    }
`

export default Login
