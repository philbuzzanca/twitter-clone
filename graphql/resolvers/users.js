const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const { validateRegisterInput, validateLoginInput } = require('../../util/validators');
const { SECRET_KEY } = require('../../config');
const User = require('../../models/User');

function generateToken(user){
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, SECRET_KEY, { expiresIn: '1h'});
}

module.exports = {
    Mutation: {
        async login(_, { email, password }){
            const { errors, valid } = validateLoginInput(email, password);

            if(!valid){
                throw new UserInputError('Errors', { errors });
            }


            const user = await User.findOne({ email });
            if(!user){
                errors.general = 'Invalid login';
                throw new UserInputError('Invalid login', { errors });
            }

            const match = await bcrypt.compare(password, user.password);
            if(!match){
                errors.general = 'Invalid login';
                throw new UserInputError('Invalid login', { errors });
            }

            const token = generateToken(user);

            return {
                ...user._doc,
                id: user._id,
                token
            };
        },

        async register(_, { registerInput: { username, email, password, confirmPassword } }){
            // Validate user data
            const { errors, valid } = validateRegisterInput(username, email, password, confirmPassword);
            if(!valid){
                throw new UserInputError('Error', { errors });
            }
            
            // make sure user/email doesn't already exist
            const user = await User.findOne({ username });
            if(user){
                throw new UserInputError('Username is taken', {
                    errors: {
                        username: 'This username is taken.'
                    }
                });
            }
            const checkEmail = await User.findOne({ email });
            if(checkEmail){
                throw new UserInputError('Email already in use', {
                    errors: {
                        email: 'This email is already registered.'
                    }
                });
            }

            // hash password and create auth token
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString(),
            });

            const res = await newUser.save();

            const token = generateToken(res);

            return {
                ...res._doc,
                id: res._id,
                token
            };
        }
    }
}