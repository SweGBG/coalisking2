import styles from "./SweGBGCredit.module.css";

// "Skapad av SweGBG" — liten signatur längst ner till höger, länkar till swegbg.com.
type Props = { lang: string; accent: string; text?: string; line?: string; endGap?: string };

export default function SweGBGCredit({ lang, accent, text = "rgba(255,255,255,.55)", line = "rgba(255,255,255,.12)", endGap }: Props) {
  const en = lang === "en";
  return (
    <div className={styles.row} style={{ ["--cr-accent" as string]: accent, ["--cr-text" as string]: text, ["--cr-line" as string]: line, ...(endGap ? { paddingRight: endGap } : {}) }}>
      <a href="https://www.swegbg.com" target="_blank" rel="noopener" className={styles.credit}>
        {en ? "Made by" : "Skapad av"} <b>SweGBG</b>
      </a>
    </div>
  );
}
