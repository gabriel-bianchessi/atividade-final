# Project

A ideia do projeto é criar um blog para conteúdos de programação

## Entidades

### Usuário
* id
* name
* username
* email
* password
* isAdmin
* posts[]
* reactions[]
* createdAt
* updatedAt?
* visible

**Usuário não admin pode**
* Ver posts não ocultos
* Ver comentários
* Ver reações
* Remover reação
* Reagir a um post
* Criar post
* Editar seu próprio post
* Deletar próprio post
* Fazer comentários
* Deletar próprio comentário 

**Usuário admin pode**
* Apagar qualquer post
* Apagar qualquer comentário
* Lista de todos os usuários

### Post
* id
* title
* description
* comments[]
* reactions[]
* userId
* createdAt
* updatedAt?
* visible

### Comentário
* id
* userId
* repliesToId?
* content
* createdAt
* visible

### Reação
* id
* type
* userId
* postId?
* commentId?
* createdAt
* visible