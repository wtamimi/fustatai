from src.models.orchestrator import Orchestrator as DbOrchestrator

def get_system_prompt(orchestrator: DbOrchestrator) -> str:
        """Convert agent config to system instruction"""

        prompt = f"""You are {orchestrator.name}.

Your goal is {orchestrator.description}.

You always follow these Instructions:
{orchestrator.instructions}
"""
#         if orchestrator.agents:
#                 prompt += f"""
# Make use of your trusted agents to handle the request.  
# """
#                 for agent in orchestrator.agents:
#                         prompt += f"""- **{agent.name}**: {agent.description}.
# """
#                 prompt += f"""
# Use internal knowledge only if no relevant agent result is returned. Clearly indicate which agent were used.

# Avoid hallucinating data. If you do not know something, try to find it using your trusted agents.
# """

        return prompt
