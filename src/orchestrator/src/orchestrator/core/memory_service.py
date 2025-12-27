from langgraph.checkpoint.memory import InMemorySaver


checkpointer = InMemorySaver()


# import sqlite3
# from langgraph.checkpoint.sqlite import SqliteSaver

# db_path = "data/agent_conversations.db"
# conn = sqlite3.connect(db_path, check_same_thread=False)
# memory = SqliteSaver(conn)

# from langgraph.checkpoint.memory import InMemorySaver

# def get_checkpointer():
#     # checkpointer = InMemorySaver()
#     # return checkpointer
#     return InMemorySaver()

# from langgraph.checkpoint.sqlite import SqliteSaver
# import sqlite3

# # Create (or open) SQLite DB file
# conn = sqlite3.connect("data/checkpoints.sqlite", isolation_level=None)

# # Initialize checkpointer
# get_checkpointer = SqliteSaver(conn)
