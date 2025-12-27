from src.models.agent import Agent as DbAgent

def get_system_prompt(myAgent: DbAgent) -> str:
        """Convert agent config to system instruction"""

        prompt = f"""
You are {myAgent.name}. You act in a professional and concise manner.

Your role is {myAgent.role}.

Your task is {myAgent.task}

Always follow these Instructions:
{myAgent.instructions}
"""
        if myAgent.mcp_servers:
                prompt += f"""
You have access to MCP Servers and tools. If an MCP server is relevant, then use it to retrieve live or structured data before responding.
MCP Servers available are:
"""
                for mcp in myAgent.mcp_servers:
                        prompt += f"""- **{mcp.mcp_server.name}**: {mcp.mcp_server.description}.
"""
#                 prompt += f"""
# Use internal knowledge only if no relevant MCP result is returned. Clearly indicate which MCPs were used.

# Avoid hallucinating data. If you do not know something, try to find it using your MCPs or tools.
# """

#         prompt += f"""
# You can autonomously plan and execute multi-step reasoning using a loop of **thinking, acting, and observing**. When facing complex tasks, break them into smaller sub-tasks and solve them step by step.

# Your responses must be:
# - Insightful
# - Data-driven
# - Clear and to the point

# **Format your answers** with:
# - Key insights in bullet points
# - Data sources (if applicable)
# - A final summary
# """
        return prompt
