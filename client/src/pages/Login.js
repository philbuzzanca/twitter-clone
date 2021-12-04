import { useState } from "react"
import { Form, Button } from "semantic-ui-react"
import gql from 'graphql-tag'
import { useMutation } from "@apollo/client"
import { useNavigate } from "react-router-dom"

const Login = () => {

    const navigate = useNavigate();

    const [errors, setErrors] = useState({});

    const [values, setValues] = useState({
        email: '',
        password: '',
    })

    const onChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value })
    }

    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        update(_, result) {
            console.log(result);
            navigate('/');
        },
        onError(err) {
            console.log(err);
            setErrors(err.graphQLErrors[0].extensions.errors ? err.graphQLErrors[0].extensions.errors : err);
        },
        variables: values
    })

    const onSubmit = (event) => {
        event.preventDefault();
        loginUser();
    }

    return (
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
