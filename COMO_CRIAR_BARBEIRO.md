# Como Criar um Usuário com Role Barbeiro

Este documento explica as diferentes formas de criar usuários com a role "barbeiro" no sistema.

## 🔒 Segurança

Por questões de segurança, **não é possível criar barbeiros diretamente no registro**. Apenas clientes podem se registrar normalmente. Barbeiros devem ser criados por outros barbeiros ou através de métodos especiais.

## 📋 Métodos para Criar Barbeiros

### Método 1: Criar o Primeiro Barbeiro (Endpoint Especial)

Se ainda não existe nenhum barbeiro no sistema, você pode usar um endpoint especial:

**Endpoint:** `POST /api/auth/create-first-barbeiro`

**Request Body:**
```json
{
  "name": "João Barbeiro",
  "email": "joao@barbearia.com",
  "password": "senhaSegura123"
}
```

**Exemplo com cURL:**
```bash
curl -X POST http://localhost:3001/api/auth/create-first-barbeiro \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Barbeiro",
    "email": "joao@barbearia.com",
    "password": "senhaSegura123"
  }'
```

**⚠️ Importante:** Este endpoint só funciona se **não houver nenhum barbeiro** no sistema. Após criar o primeiro barbeiro, use o Método 2.

---

### Método 2: Promover Cliente para Barbeiro (Recomendado)

Após ter pelo menos um barbeiro no sistema, outros barbeiros podem promover clientes para barbeiros:

**Endpoint:** `PUT /api/users/role`

**Headers:**
```
Authorization: Bearer <token_do_barbeiro>
```

**Request Body:**
```json
{
  "userId": "uuid-do-usuario",
  "role": "barbeiro"
}
```

**Exemplo com cURL:**
```bash
curl -X PUT http://localhost:3001/api/users/role \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token_do_barbeiro>" \
  -d '{
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "role": "barbeiro"
  }'
```

**Passos:**
1. O cliente se registra normalmente em `/api/auth/register`
2. Um barbeiro autenticado faz login e obtém um token
3. O barbeiro usa o token para promover o cliente usando o endpoint acima

---

### Método 3: Atualizar via SQL (Apenas para Primeiro Barbeiro)

Se preferir criar o primeiro barbeiro diretamente no banco de dados:

1. **Criar um usuário normal** através do endpoint `/api/auth/register`
2. **Copiar o ID do usuário** (encontre no Supabase Dashboard > Authentication > Users)
3. **Executar no SQL Editor do Supabase:**

```sql
UPDATE public.users 
SET role = 'barbeiro' 
WHERE id = 'USER_ID_AQUI'::uuid;
```

**Verificar se funcionou:**
```sql
SELECT id, name, email, role 
FROM public.users 
WHERE role = 'barbeiro';
```

---

## 📚 Endpoints Relacionados

### Listar Todos os Usuários (Apenas Barbeiros)

**Endpoint:** `GET /api/users/all`

**Headers:**
```
Authorization: Bearer <token_do_barbeiro>
```

**Resposta:**
```json
[
  {
    "id": "uuid",
    "name": "João",
    "email": "joao@email.com",
    "role": "barbeiro",
    "created_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "uuid",
    "name": "Maria",
    "email": "maria@email.com",
    "role": "cliente",
    "created_at": "2024-01-02T00:00:00Z"
  }
]
```

### Atualizar Role de Usuário

**Endpoint:** `PUT /api/users/role`

**Headers:**
```
Authorization: Bearer <token_do_barbeiro>
```

**Request Body:**
```json
{
  "userId": "uuid-do-usuario",
  "role": "barbeiro"  // ou "cliente"
}
```

**⚠️ Restrições:**
- Apenas barbeiros podem usar este endpoint
- Um barbeiro não pode remover sua própria role de barbeiro
- Roles válidas: `"cliente"` ou `"barbeiro"`

---

## 🔄 Fluxo Completo de Exemplo

### Cenário: Criar o primeiro barbeiro e depois promover um cliente

1. **Criar primeiro barbeiro:**
```bash
POST /api/auth/create-first-barbeiro
{
  "name": "João Barbeiro",
  "email": "joao@barbearia.com",
  "password": "senha123"
}
```

2. **Login do barbeiro:**
```bash
POST /api/auth/login
{
  "email": "joao@barbearia.com",
  "password": "senha123"
}
# Retorna: { "token": "...", "user": {...} }
```

3. **Cliente se registra:**
```bash
POST /api/auth/register
{
  "name": "Maria Cliente",
  "email": "maria@email.com",
  "password": "senha456"
}
# Retorna: { "id": "uuid-maria", ... }
```

4. **Barbeiro promove cliente:**
```bash
PUT /api/users/role
Headers: Authorization: Bearer <token_do_joao>
{
  "userId": "uuid-maria",
  "role": "barbeiro"
}
```

---

## ⚠️ Notas Importantes

- **Segurança:** Apenas barbeiros podem criar outros barbeiros
- **Primeiro Barbeiro:** Use o endpoint especial ou SQL para criar o primeiro
- **Tokens:** Sempre use o token de autenticação do barbeiro nos endpoints protegidos
- **Validação:** O sistema valida que apenas roles "cliente" ou "barbeiro" são aceitas

---

## 🐛 Troubleshooting

**Erro: "Já existem barbeiros no sistema"**
- Use o Método 2 (promover cliente) em vez do endpoint especial

**Erro: "Acesso negado. Apenas barbeiros podem realizar esta ação"**
- Verifique se você está usando o token de um barbeiro autenticado
- Verifique se o usuário realmente tem role "barbeiro" no banco

**Erro: "Usuário não encontrado"**
- Verifique se o `userId` está correto
- Certifique-se de que o usuário existe na tabela `users`

