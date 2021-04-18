import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import "./SignInBox.css"
import {validateEmail, validatePassword} from '../utils/utils'
import {message} from 'antd'
import { useHistory } from "react-router-dom";

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

export default function SignIn(props) {
    const classes = useStyles();

    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')

    const emailOnBlur = (e) => {
        setEmailError(validateEmail(e.target.value))
    }

    let history = useHistory()

    const passwordOnBlur = (e) => {
        setPasswordError(validatePassword(e.target.value))
    }

    const handleSignIn = (e) => {
        e.preventDefault()
        if (emailError !== '' || passwordError !== '') {
            message.error("Please enter correct email and password.")
            return
        }
        let form = e.target
        fetch('http://localhost:8000/api/user/sign_in', {
            method:"post",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body:JSON.stringify({
                email: form.email.value,
                password: form.password.value
            })
        })
        .then((res) => res.json())
        .then(
            (res) => {
                console.log(res);
                if (res.msg === 'success') {
                    localStorage.setItem('token',res.token);
                    history.push('/files')
                } else {
                    message.error(res.msg)
                }
            }
        ).catch((err) => {
            console.log(err);
            message.error("Error signing you in, please try again later. " + err)
        })
    }
    return (
        <Card className={classes.root} id="sign-in-card" variant="outlined">
            <CardContent>
                <Container component="main" maxWidth="xs">
                    <CssBaseline/>
                    <div className={classes.paper + ' sign-in-form-div'}>
                        <Avatar className={classes.avatar}>
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <form className={classes.form} noValidate onSubmit={handleSignIn}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                size='small'
                                error={emailError !== ''}
                                helperText={emailError}
                                onBlur={emailOnBlur}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                size='small'
                                autoComplete="current-password"
                                error={passwordError !== ''}
                                helperText={passwordError}
                                onBlur={passwordOnBlur}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                Sign In
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    {/*<Link href="#" variant="body2">*/}
                                    {/*    Forgot password?*/}
                                    {/*</Link>*/}
                                </Grid>
                                <Grid item>
                                    <a href="/" onClick={props.switchToSignUp}>
                                        {"Sign Up"}
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