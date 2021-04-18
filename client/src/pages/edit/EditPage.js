import React from 'react';
import './EditPage.css'
import MDEditor from "../../components/MDEditor";
import {withRouter} from "react-router-dom"
import {message, Modal} from "antd";
import cookies from "react-cookies";

let Editor = (props) => {
    return (<MDEditor id='editor'
    doc={props.doc}
    fetchFile={props.fetchFile}
    access={props.access}
    userId={props.userId}/>)
}

class EditPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            doc: null
        }
    }

    handleUnauthorized = () => {
        cookies.remove('token')
        this.props.history.push('/')
    }

    fetchData = () => {
        fetch('http://localhost:8000/api/document/one/' + this.props.match.params.id,{
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.msg === 'success') {
                const accessMap = new Map()
                const doc = res.doc
                for (const [key, value] of Object.entries(doc.access)) {
                    accessMap.set(key, value)
                }
                doc.access = accessMap
                this.userId = res.userId
                this.setState({
                    access: doc.access.get(res.userId).access,
                    doc: res.doc,
                })
            } else if (res.data.msg === 'Unauthorized') {
                message.error('Unauthorized. Please sign in first.');
                setTimeout(this.handleUnauthorized, 2000)
            } else if (res.msg === 'no_access') {
                Modal.warning({
                    content: 'You have no access to this file, please contact creator of the file to grand you access.',
                    okText: 'Back to my files',
                    onOk: () => this.props.history.replace('/files')
                })
            } else {
                message.error(res.msg)
            }
        }).catch(e => {
            if (e.toString() !== 'Cancel') message.error("Error fetching file. " + e)
        })
    }

    componentDidMount() {
        this.fetchData()
    }

    render() {
        if (this.state.doc !== null) {
            return (
                <div id='edit-page-editor-div'>
                    <Editor
                        type={this.state.doc.type}
                        doc={this.state.doc}
                        fetchFile={this.fetchData}
                        access={this.state.access}
                        userId={this.userId}
                    />
                </div>
            );
        } else {
            return (<div/>)
        }
    }

}

export default withRouter(EditPage)
