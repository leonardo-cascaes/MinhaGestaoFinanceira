# MGF — Backend (.NET 10)

API monolítica em **3 camadas** para o projeto **Minha Gestão Financeira**.

## Stack

| Item | Versão |
|------|--------|
| .NET | 10 |
| C# | latest (`LangVersion` no `Directory.Build.props`) |
| API | ASP.NET Core Web API |
| Persistência | Entity Framework Core + SQLite |

## Arquitetura

```
backend/
├── MGF.slnx
├── Directory.Build.props
└── src/
    ├── MGF.Api              → Apresentação (controllers, HTTP, CORS, OpenAPI)
    ├── MGF.Application      → Negócio (entidades, serviços, contratos)
    └── MGF.Infrastructure   → Dados (EF Core, DbContext, repositórios)
```

### Fluxo de dependências

```
MGF.Api  →  MGF.Application
         →  MGF.Infrastructure  →  MGF.Application
```

- **Api**: expõe endpoints REST; não contém regra de negócio.
- **Application**: entidades de domínio, interfaces de repositório/serviço e implementação dos serviços.
- **Infrastructure**: implementa persistência (SQLite) e registra repositórios no DI.

## Executar

```bash
cd backend
dotnet restore
dotnet run --project src/MGF.Api
```

- Swagger UI (somente Development): `http://localhost:5029/swagger`
- Health check: `GET /api/health`

## Próximos passos sugeridos

1. Controllers para despesas, receitas e saldo
2. DTOs e mapeamentos na camada Application
3. Migrations EF Core (`dotnet ef migrations add Initial`)
4. Integração com o frontend Angular (`http://localhost:4200` já liberado no CORS)
