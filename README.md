# Finance Helper
Este projeto tem como objetivo auxiliar a organização de informações financeiras relacionadas a investimentos em bolsa de valores.

A principal funcionalidade é a consolidação dos dados financeiros por meio de um carteira pessoal que contenha o registro das possíveis ao longo do histórico de investimentos, assim como as ordens realizados por meio das notas de corretagem.

## Configuração

Para a execução do projeto, o primeiro passo consiste na criação de um banco de dados relacional.
É recomendado o banco de dados PostgresSQL, mas acreditasse que não existe nenhum limitante quanto aos demais bancos.

> Além disso, pode-se usar o banco de dados por meio de um container Docker, em que as configurações para criação do container estão no arquivo _docker-compose-example.yml_ .

> Para usar o arquivo _docker-compose-example.yml_ será necessário o Docker Compose também na máquina.

Abaixo segue os comandos realizados para a criação do banco de dados:

```sql
create database financehelper with encoding='UTF8' owner='postgres';
```

Para listar os bancos criados basta executar:

```
\l;
```

Em seguida para escolher o banco de dados, deve-se executar:

```
\c financehelper;
```

Por fim, consultar as tabelas de dados:

```sql
select * from "Orders";
```

Adicionalmente, é recomendado a realização de backup do banco de dados, para isso execute o seguinte comando:

```bash
docker exec -t <container-id> pg_dumpall -c -U <db-user> | gzip > ./dump_$(date +"%Y-%m-%d_%H_%M_%S").gz
```

Para restaurar o banco de dados a partir do backup

```bash
gunzip < your_dump.sql.gz | docker exec -i <container-id> psql -U <db-user> -d <db-name>
```

A partir da criação do banco de dados, é necessária a criação do arquivo _.env_ para definir as variáveis de ambiente:

```
/*porta de execução da API*/
PORT=8000
/*diretório de armazenamento das notas de corretagem*/
BROKAGE_NOTES_DIR=
/*URL de conexão com a nase de dados*/
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
/*máximo de notas de corretagem processadas por chamada*/
MAX_NOTES_PER_EXECUTION=10
```

## Endpoints

### Criar carteira
Criação de carteira para registro de ativos

```http
POST {{base_url}}/wallets HTTP/1.1
Content-Type: application/json

{
  "id": "wallet-test",
  "owner": "João Silva Santos"
}
```

### Upload de nota de corretagem
Fazer o carregamento de uma ou mais notas de corretagem.

```http
POST {{base_url}}/wallets/{{walletId}}}/brokage-notes/upload HTTP/1.1

#files
notes[0] = 2019-09-12.pdf
notes[1] = 2019-10-11.pdf
```

### Extrair ordens de uma nota de corretagem
Extrai as ordens de uma nota, persiste a informação, atualiza a posição e retorna a lista de ordens.

```http
POST {{base_url}}/orders HTTP/1.1

{
  "date": "2019-07-08", /*data da nota de corretagem*/
  "wallet": {{walletId}}
}
```

### Extração de notas de corretagem pendentes em lote
Realiza a extração das ordens das notas de corretagem e realiza a consolidação das posições (processamento lote).

As notas de corretagem pendentes são os arquivos previamente carregados mas ainda não processados.

```http
POST {base_url}}/wallets/{{walletId}}/brokage-notes HTTP/1.1
```