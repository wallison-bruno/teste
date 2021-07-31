//Módulos
const express = require("express");// não repcisa colocar o diretório pois está dentro do NPM
const app = express();
const bodyparser = require('body-parser')
const handlebars = require('express-handlebars')
const path = require('path') //Serve para trabalhar com diretórios
//const { create } = require("domain")

const session = require('express-session')
const bcrypt = require('bcryptjs')

const connectflash = require('connect-flash')

const passport = require('passport')
require("./config/auth")(passport)

const { autenticado } = require('./helpers/adminVerification')

//const emailVerif = require('./helpers/emailVerif')

const User = require('./models/User');
const { use } = require("passport");

/*COMFICURAÇÕES*/

//session
app.set('trust proxy', 1)
app.use(session({
    secret: 'testenode',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 60 * 1000 }
}))

//passport
app.use(passport.initialize())
app.use(passport.session())

//flash
app.use(connectflash())

//middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg") //.locals são variáveis globais, podem ser acessadas de qualquer parte do sistema
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")
    res.locals.user = req.user || null;//req.user são dados que o passaport cria para o usuario logado.
    next()// Não esquecer!!!
})

//templete estático
app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// body parser
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())

//public
app.use(express.static(path.join(__dirname, "public")))

/* ROTAS */
app.get('/', function (req, res) {
    res.render('pages/home')
})

//login
app.get('/login', function (req, res) {
    res.render('pages/login')
})

app.post('/login', function (req, res, next) {
    console.log('!!!!!!!! POST LOGIN !!!!!!')
    passport.authenticate('local', {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true
    })(req, res, next)
})

//logout
app.get('/logout', autenticado, (req, res) => {
    req.logOut()
    res.redirect('/')
})

//cadastro
app.get('/cadastro', function (req, res) {
    res.render('pages/cadastro')
})

//editar
app.get('/editar', autenticado, function (req, res) {
    res.render('pages/editar')
})

app.post('/editar', autenticado, function (req, res) {
    (async () => {
        var erros = []

        // validação de e-amil existente.
        await User.findOne({
            attributes: ['email'],
            where: {
                email: req.body.email,
            }
        }).then(function (user) {

            User.findOne({
                attributes: ['email'],
                where: {
                    id: req.body.id,
                }
            }).then((user) => {
                if (req.body.email != user.email) {
                    erros.push({ texto: "O E-mail '" + user.email + "' já foi cadastrado!" })
                }
            }
            ).catch()
        }).catch()

        //Validação de campos vasíos.
        if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
            erros.push({ texto: "O campo 'Nome completo' está vazio!" }) // esse texto vai ser exibido ta tela de /cadastro
        }

        if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
            erros.push({ texto: "O campo 'E-mail' está vazio!" })
        }

        if (req.body.senha != req.body.senha2) {
            erros.push({ texto: "As senhas estão diferentes!" })
        } else {
            if (req.body.senha.length <= 3 && req.body.senha != "") {
                erros.push({ texto: "Senha muito curta!" })
            }
        }

        if (erros.length > 0) {
            res.render('pages/editar', { erros: erros }) // passando erros com textos para /cadastro
        } else {
            User.update({
                nome: req.body.nome,
                email: req.body.email,
                cpf: req.body.cpf,
                pais: req.body.pais,
                municipio: req.body.cidade,
                estado: req.body.estado,
                rua: req.body.endereco,
                numero: req.body.numero,
                complemento: req.body.complemento,
                cep: req.body.cep

            }, {
                where: {
                    id: req.body.id
                }

            }).then(function () {
                req.flash('success_msg', 'Usuário editado com sucesso!')
                res.redirect('/')
            }).catch(
                function (erro) {
                    req.flash('error_msg', "Houve um erro ao editar seu cadastro!")
                    res.redirect('/editar')
                    //console.log('Ocorreu o erro: ' + erro)
                }
            )

            //Gerando RASH da senha.
            if (req.body.senha != "") {

                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(req.body.senha, salt, (erro, hash) => {
                        if (erro) {
                            req.flash("error_msg", " Erro au salvar sua senha")
                            res.redirect('pages/cadastro')
                        }
                        User.update({
                            senha: hash,
                        }, {
                            where: {
                                id: req.body.id
                            }
                        }).then(() => {
                            req.flash('success_msg', 'Senha alterada com sucesso!')
                        }).catch((erro) => {
                            req.flash("error_msg", 'Errro ao alterar a senha!')
                        }
                        )

                    })
                })
            }
        }
    })();
})

//Cadastrar usuário
app.post('/adicionar', function (req, res) {
    (async () => {
        var erros = []

        // validação de e-amil existente.
        await User.findOne({
            attributes: ['email'],
            where: {
                email: req.body.email,
            }
        }).then(function (user) {
            if (user) {
                //console.log('!!! USUÁRIO EXISTE: ' + user.email)
                erros.push({ texto: "O E-mail '" + user.email + "' já foi cadastrado!" })
            }
        }).catch()

        //Validação de campos vasios.
        if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
            erros.push({ texto: "O campo 'Nome completo' está vazio!" }) // esse texto vai ser exibido ta tela de /cadastro
        }

        if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
            erros.push({ texto: "O campo 'E-mail' está vazio!" })
        }

        if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
            erros.push({ texto: "O campo 'Senha' está vazio!" })
        }

        if (!req.body.senha2 || typeof req.body.senha2 == undefined || req.body.senha2 == null) {
            erros.push({ texto: "O campo 'Confirme a senha' está vazio!" })
        } else {
            if (req.body.senha != req.body.senha2) {
                erros.push({ texto: "As senhas estão diferentes!" })

            } else {
                if (req.body.senha.length <= 3) {
                    erros.push({ texto: "Senha muito curta!" })
                }
            }
        }

        if (erros.length > 0) {
            res.render('pages/cadastro', { erros: erros }) // passando erros com textos para /cadastro
        } else {
            //Gerando RASH da senha.
            bcrypt.genSalt(10, (erro, salt) => {
                bcrypt.hash(req.body.senha, salt, (erro, hash) => {
                    if (erro) {
                        req.flash("erro_msg", " Erro au salvar sua senha")
                        res.redirect('pages/cadastro')
                    }
                    //Cadastrando usuário no BD.

                    User.create({
                        nome: req.body.nome,
                        senha: hash,
                        email: req.body.email,
                        cpf: req.body.cpf,
                        pais: req.body.pais,
                        municipio: req.body.cidade,
                        estado: req.body.estado,
                        rua: req.body.endereco,
                        numero: req.body.numero,
                        complemento: req.body.complemento,
                        cep: req.body.cep

                    }).then(function () {
                        req.flash('success_msg', 'Usuário cadastrado com sucesso!!!')
                        res.redirect(307, '/login')
                    }).catch(
                        function (erro) {
                            req.flash('error_msg', "Houve um erro ao cadastrar seu cadastro, tente novamente mais tarde.")
                            res.redirect('/cadastro')
                            console.log('Ocorreu o erro: ' + erro)
                        }
                    )
                })
            })
        }
    })();
})

//deletar
app.post('/deletar', (req, res) => {
    User.destroy({ where: { 'id': req.body.id } }).then(function () {
        req.logOut()
        res.redirect('/')
    }).catch(function (erro) {
        req.fresh('error_msg', "Erro ao descadastrar usuário!")
        res.redirect('/editar')
    })
})

app.listen(8081, function () { //localhsot:8081
    console.log(" Servidor rodando! "); //fução disparada qunado a porta 8081 estiver sendo escuatada.   
}); //Último script dessa página.
