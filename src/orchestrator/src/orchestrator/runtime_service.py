from sqlalchemy.ext.asyncio import AsyncSession

from src.crud.agent import get_agent as get_dbAgent
from src.crud.orchestrator import get_orchestrator as get_dbOrchestrator

from src.orchestrator.llm_agents.main_agent import get_main_agent
from src.orchestrator.llm_agents.sub_agent import get_sub_agent

# In-memory storage for compiled graph
graph_store = {}


async def get_agent(db: AsyncSession, agentId: str, checkpointer):

    if agentId in graph_store:
        print(f"Graph {agentId} retrieved from memory")
        graph = graph_store.get(agentId)
        return graph
    
    graph = await get_main_agent_graph(db, agentId, checkpointer)

    if not graph:
        graph = await get_sub_agent_graph(db, agentId, checkpointer)

    if agentId not in graph_store:
        print(f"Graph {agentId} added to memory")
        graph_store[agentId] = graph

    return graph


async def get_main_agent_graph(db: AsyncSession, agentId: str, checkpointer):
    # get orchestrator
    print(f"### Orchestrator Chat")
    orchestrator = await get_dbOrchestrator(db, agentId)
    if not orchestrator:
        print("Orchestrator not found")
        return None
    
    graph = await get_main_agent(orchestrator, checkpointer)

    return graph


async def get_sub_agent_graph(db: AsyncSession, agentId: str, checkpointer):
    # get agent
    print(f"### Agent Chat")
    agent = await get_dbAgent(db, agentId)
    if not agent:
        print("Agent not found")
        return None
    
    graph = await get_sub_agent(agent, checkpointer, True)

    return graph

