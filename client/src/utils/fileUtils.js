
import {message} from "antd";

const saveFile = (data) => {
    //console.log(data);
    return new Promise((resolve, reject) => {
        fetch('http://localhost:8000/api/document',{
            method: "PUT",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            body:JSON.stringify(data)
        })
        .then((res) => res.json())
        .then(res => {
            if (res.msg === 'success') {
                // console.log(res.data.doc.lastEdited)
                resolve(res)
            } else {
                reject(res.msg)
            }
        }).catch(e => {
            reject('Error saving file. ' + e.message)
        })
    })
}

const deleteFile = (id, fetchData) => {
    fetch('http://localhost:8000/api/document/' + id,{
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        },
    })
    .then((res) => res.json())
    .then(res => {
        if (res.msg === 'success') {
            message.success('Success.')
            fetchData()
        } else {
            message.error('Error deleting file. ' + res.msg)
        }
    }).catch(e => {
        message.error("Error deleting file. " + e.message)
    })
}

const makeCopy = (docId) => {
    return new Promise((resolve, reject) => {
        fetch('http://localhost:8000/api/document/copy', {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            body:JSON.stringify({
                id: docId
            })
        })
            .then((res) => res.json())
            .then(res => {
            if (res.msg === 'success') {
                resolve(res.id)
            } else {
                reject(res.msg)
            }
        }).catch(e => {
            reject(e.message)
        })
    })
}

const createNewFile = (type, history) => {
    fetch('http://localhost:8000/api/document/new', {
        method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        },
        body:JSON.stringify({
            type: type
        })
    })
    .then((res) => res.json())
    .then(res => {
        if (res.msg === 'success') {
            history.push('/empty')
            history.replace('/edit/' + res.id);
        } else {
            message.error(res.msg)
        }
    }).catch(e => {
        message.error('Error creating new file. ' + e.message)
    });
}

export {
    saveFile,
    deleteFile,
    makeCopy,
    createNewFile
}