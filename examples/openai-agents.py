"""Use Taoyuan from the OpenAI Agents SDK via MCP (streamable HTTP).

pip install openai-agents
export OPENAI_API_KEY=...  TAOYUAN_API_KEY=ty_live_...
"""
import asyncio, os
from agents import Agent, Runner
from agents.mcp import MCPServerStreamableHttp

async def main():
    async with MCPServerStreamableHttp(
        name="taoyuan",
        params={
            "url": "https://api.musicsforyou.com/mcp",
            "headers": {"Authorization": f"Bearer {os.environ['TAOYUAN_API_KEY']}"},
        },
        client_session_timeout_seconds=200,
    ) as taoyuan:
        agent = Agent(
            name="Songwriter",
            instructions="When the user wants a song, call create_song and reply with the title, one audio link and the lyrics.",
            mcp_servers=[taoyuan],
        )
        result = await Runner.run(agent, "Write a gentle lullaby for my daughter Mia, she loves the moon.")
        print(result.final_output)

asyncio.run(main())
