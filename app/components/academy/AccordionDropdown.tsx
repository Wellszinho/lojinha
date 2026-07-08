import { ChevronDown } from "lucide-react";

type AccordionDropdownProps = {
  title: string;
  description?: string;
  items: Array<{
    title: string;
    content: string;
  }>;
};

export function AccordionDropdown({ title, description, items }: AccordionDropdownProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5">
        <h2 className="text-xl font-black text-slate-950">{title}</h2>
        {description ? <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p> : null}
      </div>
      <div className="divide-y divide-slate-200">
        {items.map((item, index) => (
          <details key={item.title} className="group" open={index === 0}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-sm font-bold text-slate-800">
              {item.title}
              <ChevronDown className="size-4 text-slate-400 transition group-open:rotate-180" />
            </summary>
            <p className="px-5 pb-5 text-sm leading-6 text-slate-600">{item.content}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
