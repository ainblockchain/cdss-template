import styles from '../styles/ParamInput.module.css';

export interface ParamInputProps {
  key: string;
  title?: string;
  type: 'number' | 'string';
}

export function ParamInput({
  title, type
}: ParamInputProps): React.ReactElement {
  return (
    <div className={styles.inputContainer}>
      <div className={styles.inputTitle}>{title}</div>
      <input type={type} />
    </div>
  );
}