from src.models.orchestrator import Orchestrator as DbOrchestrator
from src.models.api_key import ApiKey as DbApiKey

from src.orchestrator.llm_agents.main_agent_prompt import get_system_prompt
from src.orchestrator.llm_agents.sub_agent import get_sub_agent

from langgraph_supervisor import create_supervisor
from langgraph.prebuilt import create_react_agent

from src.orchestrator.core.llm_provider import get_llm
#from src.orchestrator.core.memory_service import get_checkpointer


async def get_main_agent(dbOrchestrator: DbOrchestrator, checkpointer):

    apiref: DbApiKey = dbOrchestrator.api_key

    AGENT_MODEL = get_llm(
        provider = apiref.provider_name.lower(),
        model = apiref.model_name.lower(), 
        api_key = apiref.secret_key
    )

    agent_name = str(dbOrchestrator.name).replace(' ', '_')

    if dbOrchestrator.agents:
        subAgents = []

        for subAgent in dbOrchestrator.agents:
            sub_agent = await get_sub_agent(subAgent.agent)
            subAgents.append(sub_agent)

        # Create supervisor workflow
        workflow = create_supervisor(
            subAgents,
            model=AGENT_MODEL,
            supervisor_name=agent_name,
            prompt=get_system_prompt(dbOrchestrator),
            output_mode="full_history"
        )

        # Compile and run
        graph = workflow.compile(
            checkpointer=checkpointer
        )

        return graph


    agent = create_react_agent(
        model=AGENT_MODEL,
        name=agent_name,
        prompt=get_system_prompt(dbOrchestrator),
        checkpointer=checkpointer
    )
    
    return agent
