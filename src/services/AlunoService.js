const prisma = require("../databases/prisma");
const AlunoInvalidoError = require("../errors/AlunoInvalidoError");

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
        return aluno;
    }
}

module.exports = new AlunoService();
