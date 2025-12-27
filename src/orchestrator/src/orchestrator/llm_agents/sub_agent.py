from src.orchestrator.llm_agents.sub_agent_prompt import get_system_prompt
from src.models.agent import Agent as DbAgent
from src.models.api_key import ApiKey as DbApiKey

from src.orchestrator.core.llm_provider import get_llm
from src.orchestrator.core.mcp_service import get_mcp_servers_tools
from langgraph.prebuilt import create_react_agent

#from src.orchestrator.core.memory_service import get_checkpointer


async def get_sub_agent(dbAgent: DbAgent, checkpointer = None, enable_checkpoint: bool = False):

    apiref: DbApiKey = dbAgent.api_key

    AGENT_MODEL = get_llm(
        provider = apiref.provider_name.lower(),
        model = apiref.model_name.lower(), 
        api_key = apiref.secret_key
    )

    agent_name = str(dbAgent.name).replace(' ', '_')

    tools = []

    if dbAgent.mcp_servers:
        tools = await get_mcp_servers_tools(dbAgent.mcp_servers)

    # for t in tools:
    #     print(type(t), t)

    agent = None

    if enable_checkpoint:
        agent = create_react_agent(
            model=AGENT_MODEL,
            name=agent_name,
            prompt=get_system_prompt(dbAgent),
            tools=tools,
            checkpointer=checkpointer
        )
    else:
        agent = create_react_agent(
            model=AGENT_MODEL,
            name=agent_name,
            prompt=get_system_prompt(dbAgent),
            tools=tools
        )
    
    return agent



        # agent = create_react_agent(
        #     model=AGENT_MODEL,
        #     tools=tools,
        #     name=dbAgent.name,
        #     prompt=get_system_prompt(dbAgent),
        # )
        
        # return agent
    
    # checkpoint = None

    # if enable_checkpoint:
    #     checkpoint = checkpointer
    
    # agent = create_react_agent(
    #     model=AGENT_MODEL,
    #     name=dbAgent.name,
    #     prompt=get_system_prompt(dbAgent),
    #     tools=tools,
    #     checkpointer=checkpoint
    # )

