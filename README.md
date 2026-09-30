<p align="center"><img src="assets/icon.png" width="96" alt="Taoyuan"></p>

<h1 align="center">Taoyuan MCP — write a song for one person</h1>

<p align="center">
Tell your AI assistant who the song is for. About a minute later you get lyrics, two full versions and cover art.<br>
Works in Claude Desktop, Claude Code, ChatGPT, Cursor, Coze and any MCP or OpenAPI client.
</p>

<p align="center">
<a href="https://www.npmjs.com/package/taoyuan-mcp"><img src="https://img.shields.io/npm/v/taoyuan-mcp?label=npm" alt="npm"></a>
<a href="https://www.musicsforyou.com/developers">Docs</a> ·
<a href="https://api.musicsforyou.com/openapi.json">OpenAPI</a> ·
<a href="https://www.musicsforyou.com/llms.txt">llms.txt</a> ·
<a href="#中文">中文</a>
</p>

---

> "Write a warm birthday song for my mum turning 60 — she loves singing in the kitchen."
>
> → 《Kitchen Radio》, 2 × 2:30 MP3, lyrics, cover. One tool call, one credit.

## Quick start

**Claude Desktop** — add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "taoyuan": {
      "command": "npx",
      "args": ["-y", "taoyuan-mcp"],
      "env": { "TAOYUAN_API_KEY": "ty_live_…" }
    }
  }
}
```

**Claude Code / Cursor / anything that speaks remote MCP** — no install:

```bash
claude mcp add --transport http taoyuan https://api.musicsforyou.com/mcp \
  --header "Authorization: Bearer ty_live_…"
```

**claude.ai connectors / ChatGPT** — add the URL `https://api.musicsforyou.com/mcp`; OAuth sign-in is built in, no key needed.

**REST** — one call, finished song back:

```bash
curl https://api.musicsforyou.com/v1/songs \
  -H "Authorization: Bearer ty_live_…" -H "Content-Type: application/json" \
  -d '{"text":"A gentle lullaby for my daughter Mia, she loves the moon","waitSeconds":180}'
```

Get a key at **https://www.musicsforyou.com/developers**. New keys come with **3 free credits**. Generation costs 1 credit per call (you get two versions); compiling and revising are free.

## Tools

| Tool | Cost | What it does |
|---|---|---|
| `create_song` | 1 credit | One call: who the song is for → lyrics + two full versions + cover (server waits up to 180 s) |
| `compile_music_prompt` | free | Turn a request into title / lyrics / style so the user can read it first |
| `revise_generation_prompt` | free | Apply an edit ("stronger chorus", "female voice") to a plan |
| `generate_music` | 1 credit | Submit a plan; returns a generation id (two versions) |
| `get_generation` | free | Poll; supports `waitSeconds` long-poll |
| `replace_section` | 1 credit | Redo only one part of a finished song |
| `separate_stems` | free once per song | Vocals / instrumental split (12-stem split needs Pro) |
| `list_tracks` `list_presets` `get_credit_balance` `get_purchase_link` | free | Library, scenes, balance, Stripe checkout link |

The server also exposes MCP **prompts** (birthday, wedding, podcast intro…) and **resources** (scene knowledge cards, track details).

## How it works

Taoyuan is not a raw text-to-music wrapper. Your sentence goes through a songwriting compiler that decides structure, imagery and language, writes sectioned lyrics in the second person, and picks a style; the result is generated as two full candidates with cover art. Lyrics are written from the story, never copied from the prompt. Languages: Chinese, Cantonese, English, Japanese.

- Auth: API key (`ty_live_…`) or OAuth 2.1 (PKCE, dynamic client registration) — `https://api.musicsforyou.com/.well-known/oauth-authorization-server`
- Rate limits: 10 calls / min, 300 / day per key
- Webhooks: `PUT /v1/api-keys/:id/webhook` → HMAC-signed `generation.finished`
- Pricing: 10 songs US$9.9 · 50 songs US$39 (card, WeChat Pay, Alipay)

## Examples

- [`examples/claude_desktop_config.json`](examples/claude_desktop_config.json)
- [`examples/openai-agents.py`](examples/openai-agents.py) — OpenAI Agents SDK over MCP
- [`examples/curl.sh`](examples/curl.sh) — REST one-shot

## This package

`taoyuan-mcp` is a small stdio → Streamable HTTP proxy (37 lines). Tool definitions live on the server, so the package never goes stale. Env: `TAOYUAN_API_KEY` (required), `TAOYUAN_MCP_URL` (optional override).

## Privacy & terms

Songs you generate are yours to use, including commercially on the paid plans. [Terms](https://www.musicsforyou.com/terms) · [Privacy](https://www.musicsforyou.com/privacy) · Support: 2368082693@qq.com

---

## 中文

**桃源 MCP：为一个人写一首歌。** 在 Claude、ChatGPT、Cursor、扣子里说一句「给我妈 60 岁生日写首歌」，一分钟左右拿到歌词、两个完整版本和封面。

- Claude Desktop：上面的 `claude_desktop_config.json` 片段，`npx -y taoyuan-mcp`
- Claude Code / Cursor：`claude mcp add --transport http taoyuan https://api.musicsforyou.com/mcp --header "Authorization: Bearer ty_live_…"`
- claude.ai / ChatGPT 连接器：填 `https://api.musicsforyou.com/mcp`，内置 OAuth 登录
- 扣子 / Dify：导入 `https://api.musicsforyou.com/openapi-coze.json`

API Key 在 https://www.musicsforyou.com/developers 创建，新 Key 送 3 次。生成 1 次扣 1 个额度（两个版本），编译与修改免费。额度包：10 次 US$9.9、50 次 US$39、100 次 ¥300，支持微信、支付宝、银行卡。

License: MIT
