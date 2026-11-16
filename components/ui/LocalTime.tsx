"use client";

import { useEffect, useState } from "react";

/** Live clock for a given IANA time zone (renders "--:--" until mounted). */
export function useLocalTime(timeZone: string, withSeconds = false) {
  const [time, setTime] = useState("");
  useEffect(() => {
    let format: Intl.DateTimeFormat;
    try {
      format = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        ...(withSeconds ? { second: "2-digit" } : {}),
        timeZone,
      });
    } catch {
      return;
    }
    const tick = () => setTime(format.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [timeZone, withSeconds]);
  return time;
}

/** Short zone label, e.g. "CAT" for Africa/Kigali. */
export function zoneAbbreviation(timeZone: string) {
  try {
    const part = new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "short" })
      .formatToParts(new Date())
      .find((p) => p.type === "timeZoneName")?.value;
    if (part === "GMT+2" && timeZone === "Africa/Kigali") return "CAT";
    return part ?? "";
  } catch {
    return "";
  }
}

export function LocalTime({
  timeZone,
  withSeconds = false,
  showZone = false,
  className,
}: {
  timeZone: string;
  withSeconds?: boolean;
  showZone?: boolean;
  className?: string;
}) {
  const time = useLocalTime(timeZone, withSeconds);
  const [zone, setZone] = useState("");
  useEffect(() => {
    if (showZone) setZone(zoneAbbreviation(timeZone));
  }, [showZone, timeZone]);
  return (
    <span className={className}>
      {time || (withSeconds ? "--:--:--" : "--:--")}
      {showZone && zone ? ` ${zone}` : ""}
    </span>
  );
}
