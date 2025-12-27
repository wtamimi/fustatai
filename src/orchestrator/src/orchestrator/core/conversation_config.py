from uuid import UUID

def get_convesation_config(conversation_id: UUID):
    config = {
        "configurable": {"thread_id": str(conversation_id)}
    }

    return config
