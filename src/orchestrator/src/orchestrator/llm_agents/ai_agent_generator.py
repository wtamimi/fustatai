# from agents import Agent, Runner
# from agents.extensions.models.litellm_model import LitellmModel

from src.orchestrator.llm_agents.ai_agent_generator_prompt import system_prompt

from src.models.api_key import ApiKey

from dataclasses import dataclass
from typing import Literal, List

@dataclass
class AgentSpec:
    name: str
    description: str 
    role: str
    task: str
    instructions: List[str]

async def generate_agent(api_key: ApiKey, user_prompt: str) -> AgentSpec:

    # AGENT_MODEL = LitellmModel(
    #     model = f"{api_key.provider_name.lower()}/{api_key.model_name.lower()}", 
    #     api_key = api_key.secret_key
    # )

    # agent = Agent(
    #     name="Agent Generator",
    #     instructions=system_prompt,
    #     model = AGENT_MODEL,
    #     output_type=AgentSpec,
    #     hooks=CustomAgentHooks(display_name="AI Agent Generator"),
    # )

    # result = await Runner.run(
    #     agent,
    #     user_prompt,
    # )

    # if isinstance(result.final_output, AgentSpec):
    #     return result.final_output
    # else:
    #     print(result.raw_responses)

    return None
