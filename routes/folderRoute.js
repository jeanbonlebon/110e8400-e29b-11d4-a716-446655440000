const express = require('express'),
      router = express.Router(),
      passport = require('passport'),
      passportService = require('../config/passport'),
      AuthControllers = require('../controllers/authControllers.js'),
      FolderControllers = require('../controllers/folderControllers.js')

const requireAuth = passport.authenticate('jwt', { session: false });

router.post('/', requireAuth, POST_Folder);
router.get('/:id', requireAuth, GET_Folder);
router.get('/childs/:id', requireAuth, GET_ChildsFolder);
router.put('/move/:id', requireAuth, MOVE_Folder);
router.put('/rename/:id', requireAuth, RENAME_Folder);
router.delete('/:id', requireAuth, DELETE_Folder);

module.exports = router;

function POST_Folder(req, res, next) {
    FolderControllers.POST_Folder(req.body, req.user._id)
        .then(function () {
            res.sendStatus(200)
        })
        .catch(function(err) {
            res.send(err)
        })
}

function GET_Folder(req, res, next) {
    FolderControllers.GET_Folder(req.params.id, req.user._id)
        .then(function (folder) {
            res.send(folder)
        })
        .catch(function(err) {
            res.send(err)
        })
}

function GET_ChildsFolder(req, res, next) {
    FolderControllers.GET_ChildsFolder(req.params.id, req.user._id)
        .then(function (folders) {
            res.send(folders)
        })
        .catch(function(err) {
            res.send(err)
        })
}

function MOVE_Folder(req, res, next) {
    FolderControllers.MOVE_Folder(req.body.folder, req.params.id, req.user._id)
        .then(function () {
            res.sendStatus(200)
        })
        .catch(function(err) {
            res.send(err)
        })
}

function RENAME_Folder(req, res, next) {
    FolderControllers.RENAME_Folder(req.body.name, req.params.id, req.user._id)
        .then(function () {
            res.sendStatus(200)
        })
        .catch(function(err) {
            res.send(err)
        })
}

function DELETE_Folder(req, res, next) {
    FolderControllers.DELETE_Folder(req.params.id, req.user._id)
        .then(function () {
            res.sendStatus(200)
        })
        .catch(function(err) {
            res.send(err)
        })
}
