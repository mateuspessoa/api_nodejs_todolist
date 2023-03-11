const Task = require("../models/Task");
const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");

module.exports = class TaskController {
  static async create(req, res) {
    const description = req.body.description;
    const status = "A fazer";

    if (!description) {
      res.status(422).json({ message: "A descrição da tarefa é obrigatória" });
      return;
    }

    //Criador da tarefa
    const token = getToken(req);
    const user = await getUserByToken(token);

    const task = new Task({
      description,
      status,
      user: {
        _id: user._id,
        name: user.name,
      },
    });

    try {
      const newTask = await task.save();
      res.status(201).json({
        message: "Tarefa cadastrada com sucesso",
        newTask,
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  //Função para remover uma tarefa
  static async removeTaskById(req, res) {
    const id = req.params.id;

    //Checa se a tarefa existe
    const task = await Task.findOne({ _id: id });

    if (!task) {
      res.status(404).json({ message: "Tarefa não encontrado" });
      return;
    }

    //Checar se o usuário logado foi quem registrou a tarefa
    const token = getToken(req);
    const user = await getUserByToken(token);

    if (task.user._id.toString() !== user._id.toString()) {
      res
        .status(422)
        .json({ message: "Houve um problema ao processar a sua solicitação" });
      return;
    }

    await Task.findByIdAndRemove(id);

    res.status(200).json({ message: "Tarefa removida com sucesso" });
  }

  //Função para concluir a tarefa
  static async finalizarTarefa(req, res) {

    try {
        
            const id = req.params.id;

        //Checar se a tarefa existe
        const task = await Task.findOne({ _id: id });

        if (!task) {
        res.status(404).json({ message: "Tarefa não encontrado" });
        return;
        }

        //Checar se o usuário logado foi quem registrou a tarefa
        const token = getToken(req);
        const user = await getUserByToken(token);

        if (task.user._id.toString() !== user._id.toString()) {
        res
            .status(422)
            .json({ message: "Houve um problema ao processar a sua solicitação" });
        return;
        }

        task.status = "Finalizada";

        await Task.findByIdAndUpdate(id, task);

        res.status(200).json({ message: "Parabéns! A sua tarefa foi finalizada" });

    } catch (error) {
        res.status(500).json({message: error})
    }

  }

  static async concluirTarefa(req, res) {

    const id = req.params.id;
    const task = await Task.findOne({ _id: id });

    task.status = "Finalizada";
    await Task.findByIdAndUpdate(id, task);

    res.status(200).json({ message: "Parabéns! A sua tarefa foi finalizada" });
  }

  static async atualizarTarefa(req, res) {

    const id = req.params.id;
    const description = req.body.description;
    const updateData = {};

    if (!description) {
        res.status(422).json({ message: "A descrição da tarefa é obrigatória" });
        return;
      } else {
        updateData.description = description;
      }

      await Task.findByIdAndUpdate(id, updateData);

      res.status(200).json({ message: "Tarefa atualizada com sucesso" });
  }

  //Função para pegar todos as tarefas de um usuário
  static async pegarTarefasDoUsuario(req, res) {
    //Pegar o usuário pelo token
    const token = getToken(req);
    const user = await getUserByToken(token);

    //Pegar as tarefas cadastrados pelo usuário (filtrando pelo ID)
    const tasks = await Task.find({ "user._id": user._id }).sort("-createdAt");

    res.status(200).json({ tasks });
  }

  //Função para pegar uma tarefa pelo ID
  static async pegarTarefaPorId(req, res) {
    const id = req.params.id;

    //Checa se a tarefa existe
    const task = await Task.findOne({ _id: id });

    if (!task) {
      res.status(404).json({ message: "Tarefa não encontrada." });
    }

    //Retorna a tarefa encontrado pelo ID e envia para o front-end
    res.status(200).json({ task: task });
  }

  static async tarefasFinalizadas(req, res) {

    try {
        const token = getToken(req);
        const user = await getUserByToken(token);
        const tarefas = await Task.find({ "user._id": user._id, status: 'Finalizada' })
        res.status(200).json({ tarefas });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar tarefas finalizadas.' });
    }
  }

  static async tarefasAfazer(req, res) {
    try {
        const token = getToken(req);
        const user = await getUserByToken(token);
        const tarefas = await Task.find({ "user._id": user._id, status: 'A fazer' })
        res.status(200).json({ tarefas });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar tarefas em aberto.' });
    }
  }
};
