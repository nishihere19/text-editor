import React from "react";
import {Card, Col, Row, Dropdown, Menu, Modal, message} from "antd";
import './RecentFileCard.css'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import FileImg from "./FileImg";
import {Link} from "react-router-dom";
import {deleteFile, makeCopy} from "../utils/fileUtils";
import {formatDate} from "../utils/utils";

class RecentFileCard extends React.Component {

    handleDelete = (e) => {
        e.preventDefault()
        Modal.confirm({
            title: 'Warning',
            content: <div>
                <p>Are you sure you want to delete this file from you file list?</p>
                <p>If you created this file, the file will be deleted immediately. You can not undo this action.</p>
            </div>
            ,
            cancelText: 'Cancel',
            okText: 'Delete',
            onOk: () => {
                deleteFile(this.props.doc.id, this.props.fetchList)
            },
            onCancel: () => {
            },
            maskClosable: true,
            width: 500
        });
    }

    handleMakeCopy = (e) => {
        e.preventDefault()
        makeCopy(this.props.doc.id).then(() => {
            this.props.fetchList()
        }).catch(e => {
            message.error(e)
        })
    }

    render() {
        const dropdownMenu = (
            <Menu>
                <Menu.Item>
                    <a href='/' onClick={this.handleDelete}>
                        Delete
                    </a>
                </Menu.Item>
                <Menu.Item>
                    <a href="/" onClick={this.handleMakeCopy}>
                        Make a copy
                    </a>
                </Menu.Item>
            </Menu>
        )

        return (
            <Link to={'/edit/' + this.props.doc.id}>
                <Card className='recent-file-card'
                      cover={<div id='card-cover'><FileImg type={this.props.doc.type}/></div>} hoverable={true}>
                    <Row>
                        <Col span={18} className='file-info-row'>
                            <Row className='filename-row'>{this.props.doc.filename}</Row>
                            <Row className='date-row'>Last edited:</Row>
                            <Row className='date-row'>{formatDate(this.props.doc.lastEdited)}</Row>
                        </Col>
                        <Col span={6} className='more-icon-col'>
                            <Dropdown.Button
                                icon={<MoreVertIcon/>}
                                trigger={['click']}
                                overlay={dropdownMenu}
                                placement='bottomLeft'
                                className='drop-down-button'>
                            </Dropdown.Button>
                        </Col>
                    </Row>
                </Card>
            </Link>
        )
    }
}

export default RecentFileCard