# sqlite_cp.py
from langgraph.checkpoint.sqlite.aio import AsyncSqliteSaver

DB_PATH = "data/checkpoints.sqlite"
saver: AsyncSqliteSaver | None = None  # global reference

def set_saver(instance: AsyncSqliteSaver):
    """Assign the saver once during lifespan startup."""
    global saver
    saver = instance

def clear_saver():
    """Reset the saver on shutdown."""
    global saver
    saver = None

def get_saver() -> AsyncSqliteSaver:
    """FastAPI dependency to inject saver."""
    if saver is None:
        raise RuntimeError("Checkpointer not initialized")
    return saver


# # sqlite_cp.py
# from langgraph.checkpoint.sqlite.aio import AsyncSqliteSaver

# DB_PATH = "data/checkpoints.sqlite"
# saver: AsyncSqliteSaver | None = None  # global instance

# # async def init_saver():
# #     """Initialize AsyncSqliteSaver once at startup."""
# #     global saver
# #     if saver is None:
# #         saver = await AsyncSqliteSaver.from_conn_string(DB_PATH).__aenter__()
# #     return saver

# # async def shutdown_saver():
# #     """Cleanly close AsyncSqliteSaver at shutdown."""
# #     global saver
# #     if saver is not None:
# #         await saver.__aexit__(None, None, None)
# #         saver = None

# def get_saver() -> AsyncSqliteSaver:
#     """FastAPI dependency — same style as get_db in SQLAlchemy."""
#     if saver is None:
#         raise RuntimeError("Checkpointer not initialized")
#     return saver
