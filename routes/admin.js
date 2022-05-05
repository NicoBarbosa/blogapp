const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('categorias')
require('../models/Postagem')
const Postagem = mongoose.model('postagem')
const {eAdmin} = require('../helpers/eAdmin')

router.get('/', eAdmin, (req, res) => {
  res.render('admin/index')
})
//Categorias
router.get('/categorias', eAdmin, (req, res) => {
  Categoria.find().sort({date: 'desc'}).then((categorias) => {
    res.render('admin/categorias', {categorias: categorias})
  }).catch((erro) => {
    req.flash('error_msg', 'Houve um erro ao carregar as categorias!' + erro)
    req.redirect('/admin')
  })
})

router.get('/categorias/add', eAdmin, (req, res) => {
  res.render('admin/addcategorias')
})

router.post('/categorias/nova', eAdmin, (req, res) => {

  const erros = []

  if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
    erros.push({texto: 'Nome inválido!'})
  }

  if(req.body.nome.length < 2) {
    erros.push({texto: 'Nome da categoria muito pequeno'})
  }

  if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
    erros.push({texto: 'Slug inválido!'})
  }

  if(erros.length > 0) {
    res.render('admin/addcategorias', {erros: erros})
  }else {
    const novaCategoria = {
      nome: req.body.nome,
      slug: req.body.slug
    }
  
    new Categoria(novaCategoria).save().then(() => {
      req.flash('success_msg', 'Categoria criada com sucesso!')
      res.redirect('/admin/categorias')
    }).catch((erro) => {
      req.flash('error_msg', 'Houve um erro ao criar a categoria!')
      res.redirect('/admin')
    })
  }

})

router.get('/categorias/edit/:id', eAdmin, (req, res) => {
  Categoria.findOne({_id: req.params.id}).then((categoria) => {
    res.render('admin/editcategorias', {categoria: categoria})
  }).catch((erro) => {
    req.flash('error_msg', 'Essa categoria não existe!')
    res.redirect('/admin/categorias')
  })
})

router.post('/categorias/edit', eAdmin, (req, res) => {

  const erros = []

  if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
    erros.push({texto: 'Nome inválido!'})
  }

  if(req.body.nome.length < 2) {
    erros.push({texto: 'Nome da categoria muito pequeno'})
  }

  if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
    erros.push({texto: 'Slug inválido!'})
  }

  if(erros.length > 0) {
    res.render('admin/addcategorias', {erros: erros})
  }else {
    Categoria.findOne({_id: req.body.id}).then((categoria) => {

      categoria.nome = req.body.nome
      categoria.slug = req.body.slug

      categoria.save().then(() => {
        req.flash('success_msg', 'Categoria editada com sucesso!')
        res.redirect('/admin/categorias')
      }).catch((erro) => {
        req.flash('error_msg', 'Erro ao editar categoria!')
        res.redirect('/admin/categorias')
      })

    })
  }

})

router.post('/categorias/delete', eAdmin, (req, res) => {
  Categoria.deleteOne({_id: req.body.id}).then(() => {
    req.flash('success_msg', 'Categoria removida!')
    res.redirect('/admin/categorias')
  }).catch((erro) => {
    req.flash('error_msg', 'Erro ao tentar deletar a categoria!')
    res.redirect('/admin/categorias')
  })
})

//Postagens
router.get('/postagens', eAdmin, (req, res) => {
  Postagem.find().sort({data: 'desc'}).populate('categoria').then((postagens) => {
    res.render('admin/postagem', {postagens: postagens})
  })
})

router.get('/postagens/add', eAdmin, (req, res) => {
  Categoria.find().then((categorias) => {
    res.render('admin/addpostagem', {categorias: categorias})
  }).catch((erro) => {
    req.flash('error_msg', 'Houve um erro ao carregar as categorias!')
  })
})

router.post('/postagens/nova', eAdmin, (req, res) => {

  const erros = []

  if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null) {
    erros.push({texto: 'Titulo inválido!'})
  }

  if(req.body.titulo.length < 2) {
    erros.push({texto: 'Titulo da postagem muito pequeno'})
  }

  if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
    erros.push({texto: 'Slug inválido!'})
  }

  if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null) {
    erros.push({texto: 'Descrição inválida'})
  }

  if(req.body.descricao.length < 2) {
    erros.push({texto: 'Descricão muito pequena'})
  }

  if(!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null) {
    erros.push({texto: 'Conteúdo inválida'})
  }

  if(req.body.conteudo.length < 2) {
    erros.push({texto: 'Conteúdo muito pequena'})
  }

  if(req.body.categoria == '0') {
    erros.push({erros: 'Não há categorias, registre uma nova categoria!'})
  }

  if(erros.length > 0) {
    res.render('admin/addpostagem', {erros: erros})
  }else{
    const novaPostagem = {
      titulo: req.body.titulo,
      slug: req.body.slug,
      descricao: req.body.descricao,
      conteudo: req.body.conteudo,
      categoria: req.body.categoria
    }

    new Postagem(novaPostagem).save().then(() => {
      req.flash('success_msg', 'Nova postagem criada!')
      res.redirect('/admin/postagens')
    }).catch((erro) => {
      req.flash('error_msg', 'Erro ao criar nova postagem!')
      res.redirect('/admin/postagens')
    })

  }
})

router.get('/postagens/edit/:id', eAdmin, (req, res) => {
  Postagem.findOne({_id: req.params.id}).populate('categoria').then((postagem) => {
    Categoria.find().then((categorias) => {
      res.render('admin/editpostagens', {postagem: postagem, categorias: categorias})
    }).catch((erro) => {
      req.flash('error_msg', 'Erro ao carregar categorias')
      res.redirect('/admin/postagens')
    })

  })
})

router.post('/postagens/edit', eAdmin, (req, res) => {
  const erros = []

  if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null) {
    erros.push({texto: 'Título inválido!'})
  }

  if(req.body.titulo.length < 2) {
    erros.push({texto: 'Nome da categoria muito pequeno'})
  }

  if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
    erros.push({texto: 'Slug inválido!'})
  }

  if(!req.body.descricao  || typeof req.body.descricao == undefined || req.body.descricao == null) {
    erros.push({texto: 'Descrição inválido!'})
  }

  if(!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null) {
    erros.push({texto: 'Conteúdo inválido!'})
  }
  
  if(erros.length > 0) {
    res.render('admin/addcategorias', {erros: erros})
  }else {
    Postagem.findOne({_id: req.body.id}).then((postagem) => {
      postagem.titulo = req.body.titulo
      postagem.slug = req.body.slug
      postagem.descricao = req.body.descricao
      postagem.conteudo = req.body.conteudo
      postagem.categoria = req.body.categoria

      postagem.save().then(() => {
        req.flash('success_msg', 'Postagem alterada com sucesso!')
        res.redirect('/admin/postagens')
      }).catch((erro) => {
        req.flash('error_msg', 'Erro ao alterar postagem!')
        res.redirect('/admin/postagens')
      })
    })
  }
})

router.post('/postagens/delete', eAdmin, (req, res) => {
  Postagem.deleteOne({_id: req.body.id}).then(() => {
    req.flash('success_msg', 'Postagem deletada com sucesso!')
    res.redirect('/admin/postagens')
  }).catch((erro) => {
    req.flash('error_msg', 'Erro ao deletar postagem!')
    res.redirect('/admin/postagens')
  })
})



module.exports = router