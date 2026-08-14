import type { Tool } from "../data";
import { ToolIcon } from "./tool-icons";

export function ToolLink({ tool }: { tool: Tool }) {
  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-link hover:text-link-hover inline-flex items-center gap-2 text-base leading-[1.8] transition-colors duration-150"
    >
      <ToolIcon name={tool.name} />
      <span>{tool.name}</span>
    </a>
  );
}