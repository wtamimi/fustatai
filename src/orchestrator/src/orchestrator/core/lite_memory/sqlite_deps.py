# # deps.py
# from fastapi import Depends
# from src.orchestrator.core.lite_memory.sqlite_cp import get_saver
# from langgraph.checkpoint.sqlite.aio import AsyncSqliteSaver

# async def get_checkpointer(
#     saver: AsyncSqliteSaver = Depends(get_saver),
# ) -> AsyncSqliteSaver:
#     return saver
