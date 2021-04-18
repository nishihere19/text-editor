import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '../assets/img/avatar.webp';
import MoreIcon from '@material-ui/icons/MoreVert';
import './AppBar.css'
import {Link, useHistory, useLocation} from 'react-router-dom'
import {Button} from "antd";
import {setSearchKeyWord} from "../actions";
import {connect} from 'react-redux'
import InputBase from "@material-ui/core/InputBase";

const useStyles = makeStyles((theme) => ({
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
        color: 'black',
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: 'rgb(241, 243, 244)',
        marginRight: theme.spacing(2),
        marginLeft: 0,
        maxWidth: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: '420px',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgb(95, 99, 104)'
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
        color: 'rgb(95, 99, 104)',
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
            alignItems: 'center'
        },
    },
    sectionMobile: {
        display: 'flex',
        color: 'rgb(95, 99, 104)',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
}));

function NavBar(props) {
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const menuId = 'primary-search-account-menu';
    const handleSignOut = () => {
        props.cleanup().then().catch().then(() => {
            localStorage.setItem('token',"");
            history.push('/')
        })
    }

    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            id={menuId}
            keepMounted
            transformOrigin={{vertical: 'top', horizontal: 'right'}}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <Link to='/account'><MenuItem>My account</MenuItem></Link>
            <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{vertical: 'top', horizontal: 'right'}}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <Link to='/account'><MenuItem>My account</MenuItem></Link>
            <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
        </Menu>
    );

    const pathname = location.pathname

    let page
    if (pathname.indexOf('files') > -1) {
        page = 'files'
    } else if (pathname.indexOf('edit') > -1) {
        page = 'edit'
    } else if (pathname.indexOf('account') > -1) {
        page = 'account'
    }

    const onClickShare = () => {
        props.openModalFunction()
    }

    const onSearchBarChange = (e) => {
        props.setSearchKeyWord(e.target.value)
    }

    return (
        <div>
            <AppBar position="fixed" id="app-bar" style={{zIndex: 10}}>
                <Toolbar id="tool-bar">
                    <Link to='/files' className='logo-link'><strong>Nishi's Text Editor</strong></Link>
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon/>
                        </div>
                        <InputBase
                            placeholder="Search"
                            classes={{
                                input: classes.inputInput,
                            }}
                            className={page === 'files' ? '' : 'hidden-element'}
                            onChange={onSearchBarChange}
                        />
                    </div>
                    <div className={classes.grow}/>
                    <div className={classes.sectionDesktop}>
                        <Button
                            type='primary'
                            style={{marginRight: 20}}
                            className={page === 'edit' ? '' : 'hidden-element'}
                            id="Share-btn"
                            onClick={onClickShare}>
                            Share
                        </Button>
                        <IconButton
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                        >
                            <img className="avatar" alt="avatar" src={AccountCircle}/>
                        </IconButton>
                    </div>
                    <div className={classes.sectionMobile}>
                        <IconButton
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon/>
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
        </div>
    );
}

const mapStateToProps = state => {
    return {
        openModalFunction: state.openModalFunction,
        cleanup: state.cleanup
    }
}

export default connect(mapStateToProps, {setSearchKeyWord})(NavBar)