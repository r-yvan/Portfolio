"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { saveProfile } from "@/app/admin/actions";
import { parseMarkup, toneClass } from "@/lib/content/markup";
import type { Profile, Social, Stat } from "@/lib/content/schema";
import { cn } from "@/lib/utils";
import { Field, FormSection, NumberInput, TextArea, TextInput, Toggle } from "./fields";
import { ListEditor } from "./ListEditor";
import { Notice, PageHeader, SaveBar } from "./SaveBar";
import { useAction, useDirty } from "./useAction";

type State = { profile: Profile; socials: Social[]; stats: Stat[] };

function MarkupPreview({ value }: { value: string }) {
  return (
    <div className="border border-fg/10 bg-canvas p-5 text-center">
      <div className="label mb-3">Preview</div>
      <p className="h-section mx-auto max-w-[15ch] text-balance !text-[clamp(1.6rem,3vw,2.4rem)]">
        {parseMarkup(value).map((t, i) => (
          <span key={i} className={cn(toneClass[t.tone])}>
            {t.text}
          </span>
        ))}
      </p>
    </div>
  );
}

function StringList({
  items,
  onChange,
  label,
  addLabel,
  multiline,
  max,
  errorAt,
}: {
  items: string[];
  onChange: (v: string[]) => void;
  label: (i: number) => string;
  addLabel: string;
  multiline?: boolean;
  max: number;
  errorAt: (i: number) => string | undefined;
}) {
  const wrapped = items.map((value) => ({ value }));
  return (
    <ListEditor
      items={wrapped}
      onChange={(next) => onChange(next.map((n) => n.value))}
      create={() => ({ value: "" })}
      title={(item, i) => item.value || <span className="text-subtle">{label(i)}</span>}
      addLabel={addLabel}
      max={max}
      min={1}
      collapsible={false}
      errorFor={(i) => !!errorAt(i)}
      render={(item, update, i) =>
        multiline ? (
          <TextArea label={label(i)} value={item.value} onChange={(v) => update({ value: v })} rows={4} max={900} error={errorAt(i)} />
        ) : (
          <TextInput label={label(i)} value={item.value} onChange={(v) => update({ value: v })} max={48} error={errorAt(i)} />
        )
      }
    />
  );
}

export function ProfileEditor({ initial, writable }: { initial: State; writable: boolean }) {
  const [baseline, setBaseline] = useState(initial);
  const [state, setState] = useState(initial);
  const [zones, setZones] = useState<string[]>([]);
  const dirty = useDirty(state, baseline);
  const save = useAction(saveProfile);
  const e = save.fieldErrors;
  const p = state.profile;

  useEffect(() => {
    try {
      setZones((Intl as unknown as { supportedValuesOf?: (k: string) => string[] }).supportedValuesOf?.("timeZone") ?? []);
    } catch {
      setZones([]);
    }
  }, []);

  const setProfile = <K extends keyof Profile>(key: K, value: Profile[K]) =>
    setState((s) => ({ ...s, profile: { ...s.profile, [key]: value } }));

  const onSave = async () => {
    const res = await save.run(state);
    if (res.ok) setBaseline(state);
  };

  const err = (key: string) => e[`profile.${key}`];

  return (
    <>
      <PageHeader
        title="Profile"
        description="Your name, hero headline, bio and contact details — used across the site, the footer and search previews."
        actions={
          <button onClick={onSave} disabled={!dirty || save.pending || !writable} className="btn btn-primary btn-sm">
            {save.pending ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            <span>Save</span>
          </button>
        }
      />
      {!writable ? <Notice tone="warn">This deployment is read-only — see Settings to enable saving.</Notice> : null}
      {Object.keys(e).length ? <Notice tone="warn">Some fields need attention — they're highlighted in red below.</Notice> : null}

      <div className="space-y-6">
        <FormSection title="Hero" description="The first thing visitors read.">
          <TextInput
            label="Headline"
            value={p.headline}
            onChange={(v) => setProfile("headline", v)}
            error={err("headline")}
            max={160}
            hint={
              <>
                Wrap words in <code className="text-fg">*stars*</code> for red and{" "}
                <code className="text-fg">_underscores_</code> for muted grey.
              </>
            }
          />
          <MarkupPreview value={p.headline} />
          <TextArea label="Tagline" value={p.tagline} onChange={(v) => setProfile("tagline", v)} error={err("tagline")} max={260} rows={2} />
          <Field label="Rotating roles" hint="Cycle under the headline with a decoder effect." error={err("roles")}>
            <StringList
              items={p.roles}
              onChange={(v) => setProfile("roles", v)}
              label={(i) => `Role ${i + 1}`}
              addLabel="Add role"
              max={8}
              errorAt={(i) => err(`roles.${i}`)}
            />
          </Field>
        </FormSection>

        <FormSection title="Identity">
          <div className="grid gap-5 sm:grid-cols-2">
            <TextInput label="First name" value={p.firstName} onChange={(v) => setProfile("firstName", v)} error={err("firstName")} />
            <TextInput label="Last name" value={p.lastName} onChange={(v) => setProfile("lastName", v)} error={err("lastName")} />
            <TextInput label="Full name" value={p.fullName} onChange={(v) => setProfile("fullName", v)} error={err("fullName")} hint="Used in the footer copyright." />
            <TextInput label="Display name" value={p.displayName} onChange={(v) => setProfile("displayName", v)} error={err("displayName")} hint="Used in the browser tab and search results." />
            <TextInput label="Initials" value={p.initials} onChange={(v) => setProfile("initials", v)} error={err("initials")} max={4} />
            <TextInput label="Title" value={p.title} onChange={(v) => setProfile("title", v)} error={err("title")} />
          </div>
        </FormSection>

        <FormSection title="About" description="The first paragraph is shown larger.">
          <StringList
            items={p.bio}
            onChange={(v) => setProfile("bio", v)}
            label={(i) => `Paragraph ${i + 1}`}
            addLabel="Add paragraph"
            multiline
            max={6}
            errorAt={(i) => err(`bio.${i}`)}
          />
        </FormSection>

        <FormSection title="Contact & location">
          <div className="grid gap-5 sm:grid-cols-2">
            <TextInput label="Email" type="email" value={p.email} onChange={(v) => setProfile("email", v)} error={err("email")} />
            <TextInput label="Phone" value={p.phone} onChange={(v) => setProfile("phone", v)} error={err("phone")} placeholder="+250…" />
            <TextInput label="Location" value={p.location} onChange={(v) => setProfile("location", v)} error={err("location")} hint="City, country — e.g. Kigali, Rwanda." />
            <TextInput
              label="Neighbourhood"
              value={p.area}
              onChange={(v) => setProfile("area", v)}
              error={err("area")}
              max={80}
              hint="Shown on the About map, e.g. Gikondo, Kicukiro."
            />
            <Field label="Time zone" error={err("timezone")} hint="Drives the live clocks on the site.">
              <input className="input" list="tz-list" value={p.timezone} onChange={(ev) => setProfile("timezone", ev.target.value)} />
              <datalist id="tz-list">
                {zones.map((z) => (
                  <option key={z} value={z} />
                ))}
              </datalist>
            </Field>
            <NumberInput
              label="Latitude"
              step={0.0001}
              value={p.coordinates.lat}
              onChange={(v) => setProfile("coordinates", { ...p.coordinates, lat: v })}
              error={err("coordinates.lat")}
              hint="Places the red pin on the About map (the map covers ~1.5 km around Gikondo)."
            />
            <NumberInput
              label="Longitude"
              step={0.0001}
              value={p.coordinates.lng}
              onChange={(v) => setProfile("coordinates", { ...p.coordinates, lng: v })}
              error={err("coordinates.lng")}
            />
            <TextInput label="GitHub username" value={p.githubUser} onChange={(v) => setProfile("githubUser", v)} error={err("githubUser")} hint="Used for the GitHub button and repo import." />
            <TextInput label="Résumé URL" value={p.resumeUrl} onChange={(v) => setProfile("resumeUrl", v)} error={err("resumeUrl")} placeholder="https://… (optional)" />
          </div>
        </FormSection>

        <FormSection title="Availability">
          <Toggle
            label="Open to work"
            description="Shows a pulsing red status in the hero, contact form and footer."
            checked={p.available}
            onChange={(v) => setProfile("available", v)}
          />
          <TextInput label="Status text" value={p.availability} onChange={(v) => setProfile("availability", v)} error={err("availability")} max={60} />
        </FormSection>

        <FormSection title="Social links" description="Shown in the contact section and footer. Use https://, mailto: or tel: links.">
          <ListEditor
            items={state.socials}
            onChange={(socials) => setState((s) => ({ ...s, socials }))}
            create={() => ({ id: "", label: "", handle: "", url: "https://" })}
            title={(s) => s.label || "New link"}
            addLabel="Add link"
            max={10}
            errorFor={(i) => Object.keys(e).some((k) => k.startsWith(`socials.${i}.`))}
            render={(s, update, i) => (
              <div className="grid gap-4 sm:grid-cols-3">
                <TextInput label="Label" value={s.label} onChange={(v) => update({ label: v })} error={e[`socials.${i}.label`]} placeholder="LinkedIn" />
                <TextInput label="Handle" value={s.handle} onChange={(v) => update({ handle: v })} error={e[`socials.${i}.handle`]} placeholder="@you" />
                <TextInput label="URL" value={s.url} onChange={(v) => update({ url: v })} error={e[`socials.${i}.url`]} />
              </div>
            )}
          />
        </FormSection>

        <FormSection title="Stats" description="The framed strip at the bottom of the hero (up to 4).">
          <ListEditor
            items={state.stats}
            onChange={(stats) => setState((s) => ({ ...s, stats }))}
            create={() => ({ label: "", value: 0, suffix: "+" })}
            title={(s) => (s.label ? `${s.value}${s.suffix} ${s.label}` : "New stat")}
            addLabel="Add stat"
            max={4}
            errorFor={(i) => Object.keys(e).some((k) => k.startsWith(`stats.${i}.`))}
            render={(s, update, i) => (
              <div className="grid gap-4 sm:grid-cols-[2fr_1fr_1fr]">
                <TextInput label="Label" value={s.label} onChange={(v) => update({ label: v })} error={e[`stats.${i}.label`]} placeholder="Years building" />
                <NumberInput label="Value" value={s.value} onChange={(v) => update({ value: Math.max(0, Math.round(v)) })} error={e[`stats.${i}.value`]} />
                <TextInput label="Suffix" value={s.suffix} onChange={(v) => update({ suffix: v })} error={e[`stats.${i}.suffix`]} max={4} />
              </div>
            )}
          />
        </FormSection>
      </div>

      <SaveBar dirty={dirty} pending={save.pending} onSave={onSave} onDiscard={() => setState(baseline)} disabled={!writable} />
    </>
  );
}
