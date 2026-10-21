# Guia para apresentar o Technologic

## Explicação curta

> “Este projeto é um catálogo feito com React Native e Expo. O aplicativo não guarda os conteúdos dentro do celular: ele pede os dados para uma API REST feita com Express.js. A API conversa com o MongoDB, onde ficam os títulos, as descrições, as categorias e os caminhos das imagens. Qualquer pessoa pode ver e pesquisar o catálogo. Para cadastrar, editar ou excluir, a pessoa cria uma conta e entra. O servidor confere um token de login antes de aceitar essas alterações.”

## Demonstração

1. Mostre o início sem login: os conteúdos são carregados pela rota GET da API.
2. Pesquise “Breaking Bad”: o termo vai para a API e ela devolve os registros encontrados.
3. Crie uma conta. Explique que a senha é guardada como hash, não como texto aberto.
4. Abra o menu e mostre seu nome; entre na área administrativa.
5. Cadastre um conteúdo com uma imagem. O app envia um formulário para a API, e a API guarda os dados no MongoDB.
6. Edite e remova a imagem, depois exclua o conteúdo. Reabra o início para mostrar que a lista reflete as mudanças.
7. Saia da conta. A galeria e a pesquisa continuam disponíveis, mas os controles administrativos somem.

## O que cada parte faz

- **React Native/Expo:** mostra as telas no celular. App.js liga as telas ao menu.
- **AuthContext:** mantém o usuário e o token de acesso enquanto o aplicativo está aberto.
- **API REST:** recebe pedidos HTTP. GET consulta, POST cadastra, PATCH altera e DELETE exclui.
- **Express.js:** organiza as rotas e devolve respostas para o aplicativo.
- **MongoDB/Mongoose:** o MongoDB guarda os registros; Mongoose define os campos e facilita as consultas.
- **JWT:** depois de login ou cadastro, a API devolve um token. O app o envia nas rotas de administração.
- **bcrypt:** transforma a senha em um hash antes de guardá-la.
- **Imagens:** o app envia a foto para a API; na demonstração local, o arquivo fica em server/uploads e o caminho fica salvo no registro MongoDB.

## Perguntas que podem aparecer

**Por que usar uma API?**  
Para que o app converse com o banco por meio de rotas organizadas e para que o servidor confira o login antes de alterar os dados.

**O que é CRUD?**  
São as quatro ações de dados: criar (POST), consultar (GET), alterar (PATCH) e excluir (DELETE).

**Como a senha é protegida?**  
O servidor guarda um hash feito com bcrypt. Ele não devolve a senha ao app e não salva a senha original no banco.

**Como o sistema sabe que o usuário entrou?**  
O servidor devolve um token JWT no login. Nas rotas protegidas, o app envia esse token e o servidor o verifica.

**Onde ficam as imagens?**  
O arquivo fica na pasta de uploads do servidor local e o caminho fica no documento do conteúdo no MongoDB. Para publicar a API na internet, o ideal é trocar a pasta local por um serviço de armazenamento de imagens.

**Qual a diferença entre o usuário do Atlas e o usuário do app?**  
O usuário do Atlas permite que a API acesse o banco. A conta criada na tela do app permite que uma pessoa entre no catálogo e faça alterações.

## Se algo não conectar

- Confira se o terminal da API continua aberto e mostra a porta 3000.
- Confira se server/.env tem a connection string correta do Atlas.
- Confira se o IP do computador está permitido no Atlas.
- No celular físico, confira se .env aponta para o IP local do computador e se ambos estão na mesma rede Wi-Fi.
- Depois de mudar .env do aplicativo, pare e inicie o Expo novamente.
