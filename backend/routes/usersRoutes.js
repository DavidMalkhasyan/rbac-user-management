import express from 'express';
import usersControllers from '../controllers/usersControllers.js';

const router = express.Router();

router.get('/all', (req, res) => {usersControllers.getAllUsers(req, res)});
router.get('/:id', (req, res) => {usersControllers.getUserById(req, res)});
router.put('/:id', (req, res) => {usersControllers.changeUser(req, res)});
router.delete('/:id', (req, res) => {usersControllers.deleteUser(req, res)});

export default router;