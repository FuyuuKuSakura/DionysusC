"""Load persona YAML files from the configured personas directory."""

from __future__ import annotations

from pathlib import Path
from typing import Any

import structlog
import yaml

from dionysus_server.config import get_config_dir

logger = structlog.get_logger()

_PERSONA_DIR = get_config_dir() / "personas"


def _load_yaml_file(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as f:
        return yaml.safe_load(f) or {}


def load_persona(persona_id: str) -> dict[str, Any]:
    """Load a single persona by id from ``config/personas/{id}.yaml``."""
    path = _PERSONA_DIR / f"{persona_id}.yaml"
    if not path.exists():
        path = _PERSONA_DIR / f"{persona_id}.yml"
    if not path.exists():
        logger.warning("persona_not_found", persona_id=persona_id)
        return {}
    return _load_yaml_file(path)


def list_personas() -> list[dict[str, Any]]:
    """List all personas in the personas directory."""
    personas: list[dict[str, Any]] = []
    if not _PERSONA_DIR.exists():
        return personas

    seen_ids: set[str] = set()
    for path in sorted(_PERSONA_DIR.glob("*.yaml")):
        data = _load_yaml_file(path)
        persona_id = data.get("id")
        if persona_id and persona_id not in seen_ids:
            personas.append(data)
            seen_ids.add(persona_id)

    for path in sorted(_PERSONA_DIR.glob("*.yml")):
        data = _load_yaml_file(path)
        persona_id = data.get("id")
        if persona_id and persona_id not in seen_ids:
            personas.append(data)
            seen_ids.add(persona_id)

    return personas
