import { ChangeEvent } from 'react';
import styles from '../styles/ParamInput.module.css';

export interface ParamInputComponentProps {
  title?: string;
  type: 'number' | 'string';
  value: any;
  setter: any;
}

function onInputChange(
  event: ChangeEvent<HTMLInputElement>,
  setter: any) {
  setter(event.target.value);
}

export function ParamInput({
  title, type, value, setter
}: ParamInputComponentProps): React.ReactElement {
  return (
    <div className={styles.inputContainer}>
      <div className={styles.inputTitle}>{title}</div>
      <input type={type} 
        value={value} 
        onChange={(event) => onInputChange(event, setter)}
      />
    </div>
  );
}