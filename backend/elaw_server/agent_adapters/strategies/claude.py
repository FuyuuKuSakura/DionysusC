"""Strategy for the Anthropic Claude Code CLI."""

from __future__ import annotations

import uuid
from typing import Any

from elaw_server.models import AgentEvent, StatusEnum

from ..strategy import JSONStreamStrategy


class ClaudeStrategy(JSONStreamStrategy):
    @property
    def adapter_id(self) -> str:
        return "claude_cli"

    @property
    def supports_mode(self) -> list[str]:
        return ["normal", "plan", "yolo", "plan_yolo"]

    @property
    def supports_model(self) -> bool:
        return True

    def build_args(
        self,
        text: str,
        session_id: str | None,
        mode: str,
        config: dict[str, Any],
    ) -> list[str]:
        output_format = config.get("output_format", "stream-json")
        # Claude uses --session-id on first turn and -r to resume.
        if session_id is None:
            session_id = str(uuid.uuid4())

        if mode in ("plan", "plan_yolo"):
            text = (
                "Please enter plan mode: list clear execution steps first, "
                "then wait for confirmation before implementing.\n\n" + text
            )

        args = [
            "-p",
            text,
            "--output-format",
            output_format,
            "--session-id",
            session_id,
        ]
        # On subsequent turns resume the existing session.
        if session_id:
            args.extend(["-r", session_id])

        model = config.get("model")
        if model:
            args.extend(["--model", model])

        if output_format == "stream-json":
            args.extend(["--verbose", "--include-partial-messages"])

        if mode in ("yolo", "plan_yolo"):
            args.append("--dangerously-skip-permissions")

        return args

    def extract_session_id(self, parsed: dict[str, Any]) -> str | None:
        # Claude's JSON result may include a session_id in result metadata.
        return parsed.get("session_id")

    def _normalize_object(self, parsed: dict[str, Any]) -> list[AgentEvent]:
        events: list[AgentEvent] = []
        msg_type = parsed.get("type")

        # Claude stream-json assistant content.
        if msg_type in ("content_block_delta", "message_delta"):
            text = parsed.get("delta", {}).get("text") or parsed.get("text", "")
            if text:
                events.append(
                    AgentEvent(
                        type="status_update",
                        payload={"status": StatusEnum.OUTPUTTING, "detail": "Claude 正在输出..."},
                    )
                )
                events.append(
                    AgentEvent(
                        type="agent_stream",
                        payload={"chunk": text, "is_final": False, "status": "outputting"},
                    )
                )
            return events

        # Claude tool events.
        if msg_type in ("tool_use", "tool_result"):
            name = parsed.get("name", "tool")
            content = parsed.get("content", "")
            chunk = f"🔧 Claude tool: {name}\n"
            if content:
                chunk += f"🛠️ result: {content}\n"
            events.append(
                AgentEvent(
                    type="agent_stream",
                    payload={"chunk": chunk, "is_final": False, "status": "outputting"},
                )
            )
            return events

        # Result envelope in --output-format json mode.
        if "result" in parsed and isinstance(parsed["result"], str):
            events.append(
                AgentEvent(
                    type="agent_stream",
                    payload={
                        "chunk": parsed["result"],
                        "is_final": False,
                        "status": "outputting",
                    },
                )
            )
            return events

        return super()._normalize_object(parsed)
