const express = require('express');
const expressMongoDb = require('express-mongo-db');
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectID = require('mongodb').ObjectID;

const app = express();

//cria conexão com o banco de dados
//e a disponibiliza na variável req.db
app.use(expressMongoDb('mongodb://localhost/cadastros'));

//converte os dados presentes no corpo da requisição em JSON
//e os disponibiliza na variável req.body
app.use(bodyParser.json());

//adiciona o header Access-Control-Allow-Origin:*
//que libera acesso para essa API por qualquer domínio
app.use(cors());

// busca todos os  nomes do cadastro
app.get('/usuarios', (req, res) => {
    req.db.collection('nome').find().toArray((err, data) => {
        if(err){
            res.status(500).send();
            return;
        }
        
        res.send(data);
    });
});

// busca um cadastro pelo id
app.get('/usuario/:id', (req, res) => {
    let query = {
        _id: ObjectID(req.params.id)
    };
    
    
    req.db.collection('nome').findOne(query, (err, data) => {
        if(err){
            res.status(500).send();
            return;
        }
        
        if(!data){
            res.status(404).send();
            return;
        }
        
        res.send(data);
    });
});



//insere um nova pessoa
app.post('/cadastro', (req, res) => {
    //remove dados indesejados do body
    let cadastro = {
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha
    };
    
    // exemplo de validação de email
   // if(req.body.email.indexOf('@') == -1){
     //   res.status(400).send({mensagem: 'Email inválido'});
       // return;
    //}
    
    req.db.collection('nome').insert(cadastro, (err) => {
        if(err){
            res.status(500).send();
            return;
        }
        
        res.send(req.body);
    });
});


// atualiza o cadastro do pelo id
app.put('/cadastro/:id', (req, res) => {
    let query = {
        _id: ObjectID(req.params.id)
    };
    
    let cadastro = {
        nome: req.body.nome,
        email: req.body.email,
        senha : req.body.senha
    };
    
    req.db.collection('nome').updateOne(query, cadastro, (err, data) => {
        if(err){
            res.status(500).send();
            return;
        }
        
        res.send(data);
    });
});


// deleta uma parte do cadastro pelo id
app.delete('/cadastro/:id', (req, res) => {
    let query = {
        _id: ObjectID(req.params.id)
    };

    req.db.collection('nome').deleteOne(query, (err, data) => {
        if(err){
            res.status(500).send();
            return;
        }

        res.send(data);
    });
});

app.listen(3000);