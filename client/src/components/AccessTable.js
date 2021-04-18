import {Table, Space, message} from 'antd';
import React from "react";

class AccessTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: null
        }
    }

    removeAccess = (removeUserId) => {
        fetch('http://localhost:8000/api/document/access/remove', {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            userId: removeUserId,
            docId: this.props.doc._id
        })
        .then((res) => res.json())
        .then(res => {
            if (res.msg === 'success') {
                message.success('Success.')
                this.props.fetchFile()
            } else {
                message.error(res.msg)
            }
        }).catch(e => {
            message.error(e)
        })
    }

    columns = [
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Access',
            dataIndex: 'access',
        },
        {
            title: 'Action',
            dataIndex: 'id',
            render: (id) => (
                <Space size="middle">
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a onClick={e => {
                        e.preventDefault()
                        this.removeAccess({id})
                    }}>Remove</a>
                </Space>
            ),
        },
    ];

    getAccessList = (access) => {
        const data = []
        access.forEach((value, key) => {
            if (key !== this.props.doc.createdBy) {
                value.id = key
                data.push(value)
            }
        })
        this.setState({
            data: data
        })
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (nextProps.doc.access !== this.props.doc.access) {
            this.getAccessList(nextProps.doc.access)
        }
        return true
    }

    componentDidMount() {
        this.getAccessList(this.props.doc.access)
    }

    render() {
        return (
            <Table
                columns={this.columns}
                dataSource={this.state.data} pagination={false}
                rowKey={'email'}
                style={{width: '100%'}}
            />
        )
    }
}

export default AccessTable