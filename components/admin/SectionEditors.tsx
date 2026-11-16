"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import { saveJourney, savePrinciples, saveSkills, saveTestimonials } from "@/app/admin/actions";
import { SkillIcon } from "@/components/ui/SkillIcon";
import type { ActionResult } from "@/lib/admin-types";
import type { Milestone, Principle, SkillGroup, Testimonial } from "@/lib/content/schema";
import { FormSection, TagInput, TextArea, TextInput, Toggle } from "./fields";
import { ListEditor } from "./ListEditor";
import { Notice, PageHeader, SaveBar } from "./SaveBar";
import { useAction, useDirty } from "./useAction";

/** Shared state + save wiring for the simple section editors. */
function useSectionForm<T, A, R>(initial: T, action: (arg: A) => Promise<ActionResult<R>>, toArg: (v: T) => A) {
  const [baseline, setBaseline] = useState(initial);
  const [value, setValue] = useState(initial);
  const dirty = useDirty(value, baseline);
  const save = useAction(action);
  const onSave = async () => {
    const res = await save.run(toArg(value));
    if (res.ok) setBaseline(value);
  };
  return { value, setValue, dirty, save, onSave, discard: () => setValue(baseline) };
}

function SaveButton({ onClick, pending, disabled }: { onClick: () => void; pending: boolean; disabled: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled || pending} className="btn btn-primary btn-sm">
      {pending ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
      <span>Save</span>
    </button>
  );
}

const hasErrorAt = (errors: Record<string, string>, prefix: string, i: number) =>
  Object.keys(errors).some((k) => k.startsWith(`${prefix}.${i}.`) || k === `${prefix}.${i}`);

/* ------------------------------------------------------------------ */

export function ApproachEditor({ initial, writable }: { initial: Principle[]; writable: boolean }) {
  const f = useSectionForm(initial, savePrinciples, (v) => v);
  const e = f.save.fieldErrors;
  return (
    <>
      <PageHeader
        title="Approach"
        description="The framed principle cards (the middle one is the solid red cell). Three reads best."
        actions={<SaveButton onClick={f.onSave} pending={f.save.pending} disabled={!f.dirty || !writable} />}
      />
      {!writable ? <Notice tone="warn">This deployment is read-only — see Settings to enable saving.</Notice> : null}
      <FormSection title="Principles">
        <ListEditor
          items={f.value}
          onChange={f.setValue}
          create={() => ({ label: `Fig 0.${f.value.length + 1} — `, title: "", body: "" })}
          title={(p) => p.title || "New principle"}
          addLabel="Add principle"
          min={1}
          max={4}
          defaultOpen
          errorFor={(i) => hasErrorAt(e, "principles", i)}
          render={(p, update, i) => (
            <>
              <TextInput label="Label" value={p.label} onChange={(v) => update({ label: v })} error={e[`principles.${i}.label`]} max={40} />
              <TextInput label="Statement" value={p.title} onChange={(v) => update({ title: v })} error={e[`principles.${i}.title`]} max={90} />
              <TextArea label="Body" value={p.body} onChange={(v) => update({ body: v })} error={e[`principles.${i}.body`]} max={320} rows={3} />
            </>
          )}
        />
      </FormSection>
      <SaveBar dirty={f.dirty} pending={f.save.pending} onSave={f.onSave} onDiscard={f.discard} disabled={!writable} />
    </>
  );
}

/* ------------------------------------------------------------------ */

export function SkillsEditor({ initial, writable }: { initial: SkillGroup[]; writable: boolean }) {
  const f = useSectionForm(initial, saveSkills, (v) => v);
  const e = f.save.fieldErrors;
  return (
    <>
      <PageHeader
        title="Skills"
        description={
          <>
            Groups become the framed capability panels; every skill also scrolls in the marquee. Icons come from{" "}
            <a href="https://simpleicons.org" target="_blank" rel="noopener noreferrer" className="text-fg underline underline-offset-2">
              simpleicons.org
            </a>{" "}
            — paste the slug (e.g. <code className="text-fg">nextdotjs</code>), or leave it empty for a monogram.
          </>
        }
        actions={<SaveButton onClick={f.onSave} pending={f.save.pending} disabled={!f.dirty || !writable} />}
      />
      {!writable ? <Notice tone="warn">This deployment is read-only — see Settings to enable saving.</Notice> : null}
      <FormSection title="Skill groups">
        <ListEditor
          items={f.value}
          onChange={f.setValue}
          create={() => ({ id: "", name: "", blurb: "", skills: [] })}
          title={(g) => (g.name ? `${g.name} · ${g.skills.length} skills` : "New group")}
          addLabel="Add group"
          max={8}
          errorFor={(i) => hasErrorAt(e, "groups", i)}
          render={(g, update, gi) => (
            <>
              <div className="grid gap-4 sm:grid-cols-[1fr_2fr]">
                <TextInput label="Group name" value={g.name} onChange={(v) => update({ name: v })} error={e[`groups.${gi}.name`]} max={32} />
                <TextInput label="Blurb" value={g.blurb} onChange={(v) => update({ blurb: v })} error={e[`groups.${gi}.blurb`]} max={220} />
              </div>
              <div>
                <div className="label mb-2 text-muted">Skills</div>
                <ListEditor
                  items={g.skills}
                  onChange={(skills) => update({ skills })}
                  create={() => ({ name: "", slug: "" })}
                  collapsible={false}
                  max={30}
                  addLabel="Add skill"
                  errorFor={(si) => hasErrorAt(e, `groups.${gi}.skills`, si)}
                  title={(s) => (
                    <span className="group/skill flex items-center gap-2">
                      <SkillIcon slug={s.slug} name={s.name || "?"} className="h-4 w-4" />
                      {s.name || "New skill"}
                    </span>
                  )}
                  render={(s, up, si) => (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <TextInput label="Name" value={s.name} onChange={(v) => up({ name: v })} error={e[`groups.${gi}.skills.${si}.name`]} />
                      <TextInput
                        label="Icon slug"
                        value={s.slug}
                        onChange={(v) => up({ slug: v.toLowerCase().trim() })}
                        error={e[`groups.${gi}.skills.${si}.slug`]}
                        placeholder="react"
                      />
                    </div>
                  )}
                />
              </div>
            </>
          )}
        />
      </FormSection>
      <SaveBar dirty={f.dirty} pending={f.save.pending} onSave={f.onSave} onDiscard={f.discard} disabled={!writable} />
    </>
  );
}

/* ------------------------------------------------------------------ */

export function JourneyEditor({
  initial,
  writable,
}: {
  initial: { milestones: Milestone[]; show: boolean };
  writable: boolean;
}) {
  const f = useSectionForm(initial, saveJourney, (v) => v);
  const e = f.save.fieldErrors;
  const set = (patch: Partial<typeof initial>) => f.setValue((v) => ({ ...v, ...patch }));
  return (
    <>
      <PageHeader
        title="Journey"
        description="The timeline section (“The path”). Mark your current chapter to give it the red pulsing node."
        actions={<SaveButton onClick={f.onSave} pending={f.save.pending} disabled={!f.dirty || !writable} />}
      />
      {!writable ? <Notice tone="warn">This deployment is read-only — see Settings to enable saving.</Notice> : null}
      <div className="space-y-6">
        <Toggle label="Show the journey section" checked={f.value.show} onChange={(show) => set({ show })} />
        <FormSection title="Milestones">
          <ListEditor
            items={f.value.milestones}
            onChange={(milestones) => set({ milestones })}
            create={() => ({ id: "", year: "", title: "", subtitle: "", description: "", tags: [], current: false })}
            title={(m) => (m.title ? `${m.year} — ${m.title}` : "New milestone")}
            addLabel="Add milestone"
            max={24}
            errorFor={(i) => hasErrorAt(e, "milestones", i)}
            render={(m, update, i) => (
              <>
                <div className="grid gap-4 sm:grid-cols-[1fr_3fr]">
                  <TextInput label="Year" value={m.year} onChange={(v) => update({ year: v })} error={e[`milestones.${i}.year`]} placeholder="2024 / Now" />
                  <TextInput label="Title" value={m.title} onChange={(v) => update({ title: v })} error={e[`milestones.${i}.title`]} />
                </div>
                <TextInput label="Subtitle" value={m.subtitle} onChange={(v) => update({ subtitle: v })} error={e[`milestones.${i}.subtitle`]} placeholder="Company, school or place" />
                <TextArea label="Description" value={m.description} onChange={(v) => update({ description: v })} error={e[`milestones.${i}.description`]} max={600} rows={3} />
                <TagInput label="Tags" value={m.tags} onChange={(tags) => update({ tags })} max={8} />
                <Toggle label="Current chapter" checked={m.current} onChange={(current) => update({ current })} />
              </>
            )}
          />
        </FormSection>
      </div>
      <SaveBar dirty={f.dirty} pending={f.save.pending} onSave={f.onSave} onDiscard={f.discard} disabled={!writable} />
    </>
  );
}

/* ------------------------------------------------------------------ */

export function TestimonialsEditor({
  initial,
  writable,
  hasPlaceholders,
}: {
  initial: { testimonials: Testimonial[]; show: boolean };
  writable: boolean;
  hasPlaceholders: boolean;
}) {
  const f = useSectionForm(initial, saveTestimonials, (v) => v);
  const e = f.save.fieldErrors;
  const set = (patch: Partial<typeof initial>) => f.setValue((v) => ({ ...v, ...patch }));
  return (
    <>
      <PageHeader
        title="Testimonials"
        description="Quotes in the “Kind words” carousel."
        actions={<SaveButton onClick={f.onSave} pending={f.save.pending} disabled={!f.dirty || !writable} />}
      />
      {!writable ? <Notice tone="warn">This deployment is read-only — see Settings to enable saving.</Notice> : null}
      {hasPlaceholders ? (
        <Notice tone="warn">
          The quotes carried over from the old site are placeholders, not real clients. Replace them with genuine
          testimonials, or switch the section off until you have some.
        </Notice>
      ) : null}
      <div className="space-y-6">
        <Toggle label="Show the testimonials section" checked={f.value.show} onChange={(show) => set({ show })} />
        <FormSection title="Quotes">
          <ListEditor
            items={f.value.testimonials}
            onChange={(testimonials) => set({ testimonials })}
            create={() => ({ id: "", quote: "", name: "", role: "", company: "" })}
            title={(t) => (t.name ? `${t.name}${t.company ? ` · ${t.company}` : ""}` : "New testimonial")}
            addLabel="Add testimonial"
            max={24}
            errorFor={(i) => hasErrorAt(e, "testimonials", i)}
            render={(t, update, i) => (
              <>
                <TextArea label="Quote" value={t.quote} onChange={(v) => update({ quote: v })} error={e[`testimonials.${i}.quote`]} max={600} rows={3} />
                <div className="grid gap-4 sm:grid-cols-3">
                  <TextInput label="Name" value={t.name} onChange={(v) => update({ name: v })} error={e[`testimonials.${i}.name`]} />
                  <TextInput label="Role" value={t.role} onChange={(v) => update({ role: v })} error={e[`testimonials.${i}.role`]} />
                  <TextInput label="Company" value={t.company} onChange={(v) => update({ company: v })} error={e[`testimonials.${i}.company`]} />
                </div>
              </>
            )}
          />
        </FormSection>
      </div>
      <SaveBar dirty={f.dirty} pending={f.save.pending} onSave={f.onSave} onDiscard={f.discard} disabled={!writable} />
    </>
  );
}
