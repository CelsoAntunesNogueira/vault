# VAULT — Password Security Tool



***


```
██╗   ██╗ █████╗ ██╗   ██╗██╗  ████████╗
██║   ██║██╔══██╗██║   ██║██║  ╚══██╔══╝
██║   ██║███████║██║   ██║██║     ██║   
╚██╗ ██╔╝██╔══██║██║   ██║██║     ██║   
 ╚████╔╝ ██║  ██║╚██████╔╝███████╗██║   
  ╚═══╝  ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝   
```

**Analise e gere senhas à prova de invasores**







[🔍 Demo ao Vivo](#) · [🐛 Reportar Bug](../../issues) · [✨ Sugerir Feature](../../issues)

</div>

***

## 📸 Preview

> Interface escura com estética cyberpunk, tipografia monospace e animações em neon verde.

***

## 🚀 Sobre o Projeto

**VAULT** é uma ferramenta de segurança 100% client-side para análise e geração de senhas robustas. Nenhuma senha é enviada a servidores — todo o processamento acontece diretamente no navegador do usuário.

A ferramenta foi desenvolvida como um exercício de UI/UX moderno aliado a conceitos reais de criptografia aplicada, utilizando apenas HTML, CSS e JavaScript puro — sem dependências externas de lógica.

***

## ✨ Funcionalidades

### 🔍 Verificador de Senhas
- **Força em 5 níveis** — de *Muito Fraca* a *Muito Forte*, com barra visual animada
- **Tempo estimado de quebra** — simulação baseada em 10 bilhões de tentativas/segundo (GPU moderna)
- **Entropia calculada** em bits — métrica técnica de aleatoriedade real
- **Pool de caracteres e combinações** — estatísticas detalhadas da senha
- **Checklist de critérios** — comprimento, maiúsculas, minúsculas, números, símbolos e tamanho ideal
- **Detecção de senhas comuns** — alerta imediato para senhas vazadas conhecidas

### ⚡ Gerador de Senhas
- **Comprimento configurável** de 4 a 128 caracteres via slider interativo
- **Opções de charset granulares**:
  - Maiúsculas (A–Z)
  - Minúsculas (a–z)
  - Números (0–9)
  - Símbolos comuns (`!@#$%...`)
  - Símbolos extras (`[]{}|;...`)
  - Evitar caracteres ambíguos (`0`, `O`, `l`, `1`)
- **Garantia de representatividade** — ao menos um caractere de cada tipo selecionado
- **Aleatoriedade criptográfica** via `crypto.getRandomValues()`
- **Shuffle Fisher-Yates** para distribuição uniforme
- **Barra de entropia estimada** em tempo real
- **Cópia com um clique** + toast de confirmação

***

## 🛡️ Segurança & Privacidade

| Aspecto | Implementação |
|---|---|
| Processamento | 100% local, sem servidor |
| Aleatoriedade | `crypto.getRandomValues()` (CSPRNG) |
| Armazenamento | Nenhum dado é salvo |
| Dependências externas | Apenas fontes Google Fonts (tipografia) |
| Senhas comuns | Lista negra local com +30 senhas conhecidas |

> **Sua senha nunca sai do seu navegador.**

***

## 🧮 Como o Cálculo Funciona

### Entropia
```
H = log₂(P^L)
```
Onde `P` = pool de caracteres disponíveis e `L` = comprimento da senha.

### Tempo de Quebra (estimativa)
```
T = (2^H / 2) / 10.000.000.000 segundos
```
Assume um atacante com GPU moderna realizando **10 bilhões de tentativas por segundo** — cenário de ataque offline realista.

***

## 📁 Estrutura do Projeto

```
vault/
├── index.html       
└── style.css
└── script.js
└── README.md        # Este arquivo
```

> O projeto é intencionalmente single-file para máxima portabilidade e facilidade de deploy.

***

## 🖥️ Como Usar

### Opção 1 — Abrir diretamente
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/vault.git

# Abra no navegador
cd vault && open index.html   # macOS
cd vault && xdg-open index.html  # Linux
```

### Opção 2 — GitHub Pages
1. Faça fork do repositório
2. Vá em **Settings → Pages**
3. Selecione `main` branch como source
4. Acesse em `https://seu-usuario.github.io/vault`

### Opção 3 — Live Server (VS Code)
```bash
# Com a extensão Live Server instalada
# Clique com botão direito em index.html → "Open with Live Server"
```

***

## 🎨 Design System

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#080b10` | Fundo principal |
| `--accent` | `#00f5a0` | Neon verde — ações e destaques |
| `--accent2` | `#00d4ff` | Neon azul — gradientes |
| `--danger` | `#ff3a5c` | Alertas e senhas fracas |
| `--warn` | `#ffb347` | Avisos de nível médio |
| Font Display | `Syne` | Títulos e UI |
| Font Mono | `Space Mono` | Dados técnicos e senhas |

***

## 🔧 Possíveis Melhorias Futuras

- [ ] Integração com API HaveIBeenPwned para verificação de vazamentos reais
- [ ] Modo passphrase (ex: `cavalo-bateria-grampo-correto`)
- [ ] Histórico de senhas geradas (sessão local)
- [ ] Exportação para `.txt` criptografado
- [ ] Tema claro / dark toggle
- [ ] PWA — instalável como aplicativo offline
- [ ] Internacionalização (EN / ES)

***

## 📄 Licença

Distribuído sob a licença **MIT**. Veja [`LICENSE`](LICENSE) para mais detalhes.

***

<div align="center">

Feito com 🖤 e `crypto.getRandomValues()`

**[⬆ Voltar ao topo](#)**

</div>
```

---

## Dicas para publicar

- **Adicione uma screenshot real** ao README substituindo a seção `Preview` por `![VAULT Preview](preview.png)` — basta tirar um print da interface e commitar junto
- **Crie o link da demo** via GitHub Pages e cole no badge `Demo ao Vivo` no topo
- **Adicione um `LICENSE` file** (MIT) pelo próprio GitHub na hora de criar o repo para o badge de licença funcionar corretamente
