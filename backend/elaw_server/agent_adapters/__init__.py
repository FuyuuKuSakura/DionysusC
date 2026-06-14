"""Agent adapter implementations for ELAW."""

from __future__ import annotations

from elaw_server.models import AgentEvent

from .base import AgentInput, IAgentAdapter
from .registry import AdapterRegistry

__all__ = ["IAgentAdapter", "AgentInput", "AgentEvent", "AdapterRegistry"]
