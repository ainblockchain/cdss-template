import { ParamInput, ParamInputProps } from '../components/paramInput';
import styles from '../styles/Home.module.css'

const params: ParamInputProps[] = [
  { key: 'age', type: 'number' },
  { key: 'height', type: 'number' },
];

export default function Home() {
  return (
    <div className={styles.container}>
      { params.map((item: ParamInputProps) => 
        <ParamInput 
          key={item.key}
          title={item.title ? item.title : item.key}
          type={item.type}
        />
      )}
    </div>
  )
}
