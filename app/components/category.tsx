import type { Tool } from "../data";
import { ToolLink } from "./tool-link";

interface CategoryProps {
  category: {
    title: string;
    tools: Tool[];
  };
  wide?: boolean;
}

export function Category({ category, wide = false }: CategoryProps) {
  return (
    <section
      className={`bg-page p-5 sm:p-6 xl:p-[30px] ${
        wide ? "sm:col-span-2 lg:col-span-3 xl:col-span-2" : ""
      }`}
    >
      <h2 className="text-title mb-[18px] text-[18px] font-medium leading-snug tracking-[-0.01em]">
        {category.title}
      </h2>
      <ul className="flex flex-col gap-[9px]">
        {category.tools.map((tool: Tool) => (
          <li key={tool.name}>
            <ToolLink tool={tool} />
          </li>
        ))}
      </ul>
    </section>
  );
}