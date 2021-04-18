const express = require('express');
const router = express.Router();
const documentService = require('../service/documentService')
const Document = require('../model/Document')
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json()
const cookieParser = require('cookie-parser')
const middleware = require('../middleware/auth');

router.use(jsonParser)
router.use(cookieParser())

router.post('/new',middleware, (req, res) => {
    //console.log(req.user);
    let newDocument = new Document({
        type: "markdown",
        access: {}
    })
    documentService.createNewDocument(newDocument, req.user._id, req.user.email).then((newDocument) => {
        //console.log(newDocument);
        res.send({
            status: 200,
            msg: 'success',
            id: newDocument._id
        })
    }).catch((e) => {
        //console.log(e);
        res.send({
            status: 200,
            msg: e.message
        })
    })
})

router.post('/list',middleware, (req, res) => {
    documentService.getDocumentsByUser(req.user._id).then(docInfo => {
        //console.log(docInfo);
        res.send({
            status: 200,
            msg: 'success',
            docs: docInfo,
            userId: req.user._id
        })
    }).catch(e => {
        res.send({
            status: 200,
            msg: e.message
        })
    })
})

router.get('/one/:id',middleware, (req, res) => {
    //console.log(req.user);
    const docId = req.params.id
    documentService.getDocumentById(docId, req.user._id).then((doc) => {
        res.send({
            status: 200,
            msg: 'success',
            doc: doc,
            userId: req.user._id
        })
    }).catch(e => {
        res.send({
            status: 200,
            msg: e.message
        })
    })
})

router.put('/',middleware, (req, res) => {
    //console.log(req.body);
    const id = req.body.id
    const content = req.body.content
    const filename = req.body.filename

    updateDoc = new Document({
        _id: id,
        content: content,
        filename: filename
    })

    documentService.updateDocument(updateDoc, req.user._id).then((doc) => {
        res.send({
            status: 200,
            msg: 'success',
            doc: doc
        })
    }).catch(e => {
        res.send({
            status: 200,
            msg: e.message
        })
    })
})

router.delete('/:id',middleware, (req, res) => {
    const docId = req.params.id
    const userId = req.user._id
    //console.log(userId)
    documentService.deleteDocument(docId, userId).then(() => {
        res.send({
            status: 200,
            msg: 'success'
        })
    }).catch(e => {
        res.send({
            status: 200,
            msg: e.message
        })
    })
})

router.post('/copy',middleware, (req, res) => {
    const docId = req.body.id
    const userId = req.user._id

    documentService.makeCopy(docId, userId).then(newId => {
        res.send({
            status: 200,
            msg: 'success',
            id: newId
        })
    }).catch(e => {
        res.send({
            status: 200,
            msg: e.message
        })
    })
})

router.put('/accessType', middleware, (req, res) => {

    const docId = req.body.id
    const userId = req.user._id
    const newAccessType = req.body.accessType
    //console.log(req.body,userId);
    documentService.changeAccessType(newAccessType, docId, userId).then(() => {
        res.send({
            status: 200,
            msg: 'success'
        })
    }).catch(e => {
        res.send({
            status: 200,
            msg: e.message
        })
    })
})

router.put('/access/add', middleware, (req, res) => {
    const docId = req.body.docId
    const requestUserId = req.user._id
    const addUserEmail = req.body.userEmail
    const access = req.body.access

    documentService.addAccess(addUserEmail, docId, requestUserId, access).then(() => {
        res.send({
            status: 200,
            msg: 'success'
        })
    }).catch(e => {
        res.send({
            status: 200,
            msg: e.message
        })
    })
})

router.put('/access/remove',middleware, (req, res) => {
    const docId = req.body.docId
    const requestUserId = req.user._id
    const removeUserId = req.body.userId

    documentService.removeAccess(docId, removeUserId, requestUserId).then(() => {
        res.send({
            status: 200,
            msg: 'success'
        })
    }).catch(e => {
        res.send({
            status: 200,
            msg: e.message
        })
    })
})

module.exports = router