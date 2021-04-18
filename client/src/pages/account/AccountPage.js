import React from "react";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import './AccountPage.css'
import {Card, message} from "antd";
import cookies from "react-cookies";


class AccountPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            firstName: 'First Name',
            lastName: 'Last Name',
            password: '',
            firstNameError: '',
            lastNameError: '',
            passwordError: ''
        }
    }

    fetchUserInfo = () => {
        fetch('http://localhost:8000/api/user',{
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        })
        .then((res) => res.json())
        .then(res => {
            if (res.data.msg === 'success') {
                this.setState({
                    email: res.user.email,
                    firstName: res.user.firstName,
                    lastName: res.user.lastName
                })
                this.user = res.user
            } else if (res.msg === 'Unauthorized') {
                cookies.remove('token')
                this.props.history.push('/')
            } else {
                message.error(res.msg)
            }
        }).catch(e => {
            message.error(e.message)
        })
    }

    handleUpdate = (e) => {
        e.preventDefault()
        if (this.state.firstNameError !== ''
            || this.state.lastNameError !== '') {
            message.error("First name and last name could not be empty.")
            return
        }
        if (this.state.password !== '' && (this.state.password.length < 8 || this.state.password.length > 24)) {
            this.setState({
                passwordError: 'Password should be 8-24 characters long.'
            })
            return
        }

        const data = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            password: this.state.password
        }
        console.log(data)
        fetch('http://localhost:8000/api/user', data,{
            method: "PUT",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        })
        .then((res) => res.json())
        .then(res => {
            console.log(res)
            if (res.msg === 'success') {
                message.success('Success')
            } else if (res.msg === 'Unauthorized') {
                cookies.remove('token')
                this.props.history.push('/')
            } else {
                message.error(res.msg)
            }
        }).catch(e => {
            message.error(e.message)
        })
    }


    componentDidMount() {
        this.fetchUserInfo()
    }


    onFirstNameBlur = (e) => {
        this.setState({
            firstNameError: e.target.value === '' ? 'First name could not be empty.' : ''
        })
    }

    onLastNameBlur = (e) => {
        this.setState({
            lastNameError: e.target.value === '' ? 'Last name could not be empty.' : ''
        })
    }

    onPasswordChange = (e) => {
        this.setState({
            password: e.target.value
        })
    }

    onFirstNameChange = (e) => {
        this.setState({
            firstName: e.target.value
        })
    }

    onLastNameChange = (e) => {
        this.setState({
            lastName: e.target.value
        })
    }

    render() {
        return (
            <div id='account-page-container'>
                <Card id="account-setting-card" variant="outlined" title='Account Settings'>
                    <Container component="main" maxWidth="xs">
                        <CssBaseline/>
                        <div className='account-setting-form'>
                            <form className='user-info-update-form' noValidate onSubmit={this.handleUpdate}>
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
                                    disabled
                                    value={this.state.email}
                                />
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
                                    onBlur={this.onFirstNameBlur}
                                    error={this.state.firstNameError !== ''}
                                    helperText={this.state.firstNameError}
                                    onChange={this.onFirstNameChange}
                                    value={this.state.firstName}
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
                                    onBlur={this.onLastNameBlur}
                                    error={this.state.lastNameError !== ''}
                                    helperText={this.state.lastNameError}
                                    onChange={this.onLastNameChange}
                                    value={this.state.lastName}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    size='small'
                                    onChange={this.onPasswordChange}
                                    value={this.state.password}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className='update-submit-button'
                                >
                                    Update
                                </Button>
                            </form>
                        </div>
                    </Container>
                </Card>
            </div>
        )
    }
}

export default AccountPage