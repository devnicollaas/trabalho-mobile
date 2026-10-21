# Technologic

Aplicativo React Native com Expo SDK 54 e API REST em Express.js. O catálogo público mostra os conteúdos guardados no MongoDB. Depois de criar uma conta e entrar, a pessoa pode cadastrar, editar e excluir conteúdos e suas imagens.

## O que foi implementado

- Cadastro e login com senha protegida por hash e token JWT.
- Nome e e-mail da pessoa logada no menu.
- Catálogo e pesquisa públicos.
- Área administrativa protegida no aplicativo e na API.
- Cadastro, edição e exclusão de conteúdos.
- Seleção, troca e remoção de imagens.
- Conteúdo de exemplo do template: Breaking Bad, carregado com npm run seed.

Cada conteúdo guarda título, subtítulo, descrição, categoria e o caminho da imagem no MongoDB. Arquivos enviados são guardados em server/uploads/ durante a demonstração local.

## O que instalar

- Node.js LTS.
- Uma base MongoDB. Para começar, MongoDB Atlas oferece uma opção hospedada; também pode ser usado um MongoDB local.
- Expo Go ou um emulador Android/iOS para abrir o aplicativo.

## Preparar o MongoDB Atlas

1. Crie uma conta e um projeto no MongoDB Atlas e crie um cluster.
2. Em **Database & Network Access**, crie um **Database User** com senha. Esse é o usuário que a API usará, não é necessariamente o mesmo login do site Atlas.
3. Na área de **Network Access**, autorize o IP público da rede onde a API vai rodar.
4. Na tela do cluster, escolha **Connect → Drivers** e copie a connection string.
5. A connection string é usada pela API. Substitua o usuário, a senha e, se necessário, o nome do banco. Se a senha tiver caracteres especiais, use a versão codificada indicada pelo Atlas.

O Atlas só aceita conexão de IPs na lista de acesso e precisa de um Database User válido. Consulte a [documentação de conexão do Atlas](https://www.mongodb.com/docs/atlas/connect-to-database-deployment/), a [lista de IPs autorizados](https://www.mongodb.com/docs/atlas/security/add-ip-address-to-list/) e a [criação de Database Users](https://www.mongodb.com/docs/atlas/security-add-mongodb-users/).

## Preparar e iniciar a API

No PowerShell, a partir da pasta do projeto:

~~~powershell
cd server
Copy-Item .env.example .env
~~~

Abra server/.env e preencha MONGODB_URI com a connection string copiada do Atlas. Troque também JWT_SECRET por uma frase longa e exclusiva. Não publique esse arquivo no GitHub.

Instale os pacotes e inicie o servidor:

~~~powershell
npm install
npm run seed
npm start
~~~

O npm run seed é opcional e cadastra o exemplo Breaking Bad sem duplicá-lo quando executado novamente. A API fica disponível na porta 3000. Deixe esse terminal aberto.

## Iniciar o aplicativo

Abra outro PowerShell na pasta principal do projeto:

~~~powershell
npm install
npx expo start
~~~

O endereço padrão é configurado conforme o destino: 10.0.2.2 para o emulador Android e localhost para web ou simulador iOS. Em um celular físico, o computador e o celular devem estar na mesma rede Wi-Fi. Copie .env.example para .env, descubra o IP local do computador e preencha, por exemplo:

~~~text
EXPO_PUBLIC_API_URL=http://192.168.0.15:3000/api
~~~

Troque 192.168.0.15 pelo IP real do seu computador. Se o celular não conectar, permita a porta 3000 no Firewall do Windows para a rede privada. Reinicie o Expo depois de mudar .env.

## Apresentação

1. Abra o app sem entrar e mostre o catálogo e a pesquisa.
2. Use **Entrar → Criar conta**; depois do cadastro, o app inicia a sessão.
3. Abra o menu lateral e mostre seu nome e a **Área administrativa**.
4. Cadastre uma série ou outro conteúdo e escolha uma imagem.
5. Volte ao início, pesquise pelo título e mostre que o item aparece no catálogo.
6. Na área administrativa, edite o título, troque ou remova a imagem e apague o item.
7. Saia da conta e mostre que os botões de gerenciamento não aparecem na galeria pública.

## Rotas principais da API

| Método e rota | Acesso | O que faz |
| --- | --- | --- |
| POST /api/auth/registrar | Público | Cria uma conta e inicia a sessão |
| POST /api/auth/login | Público | Confere e-mail e senha |
| GET /api/conteudos?q=termo | Público | Lista e pesquisa o catálogo |
| POST /api/conteudos | Login | Cadastra conteúdo e imagem |
| PATCH /api/conteudos/:id | Login | Altera conteúdo, inclusive a imagem |
| DELETE /api/conteudos/:id/imagem | Login | Remove só a imagem |
| DELETE /api/conteudos/:id | Login | Exclui um conteúdo |

## Estrutura

- App.js: monta o menu e as telas.
- context/AuthContext.js: mantém o usuário e o token enquanto o app está aberto.
- services/api.js: envia requisições do app para o servidor.
- AppBar.js, Pesquisa.js e Cards.js: exibem e procuram conteúdos da API.
- Admin.js: formulário e ações de gerenciamento, visíveis quando há login.
- server/src/models/: define os campos guardados em cada coleção do MongoDB.
- server/src/routes/: define as rotas de login e de conteúdo.
- server/src/middleware/auth.js: confere o token antes de permitir uma alteração.

## Publicar no GitHub

Crie um repositório vazio no GitHub e, na pasta principal do projeto, execute os comandos abaixo. Troque a URL pelo endereço do repositório criado:

~~~powershell
git init
git add .
git commit -m "Implementa catálogo Technologic com API e MongoDB"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/technologic-catalogo.git
git push -u origin main
~~~

Os arquivos .env e as imagens enviadas ficam fora do Git. O GitHub guarda o código; para outras pessoas acessarem o app pelo celular fora da sua rede, a API também precisa ser hospedada em um servidor público e o endereço público configurado em EXPO_PUBLIC_API_URL. Para esta apresentação local, mantenha a API rodando no seu computador.

## Expo SDK 54

Este template usa Expo SDK 54 e expo-image-picker 17.0.11. A seleção de imagens usa launchImageLibraryAsync e trata o resultado cancelado conforme a [documentação versionada do SDK 54](https://docs.expo.dev/versions/v54.0.0/sdk/imagepicker/).
