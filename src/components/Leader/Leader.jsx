import { IconModeNo, IconModeYes, IconSuperpowerNo, IconSuperpowerYes } from "../Icons/IconsSvg";
import styles from "./Leader.module.css";

export function Leader({ id, name, time, achievements }) {
  const mode = achievements.includes(1);
  const superpower = achievements.includes(2);
  console.log(superpower);
  return (
    <tbody className={styles.tbody}>
      <tr className={styles.tr}>
        <td className={styles.td}>{id}</td>
        <td className={styles.td}>{name}</td>
        <td className={styles.td}>
          {mode ? <IconModeYes /> : <IconModeNo />}
          {superpower ? <IconSuperpowerYes /> : <IconSuperpowerNo />}
        </td>
        <td className={styles.td}>{time}</td>
      </tr>
    </tbody>
  );
}
