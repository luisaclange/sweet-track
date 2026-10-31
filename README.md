# SweetTrack

Projeto de extensão desenvolvido durante o curso de Ciência da Computação - UNOPAR.

Trata-se de um sistema simples e intuitivo para gestão de pedidos para pequenos empreendimentos de venda de produtos, mais voltado para a área de doces caseiros.

## Como funciona?

Na tela inicial da aplicação é possível ver a seção Lotes, sendo esse uma adequação à realidade do projeto, em que lote é um determinado período de tempo em que são feitos os pedidos e entregues. Geralmente tem duração de uma semana.

Ao criar um lote, é informado o nome para identificação e o período tratado. Em cada lote há os seus Pedidos, em que cada pedido possui o nome do cliente e a quantidade de cada produto desejado.

Na tela inicial há também a seção de Produtos, nos quais são cadastrados os produtos que são produzidos na empresa.

## Para rodar o projeto

### 1. Backend

```
cd backend
npm i
npm run start
```

Para a conexão com o banco de dados, adicione ao `.env` da pasta backend a variável de ambiente `FIREBASE_SERVICE_ACCOUNT` com o valor da chave privada obtida no Firebase, e a variável `PORT` para informar o valor da porta da aplicação (por default 5000).

### 2. Frontend

```
cd frontend
npm i
npm run dev
```

Para integrar com backend, adicione ao `.env` da pasta frontend a variável de ambiente `VITE_AXIOS_BACKEND_URL` com a url do backend rodando, geralmente `http://localhost:5000/api`.
