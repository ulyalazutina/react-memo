import styles from "./Checkbox.module.css";

export function Checkbox({ id, name, label, onClick, checked, onChange }) {
  return (
    <div className={styles.wrapper}>
      <input
        type="checkbox"
        id={id}
        name={name}
        className={styles.input}
        onClick={onClick}
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
    </div>
  );
}
