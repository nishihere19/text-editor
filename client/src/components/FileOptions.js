import {Button, Dropdown, Form, Input, Menu, message, Modal, Row, Select} from 'antd';
import React from "react";
import './FileOptions.css'
import {Divider} from "@material-ui/core";
import AccessTable from "./AccessTable";
import {connect} from 'react-redux'
import {setOpenModalFunction} from "../actions";
import {createNewFile, makeCopy} from "../utils/fileUtils";
import {withRouter} from 'react-router-dom'

const {SubMenu} = Menu;
const {Option} = Select;

const setAccessType = (newAccessType, fileId, fetchFile) => {
    fetch('http://localhost:8000/api/document/accessType', {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        },
        body:JSON.stringify({
            accessType: newAccessType,
            id: fileId
        })
    })
    .then((res) => res.json())
    .then(res => {
        if (res.msg === 'success') {
            message.success('Success.')
            fetchFile()
        } else {
            message.error(res.msg.toString())
        }
    }).catch(e => {
        message.error(e.toString())
    })
}

const PrivateAccessInfo = (props) => {
 console.log("Hitted privateaccess");
    const addAccess = (value) => {
        fetch('http://localhost:8000/api/document/access/add', {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            body:JSON.stringify({
                docId: props.doc._id,
                userEmail: value.email,
                access: value.access
            })
        })
        .then((res) => res.json())
        .then(res => {
            //console.log(res);
            if (res.msg === 'success') {
                message.success('Success.')
                props.fetchFile()
            } else {
                message.error(res.msg)
            }
        }).catch(e => {
            //console.log(e);
            message.error(e.msg)
        })
    }
    return (
        <div>
            <Form onFinish={addAccess} initialValues={{access: 'edit'}}>
                <Input.Group compact style={{height: 32}}>
                    <Form.Item name='email' style={{width: '70%'}}>
                        <Input placeholder='Email Address'/>
                    </Form.Item>

                    <Form.Item name='access' style={{width: '30%'}}>
                        <Select>
                            <Option value="edit">Edit Access</Option>
                            <Option value="read">Read Access</Option>
                        </Select>
                    </Form.Item>
                </Input.Group>
                <Row id='share-button-row'>
                    <Button type="primary" htmlType='submit'>
                        Share
                    </Button>
                </Row>
            </Form>
            <Divider/>
            <Row id='access-table'>
                <p>Users who have access to this file:</p>
                <AccessTable
                    doc={props.doc}
                    fetchFile={props.fetchFile}/>
            </Row>
            <Row style={{marginTop: 10, height: 15}}>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <p>Or you could switch to <a onClick={e => {
                    e.preventDefault()
                    setAccessType('public-read', props.doc._id, props.fetchFile)
                }}>public access</a></p>
            </Row>
        </div>
    )
}

const PublicAccessInfo = (props) => {
    const publicEdit = props.doc.accessType.endsWith('edit')
    return (
        <div>
            <p>According to your settings, everyone who has the link could
                {publicEdit ? ' edit' : ' read'} this file.</p>
            <p><span>You could change it to </span>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a onClick={e => {
                    e.preventDefault()
                    const newAccessType = publicEdit ? 'public-read' : 'public-edit'
                    setAccessType(newAccessType, props.doc._id, props.fetchFile)
                }}>
                    everyone could {publicEdit ? ' read' : ' edit'} this file
                </a>.
            </p>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <p>Or change it to <a onClick={e => {
                e.preventDefault()
                setAccessType('controlled', props.doc._id, props.fetchFile)
            }}>private access</a>, only people added can read or edit this file.</p>
        </div>
    )
}

const AccessInfo = (props) => {
    fetch('http://localhost:8000/api/user/userinfo',{
        method:"get",
        headers:{
            Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
        }
    })
    .then((res) => res.json())
    .then(res=>{
        //console.log(res);
        if (res.user._id !== props.doc.createdBy) {
            return (<p>Sorry. Only the creator of this file can change permissions.</p>)
        }

    })
    if (props.doc.accessType === 'controlled') {
        return <PrivateAccessInfo doc={props.doc} fetchFile={props.fetchFile}/>
    } else {
        return <PublicAccessInfo doc={props.doc} fetchFile={props.fetchFile}/>
    }

}

class FileOptions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            accessType: props.doc.accessType,
            access: props.doc.access
        }
    }

    setFilename = (e) => {
        const newFilename = e.target.value
        this.props.setFilename(newFilename)
    }

    openModal = () => {
        this.setState({
            visible: true
        })
    }

    closeModal = () => {
        this.setState({
            visible: false
        })
    }

    onCreate = (type) => {
        createNewFile(type, this.props.history)
    }

    onMakeCopy = () => {
        makeCopy(this.props.doc._id).then(newFileId => {
            this.props.history.push('/empty')
            this.props.history.replace('/edit/' + newFileId)
        }).catch(e => {
            message.error(e.message)
        })
    }

    componentDidMount() {
        this.props.setOpenModalFunction(this.openModal)
    }

    menu = (
        <Menu className='file-option-menu'>
            <Menu.Item onClick={this.openModal}>
                Share
            </Menu.Item>
            <SubMenu title="New...">
                <Menu.Item onClick={() => {this.onCreate('markdown')}}>
                    Text file
                </Menu.Item>
                {/* <Menu.Item onClick={() => {this.onCreate('code')}}>
                    Source code file
                </Menu.Item> */}
            </SubMenu>
            <Menu.Item onClick={this.onMakeCopy}>
                Make a copy
            </Menu.Item>
        </Menu>
    )

    render() {
        return (
            <div className='editor-info-div'>
                <Input
                    defaultValue={this.props.doc.filename}
                    bordered={false}
                    style={{width: 140}}
                    className='filename-input'
                    onBlur={this.setFilename}/>
                <Divider orientation="vertical" flexItem style={{height: 39}}/>
                <Dropdown overlay={this.menu} className='option-dropdown' trigger={['click']}>
                    <a className="ant-dropdown-link" onClick={e => e.preventDefault()} href='/'>
                        Options
                    </a>
                </Dropdown>

                <Modal
                    title="Share"
                    visible={this.state.visible}
                    onCancel={this.closeModal}
                    footer={null}
                >
                    <AccessInfo doc={this.props.doc} fetchFile={this.props.fetchFile}/>
                </Modal>
            </div>
        )

    }
}

export default connect(null, {setOpenModalFunction})(withRouter(FileOptions))