import type { ReactNode } from "react";

function Icon({
  children,
  width = 17,
  height = 17,
}: {
  children: ReactNode;
  width?: number;
  height?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={width}
      height={height}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

const strokeProps = {
  stroke: "currentColor",
  strokeWidth: 1.7,
  fill: "none",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const PlayIcon = (
  <Icon>
    <path
      d="M8.5 5.9v12.2c0 .8.9 1.3 1.6.9l9.3-6.1c.7-.4.7-1.4 0-1.8L10.1 5c-.7-.4-1.6.1-1.6.9z"
      fill="currentColor"
    />
  </Icon>
);

const SearchIcon = (
  <Icon>
    <circle cx="11" cy="11" r="6" {...strokeProps} />
    <path d="M15.5 15.5L20 20" {...strokeProps} />
  </Icon>
);

const SparkleIcon = (
  <Icon>
    <path
      d="M12 4l1.8 6.2L20 12l-6.2 1.8L12 20l-1.8-6.2L4 12l6.2-1.8z"
      fill="currentColor"
    />
  </Icon>
);

const GamepadIcon = (
  <Icon>
    <rect x="3.5" y="8" width="17" height="9" rx="4.5" {...strokeProps} />
    <path d="M6.5 11v4M4.5 13h4" {...strokeProps} />
    <circle cx="16" cy="11.5" r="0.9" fill="currentColor" />
    <circle cx="18" cy="13.5" r="0.9" fill="currentColor" />
  </Icon>
);

const LayersIcon = (
  <Icon>
    <path d="M12 3l8 3.9-8 3.9-8-3.9z" fill="currentColor" opacity="0.45" />
    <path d="M12 10.8l8 3.9-8 3.9-8-3.9z" fill="currentColor" opacity="0.7" />
    <path d="M12 18.6l8 3.9-8 3.9-8-3.9z" fill="currentColor" />
  </Icon>
);

const BoltIcon = (
  <Icon>
    <path
      d="M13.6 2.5l-7.8 10.7h4.9l-1.9 8.3 7.9-10.7h-4.9l1.8-8.3z"
      fill="currentColor"
    />
  </Icon>
);

const ClaudeIcon = (
  <Icon>
    <g
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      fill="none"
    >
      <path d="M12 4.5v15" />
      <path d="M5.4 8.25l13.2 7.5" />
      <path d="M18.6 8.25l-13.2 7.5" />
    </g>
  </Icon>
);

const TerminalIcon = (
  <Icon>
    <rect x="3.5" y="5" width="17" height="14" rx="2" {...strokeProps} />
    <path d="M7.5 9.5l3.5 2.5-3.5 2.5" {...strokeProps} />
    <path d="M13.5 14.5h4" {...strokeProps} />
  </Icon>
);

const CursorIcon = (
  <Icon>
    <rect x="2.5" y="2.5" width="19" height="19" rx="5" fill="currentColor" />
    <path
      d="M14.06 15.548l-2.712-1.088-1.38 2.35c-.356.606-1.28.39-1.328-.31l-.62-9.105c-.045-.664.653-1.066 1.203-.694l8.03 5.43c.528.357.318 1.185-.36 1.218l-3.015.15-1.66 2.31c-.313.43-.88.51-1.158-.26z"
      fill="var(--bg)"
    />
  </Icon>
);

const CodexIcon = (
  <Icon>
    <rect x="2.5" y="2.5" width="19" height="19" rx="5" fill="currentColor" />
    <path
      d="M9.5 9.5l5 5M14.5 9.5l-5 5"
      stroke="var(--bg)"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Icon>
);

const TriangleIcon = (
  <Icon>
    <path d="M12 2.7L21.6 19.7H2.4z" fill="currentColor" />
  </Icon>
);

const WaveIcon = (
  <Icon>
    <g stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" fill="none">
      <path d="M4 9c3-3.8 6 4 9 .2s4.8-2.8 7-1.2" />
      <path d="M4 13.6c3-3.4 6 3 9 0s5-2.6 7-.9" />
      <path d="M4 18.2c3-3 6 2.3 9 0s5-2.2 7-.7" />
    </g>
  </Icon>
);

const ZedIcon = (
  <Icon>
    <rect x="2.5" y="2.5" width="19" height="19" rx="5" fill="currentColor" />
    <path
      d="M8.5 8.2h7l-7 7.6h7"
      stroke="var(--bg)"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);

const ShadcnIcon = (
  <Icon>
    <rect x="2.5" y="2.5" width="19" height="19" rx="5" fill="currentColor" />
    <circle cx="12" cy="10" r="2.6" fill="var(--bg)" />
    <path
      d="M8 15.5h8"
      stroke="var(--bg)"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Icon>
);

const ReactIcon = (
  <Icon>
    <g stroke="currentColor" strokeWidth="1.5" fill="none">
      <ellipse cx="12" cy="12" rx="9" ry="3.8" />
      <ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(120 12 12)" />
    </g>
    <circle cx="12" cy="12" r="1.6" fill="currentColor" />
  </Icon>
);

const CurveIcon = (
  <Icon>
    <path
      d="M4 19.5C8.5 19.5 8.5 5 13 5s4.5 14 7 14"
      stroke="currentColor"
      strokeWidth="1.8"
      fill="none"
      strokeLinecap="round"
    />
  </Icon>
);

const RaySoIcon = (
  <Icon>
    <rect x="2.5" y="2.5" width="19" height="19" rx="5" fill="currentColor" />
    <circle
      cx="12"
      cy="12"
      r="4"
      fill="none"
      stroke="var(--bg)"
      strokeWidth="1.8"
    />
    <circle cx="12" cy="12" r="1.4" fill="var(--bg)" />
  </Icon>
);

const RaycastIcon = (
  <Icon>
    <path
      d="M12 4l2.6 5.4L20 12l-5.4 2.6L12 20l-2.6-5.4L4 12l5.4-2.6z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </Icon>
);

const RegexIcon = (
  <Icon>
    <path d="M5 6l14 13" {...strokeProps} />
    <path d="M17.2 5.5c.9 1.8 2 2.9 3.8 3.1-1.8.4-2.9 1.5-3.8 3.3-.6-1.4-1.6-2.5-3-3.1 1.4-.5 2.4-1.6 3-3.3z" fill="currentColor" />
  </Icon>
);

const ShareArrowIcon = (
  <Icon>
    <path d="M12 4v12" {...strokeProps} />
    <path d="M7 9l5-5 5 5" {...strokeProps} />
    <path d="M5 14v6h14v-6" {...strokeProps} />
  </Icon>
);

const CameraIcon = (
  <Icon>
    <rect x="2.5" y="7.5" width="14" height="10" rx="2" {...strokeProps} />
    <path d="M16.5 11l5-3.2v9.2l-5-3.2" {...strokeProps} />
  </Icon>
);

const ScissorsIcon = (
  <Icon>
    <circle cx="7" cy="7" r="2.6" {...strokeProps} />
    <circle cx="7" cy="17" r="2.6" {...strokeProps} />
    <path d="M9.2 9.2l10.3 10.3M9.2 14.8l10.3-10.3" {...strokeProps} />
  </Icon>
);

const ObsIcon = (
  <Icon>
    <circle cx="12" cy="12" r="9" fill="currentColor" />
    <circle cx="12" cy="12" r="3.2" fill="var(--bg)" />
    <path
      d="M15.5 12a3.5 3.5 0 0 1 3.5-3.5"
      stroke="var(--bg)"
      strokeWidth="1.8"
      strokeLinecap="round"
      fill="none"
    />
  </Icon>
);

const PencilIcon = (
  <Icon>
    <path
      d="M4 20l1-4L16.5 4.5a2 2 0 0 1 2.83 2.83L8 18l-4 2z"
      fill="currentColor"
    />
    <path d="M14.5 6.5l3 3" stroke="var(--bg)" strokeWidth="1.2" />
  </Icon>
);

const FigjamIcon = (
  <Icon>
    <circle cx="12" cy="12" r="9.3" fill="currentColor" />
    <path
      d="M12 8c.5 2.4 1.5 3.7 3.9 3.7-2.4 0-3.4 1.6-3.9 4-.5-2.4-1.5-4-3.9-4 2.4 0 3.4-1.3 3.9-3.7z"
      fill="var(--bg)"
    />
  </Icon>
);

const FramerIcon = (
  <Icon>
    <rect x="2.5" y="2.5" width="19" height="19" rx="5" fill="currentColor" />
    <path
      d="M9.5 6.5v11M9.5 6.5h6M9.5 12h4.5"
      stroke="var(--bg)"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Icon>
);

const MiroIcon = (
  <Icon>
    <circle cx="12" cy="12" r="9.2" fill="currentColor" />
    <g stroke="var(--bg)" strokeWidth="1.9" strokeLinecap="round">
      <path d="M14.9 7.3L9 16.7" />
      <path d="M12.4 7.3l-5.9 9.4" />
    </g>
  </Icon>
);

const LinearIcon = (
  <Icon>
    <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill="currentColor" />
    <g stroke="var(--bg)" strokeWidth="2" strokeLinecap="round">
      <path d="M17 7.4L9.3 16.8" />
      <path d="M13.6 7.4l-7.7 9.4" />
    </g>
  </Icon>
);

const ObsidianIcon = (
  <Icon>
    <path d="M12 3l9 9-9 9-9-9z" fill="currentColor" />
    <path
      d="M12 6.8L17.2 12 12 17.2 6.8 12z"
      fill="none"
      stroke="var(--bg)"
      strokeWidth="1.3"
    />
  </Icon>
);

const TrelloIcon = (
  <Icon>
    <rect x="3" y="3" width="18" height="18" rx="4" fill="#0079BF" />
    <rect x="7.5" y="8.5" width="3.4" height="7" rx="1.2" fill="#ffffff" />
    <rect x="13.1" y="8.5" width="3.4" height="4.6" rx="1.2" fill="#ffffff" />
  </Icon>
);

const PinterestIcon = (
  <Icon>
    <circle cx="12" cy="12" r="9" fill="#E60023" />
    <path
      d="M9.7 5.8h2.9a3.1 3.1 0 1 1 0 6.2H9.7"
      stroke="#ffffff"
      strokeWidth="2.1"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M9.7 5.8v12.4"
      stroke="#ffffff"
      strokeWidth="2.1"
      strokeLinecap="round"
    />
  </Icon>
);

const BlenderIcon = (
  <Icon>
    <circle cx="12" cy="12" r="9.3" fill="#F5792A" />
    <g
      stroke="#ffffff"
      strokeWidth="1.9"
      fill="none"
      strokeLinecap="round"
    >
      <path d="M11.5 6.5h3a3.2 3.2 0 0 1 0 6.4h-3" />
      <path d="M11.5 12.9h3.6a3.1 3.1 0 0 1 0 6.2h-3.6" />
    </g>
  </Icon>
);

const SplineIcon = (
  <Icon>
    <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill="currentColor" />
    <path
      d="M8 15.5h4.2a3 3 0 0 0 0-6H8"
      stroke="var(--bg)"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
  </Icon>
);

const RiveIcon = (
  <Icon>
    <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" {...strokeProps} />
    <path
      d="M9.3 6.5v11M9.3 6.5h3.3a3.4 3.4 0 0 1 0 6.8H9.3"
      stroke="currentColor"
      strokeWidth="1.7"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M12.8 13.3l3 4.7"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </Icon>
);

const ChatGptIcon = (
  <Icon>
    <path
      d="M12 2.6l8.1 4.7v9.4L12 21.4l-8.1-4.7V7.3z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <path
      d="M12 8.1c.5 2.4 1.5 3.9 3.9 3.9-2.4 0-3.4 1.5-3.9 3.9-.5-2.4-1.5-3.9-3.9-3.9 2.4 0 3.4-1.5 3.9-3.9z"
      fill="currentColor"
    />
  </Icon>
);

const GeminiIcon = (
  <Icon>
    <path
      d="M12 4.2c.6 4.4 2.1 6.3 6.8 6.3-4.7 0-6.2 2.2-6.8 6.8-.6-4.6-2.1-6.8-6.8-6.8 4.7 0 6.2-1.9 6.8-6.3z"
      fill="#4E8AF4"
    />
  </Icon>
);

const NotebookIcon = (
  <Icon>
    <rect x="6" y="3.5" width="12" height="17" rx="2" {...strokeProps} />
    <path d="M9.5 9h5M9.5 12.5h5" {...strokeProps} />
  </Icon>
);

const ArcIcon = (
  <Icon>
    <circle cx="12" cy="12" r="8.5" {...strokeProps} />
    <path d="M12 6.5a5.5 5.5 0 1 1-5 3.3" {...strokeProps} />
  </Icon>
);

const BraveIcon = (
  <Icon>
    <path
      d="M12 3l7.5 2.8-.7 6.7c-.6 4.7-2.9 7.6-6.8 9-3.9-1.4-6.2-4.3-6.8-9l-.7-6.7z"
      fill="currentColor"
    />
    <path
      d="M12 5.5l4.8 1.8-.4 4.2c-.4 3-1.8 5-4.4 6.3-2.6-1.3-4-3.3-4.4-6.3l-.4-4.2z"
      fill="var(--bg)"
    />
  </Icon>
);

const FirefoxIcon = (
  <Icon>
    <circle cx="12" cy="12" r="9.3" fill="#FF7139" />
    <path
      d="M4.8 15.4c1.2-4.5 5-6.8 8.4-6.2 2.6.5 4.6 2.6 5.2 5.3"
      fill="none"
      stroke="#ffffff"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <circle cx="10.5" cy="12.8" r="4.2" fill="#ffffff" opacity="0.45" />
  </Icon>
);

const SmileyIcon = (
  <Icon>
    <circle cx="12" cy="12" r="9" fill="currentColor" />
    <circle cx="9.2" cy="10" r="1.1" fill="var(--bg)" />
    <circle cx="14.8" cy="10" r="1.1" fill="var(--bg)" />
    <path
      d="M8.8 14.5c1 1.3 2.2 2 3.2 2s2.2-.7 3.2-2"
      fill="none"
      stroke="var(--bg)"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </Icon>
);

const FigmaIcon = (
  <svg viewBox="0 0 38 57" width={11.3} height={17} aria-hidden="true">
    <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1abcfe" />
    <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0acf83" />
    <path d="M0 28.5A9.5 9.5 0 0 1 9.5 19H19v19H9.5A9.5 9.5 0 0 1 0 28.5z" fill="#ff7262" />
    <path d="M0 9.5A9.5 9.5 0 0 1 9.5 0H19v19H9.5A9.5 9.5 0 0 1 0 9.5z" fill="#f24e1e" />
    <path d="M19 0h9.5a9.5 9.5 0 1 1 0 19H19V0z" fill="#a259ff" />
  </svg>
);

const DotsIcon = (
  <Icon>
    <g fill="currentColor" opacity="0.7">
      <circle cx="6" cy="6" r="1.5" />
      <circle cx="18" cy="6" r="1.5" />
      <circle cx="6" cy="18" r="1.5" />
      <circle cx="18" cy="18" r="1.5" />
    </g>
  </Icon>
);

const AwwwardsIcon = (
  <Icon>
    <circle cx="12" cy="12" r="9.5" fill="currentColor" />
    <text
      x="12"
      y="16.6"
      textAnchor="middle"
      fontSize="12.5"
      fontWeight="700"
      fontFamily="Inter, system-ui, sans-serif"
      fill="var(--bg)"
    >
      a
    </text>
  </Icon>
);

const BRAND_ICONS: Record<string, ReactNode> = {
  "60fps": PlayIcon,
  "Awwwards": AwwwardsIcon,
  "Design Spells": SparkleIcon,
  "Interface In Game": GamepadIcon,
  "Layers": LayersIcon,
  "Pinterest": PinterestIcon,
  "SearchSystem": SearchIcon,
  "Bolt.new": BoltIcon,
  "Claude Code": ClaudeIcon,
  "Claude Cowork": ClaudeIcon,
  "Skills": SparkleIcon,
  "Cline": TerminalIcon,
  "Cursor": CursorIcon,
  "OpenAI Codex": CodexIcon,
  "v0 by Vercel": TriangleIcon,
  "Windsurf": WaveIcon,
  "Zed": ZedIcon,
  "shadcn/ui": ShadcnIcon,
  "React Bits": ReactIcon,
  "Motion Primitives": WaveIcon,
  "Easing Editor": CurveIcon,
  "Easing Functions": CurveIcon,
  "Ray.so": RaySoIcon,
  "Raycast": RaycastIcon,
  "RegExr": RegexIcon,
  "LocalSend": ShareArrowIcon,
  "ShareX": ShareArrowIcon,
  "Screen Studio": CameraIcon,
  "LosslessCut": ScissorsIcon,
  "OBS Studio": ObsIcon,
  "Excalidraw": PencilIcon,
  "FigJam": FigjamIcon,
  "Figma": FigmaIcon,
  "Framer": FramerIcon,
  "Framer University Resources": FramerIcon,
  "Miro": MiroIcon,
  "Linear": LinearIcon,
  "Obsidian": ObsidianIcon,
  "Trello": TrelloIcon,
  "Blender": BlenderIcon,
  "Spline": SplineIcon,
  "Rive": RiveIcon,
  "ChatGPT": ChatGptIcon,
  "Google Gemini": GeminiIcon,
  "NotebookLM": NotebookIcon,
  "Arc": ArcIcon,
  "Brave": BraveIcon,
  "Firefox": FirefoxIcon,
  "MakeEmoji": SmileyIcon,
};

export function ToolIcon({ name }: { name: string }) {
  return BRAND_ICONS[name] ?? DotsIcon;
}