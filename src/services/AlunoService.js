const prisma = require("../databases/prisma");
const AlunoInvalidoError = require("../errors/AlunoInvalidoError");
const AlunoNaoEncontradoError = require("../errors/AlunoNaoEncontradoError");

class AlunoService{

    async findMany(page, pageSize, orderBy, order){
        const ordenacao = {};
        ordenacao[orderBy] = order;

        //SELECT * FROM alunos
        const alunos = await prisma.aluno.findMany({
            skip: (page-1)*pageSize,
            take: Number(pageSize),
            orderBy: ordenacao
        });
        //SELECT COUNT(*) FROM alunos
        const total = await prisma.aluno.count();
        return {alunos, total};
    }
        //direção diferente de asc/desc: usa a padrão (asc) para não quebrar o Prisma
        if(order !== "asc" && order !== "desc"){
            order = "asc";
        }

    async create(aluno){
        const {nome, email} = aluno;
        if(!nome || !email){
            throw new AlunoInvalidoError();
        }
        //create = insert
        //update = update
        //delete = delete
        //findMany = select * from
        const novoAluno = await prisma.aluno.create({data:aluno});

        return novoAluno;
    }

        async findUnique(id){
        //SELECT * FROM alunos WHERE id = ?
        const aluno = await prisma.aluno.findUnique({
            where: {id: id}
        });
            
            if(!aluno){
            throw new AlunoNaoEncontradoError();
        }
        return aluno;

        async update(id, dados){
            await this.findUnique(id);

        //body vazio ou sem nome/email: reaproveita o AlunoInvalidoError (400), pois são dados inválidos do aluno
        if(!dados || (!dados.nome && !dados.email)){
            throw new AlunoInvalidoError("Informe nome e/ou email para atualizar");
        }
            
            const data = {};
            if(dados.nome){
            data.nome = dados.nome;
        }
            if(dados.email){
            data.email = dados.email;
        }

        //UPDATE alunos SET ... WHERE id = ?
        const aluno = await prisma.aluno.update({
            where: {id: id},
            data: data
        });
        return aluno;
    }
    }
}

module.exports = new AlunoService();
