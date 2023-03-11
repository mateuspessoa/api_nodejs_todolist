const router = require('express').Router()
const TaskController = require('../controllers/TaskController')

const verifyToken = require('../helpers/verify-token')

router.put('/finalizar/:id', TaskController.finalizarTarefa)
router.post('/concluirtarefa/:id', TaskController.concluirTarefa);

router.post('/create', verifyToken, TaskController.create)

router.delete('/:id', verifyToken, TaskController.removeTaskById)

router.get('/finalizadas', TaskController.tarefasFinalizadas);
router.get('/abertas', TaskController.tarefasAfazer)


router.post('/atualizar/:id', TaskController.atualizarTarefa);


router.get('/minhastarefas', verifyToken, TaskController.pegarTarefasDoUsuario)
router.get('/:id', verifyToken, TaskController.pegarTarefaPorId)

module.exports = router