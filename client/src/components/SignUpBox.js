import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import "./SignUpBox.css"
import { useHistory } from "react-router-dom";
import {validateEmail, validatePassword} from "../utils/utils";
import {message} from "antd";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function SignUp(props) {
    const classes = useStyles();
    const history = useHistory();

    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');

    const onPasswordBlur = (e) => {
        setPasswordError(validatePassword(e.target.value))
    }

    const onEmailBlur = (e) => {
        setEmailError(validateEmail(e.target.value))
    }

    const onFirstNameBlur = (e) => {
        if (e.target.value === '') setFirstNameError('First name could not be empty.');
        else setFirstNameError('')
    }

    const onLastNameBlur = (e) => {
        if (e.target.value === '') setLastNameError('Last name could not br empty.');
        else setLastNameError('')
    }

    const handleSignUp = (e) => {
        e.preventDefault()
        if (emailError !== '' || passwordError !== '' || firstNameError !== '' || lastNameError !== '') {
            message.error("Please check warnings before you submit.")
            return
        }

        let form = e.target

        fetch('/api/user/new', {
            method:"POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({email: form.email.value,
            firstName: form.firstName.value,
            lastName: form.lastName.value,
            password: form.password.value})
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.msg === 'success') {
                history.push('/files')
            } else {
                message.error(res.msg)
            }
        }).catch((err) => {
            message.error("Error signing up, please try again later. " + err)
        })
    }

    return (
        <Card className={classes.root} id="sign-up-card" variant="outlined">
            <CardContent>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <div className={classes.paper + ' sign-up-form-div'}>
                        <Avatar className={classes.avatar}>
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign Up
                        </Typography>
                        <form className={classes.form} noValidate onSubmit={handleSignUp}>
                            <TextField
                                variant="outlined"
                                margin="dense"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                name="firstName"
                                autoFocus
                                size='small'
                                onBlur={onFirstNameBlur}
                                error={firstNameError !== ''}
                                helperText={firstNameError}
                            />
                            <TextField
                                variant="outlined"
                                margin="dense"
                                required
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                size='small'
                                onBlur={onLastNameBlur}
                                error={lastNameError !== ''}
                                helperText={lastNameError}
                            />
                            <TextField
                                variant="outlined"
                                margin="dense"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                size='small'
                                onBlur={onEmailBlur}
                                error={emailError !== ''}
                                helperText={emailError}
                            />
                            <TextField
                                variant="outlined"
                                margin="dense"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                size='small'
                                onBlur={onPasswordBlur}
                                error={passwordError !== ''}
                                helperText={passwordError}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                Sign Up
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                </Grid>
                                <Grid item>
                                    <a href="/" onClick={props.switchToSignIn}>
                                        {"Sign In"}
                                    </a>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                </Container>
            </CardContent>
        </Card>
    );
}