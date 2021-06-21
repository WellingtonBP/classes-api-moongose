## Instalação 

Instale as dependências com npm ou yarn e configure as variáveis do ambiente 'MONGO_URI' e 'PORT' (3000 por padrão).

### API

Endpoints                | Método       | Descrição
-------------------------|--------------|-------------------------------------
**/classes**             | **POST**     |Cria uma nova aula com os seguintes dados obrigatórios informados no corpo da requisição: "name", "description", "video", "date_init", "date_end". O campo video precisa ser uma URL e as datas o formato 'YYYYMMDD'. Retorna o código 201 e o id gerado caso tudo ocorra bem ou 422 e os campos inválidos caso haja erro de validação.
**/classes**             | **GET**      |Retorna uma lista paginada com as aulas cadastradas (50 por página) e o último comentário em cada aula (caso exista), o controle das páginas se dá pela query string "page" (1 por padrão). Código 200.
**/classes/:id**         | **GET**      |Retorna os detalhes da aula (informações da aula mais os três últimos comentários). Código 200 caso encontre a aula e 404 se não for encontrada.
**/classes**             | **PUT**      |Recebe no corpo da requisão o id de uma a ser aula atualizada com os dados informados também no corpo. Os campos a serem  atualizados são opcionais, se for informado algum dado que não faz parte de uma aula esse dado é ignorado. Retorna o código 200 e a indicação de quais campos foram atualizados, 422 caso haja erro de validação e 404 caso a aula ser atualizada não for encontrada.
**/classes/:id**         | **DELETE**   |Exclui o cadastro de uma aula e todos os comentários feitos nela. Retorna código 200 caso a operação seja realizada com sucesso e 404 caso a aula a ser excluída não for encontrada.
**/classes/comments**    | **POST**     |Adiciona um comentário informado no campo "comment" na aula cujo id for informado no campo "id_class", ambos os campos precisam ser informados no corpo da requisição. Retorna 201 com o id do comentário gerado caso tudo ocorra bem, 422 se o comentário for vazio e 404 caso não encontre a aula.
**/classes/comments**    | **GET**      |Retorna uma lista paginada com os comentários de uma aula (50 por página), o controle das páginas e o id da aula são passados via query strings nas variáveis "id_class" e "page" (1 por padrão), código 422 caso não seja informado um id ou 200 caso for informado. Exemplo: "/classes/comments?page=2&id_class=604db0714446c83bf45cc0b0".
**classes/comments/:id** | **DELETE**   |Exlui um comentário. Retorna código 200 caso a operação seja realizada com sucesso e 404 caso não encontre o comentário.

**Todos os id's informados também passam por validação, o código 422 é retornado caso não esteja em um formato válido (ObjectID).**