from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_groq import ChatGroq
from langchain_ollama import ChatOllama
from langgraph.prebuilt import create_react_agent
# from langchain.schema import SystemMessage
from langchain.prompts import ChatPromptTemplate


def create_agent(provider: str, api_key: str, model: str, agent_name: str, system_prompt: str):
    """
    Creates a dynamic LangGraph ReAct agent based on user input.
    """
    llm = get_llm(provider, api_key, model)

    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
    ])

    agent = create_react_agent(
        llm,
        prompt=prompt,
        name=agent_name,
        tools=[],  # we can add search, RAG, etc. later
        debug=True,
        state_schema=None  # defaults to handling messages + tools
    )

    return agent


def get_llm(provider: str, api_key: str, model: str):
    """
    Returns an LLM instance for the given provider.
    """
    if provider == "openai":
        return ChatOpenAI(api_key=api_key, model=model, streaming=True)
    elif provider == "anthropic":
        return ChatAnthropic(api_key=api_key, model=model, streaming=True)
    elif provider == "gemini" or provider == "google":
        return ChatGoogleGenerativeAI(api_key=api_key, model=model, streaming=True)
    elif provider == "groq":
        return ChatGroq(api_key=api_key, model=model, streaming=True)
    elif provider == "ollama":
        # For Ollama, assume local setup, API key not needed
        return ChatOllama(model=model, streaming=True)
    else:
        raise ValueError(f"Unsupported provider: {provider}")
