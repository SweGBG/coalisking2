"use client";
import { useLang } from "@/lib/LangContext";
import { t } from "@/lib/translations";
import styles from "./InfoBar.module.css";

const icons = [
  <svg key="1" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  <svg key="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  <svg key="3" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.35a16 16 0 0 0 7.75 7.75l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  <svg key="4" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
];

export default function InfoBar() {
  const { lang } = useLang();
  const tr = t[lang].info;

  return (
    <div className={styles.bar}>
      {tr.items.map((item, i) => (
        <div key={item.label} className={styles.item}>
          <div className={styles.icon}>{icons[i]}</div>
          <div>
            <div className={styles.label}>{item.label}</div>
            <div className={styles.val}>{item.val}</div>
            <div className={styles.sub}>{item.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
