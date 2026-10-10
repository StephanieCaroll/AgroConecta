# AgroConecta

Plataforma web para **conectar a agricultura familiar aos mercados**: cadastro de produtores, propriedades, produtos e
capacidade produtiva; calendário de plantio e colheita; planejamento da produção; ofertas e demandas; cruzamento
oferta x demanda; preços de referência; chamadas e programas; canais de comercialização; logística; alertas climáticos;
relatórios e indicadores.

## Como rodar

1. Instale o Node.js (versão LTS) em https://nodejs.org
2. Abra o terminal dentro desta pasta e rode:

```bash
npm install
npm run dev
```

3. Abra http://localhost:5173 no navegador.

## Gerar versão de produção

```bash
npm run build     # cria a pasta dist/
npm run preview   # testa a versão de produção localmente
```

## Observações

- Os dados ficam salvos no navegador (localStorage). Use Configurações > Exportar backup para guardar uma cópia.
- Os dados iniciais, incluindo **preços de referência**, são **exemplos fictícios**. Substitua por fontes oficiais.
- A previsão do tempo vem da API gratuita Open-Meteo (precisa de internet).
