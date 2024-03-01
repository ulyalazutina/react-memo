import styles from "./Leader.module.css";

export function Leader({ id, name, time }) {
  return (
    <tbody className={styles.tbody}>
      <tr className={styles.tr}>
        <td className={styles.td}>{id}</td>
        <td className={styles.td}>{name}</td>
        <td className={styles.td}>{name}</td>
        <td className={styles.td}>{time}</td>
      </tr>
    </tbody>
  );
}
