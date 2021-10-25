import React, { useState } from 'react';

import { useAgeData } from '../swr/useAgeData';
import { useEncAgeData } from '../swr/useEncAgeData';
import styles from '../styles/Home.module.css'

export const DecryptSection = ({
  connectManager,
}: any): React.ReactElement => {
  const { data: ageData } = useAgeData();
  const [ resultDecrypt, setResultDecrypt ] = useState<number>(0);
  const { data: encAgeData } = useEncAgeData();

  const onClickDecryptButton = async () => {
    if (!connectManager) {
      return;
    }
    try {
      const res = await connectManager.decrypt(encAgeData);
      setResultDecrypt(res.decrypted[0]);
    } catch (e) {
      console.log(e);
      console.error('Failed to encrypt data');
    }
  }

  return (
    <div className={styles.sectionContainer}>
      <div className={styles.paramContainer}>
        {encAgeData &&
          <div>
            Result:
            {`${encAgeData.substring(0, 15)}`}
          </div>}
      </div>
      <button disabled={encAgeData === ''}
        onClick={onClickDecryptButton}>Decrypt</button>
      <div className={styles.paramContainer}>
        <div>
          { resultDecrypt ? 
            `Decrypt result: ${resultDecrypt}`
            : ''
          }
        </div>
        <div>
          { resultDecrypt ? 
            `Diff: ${Number(ageData) - resultDecrypt}`
            : ''
          }
        </div>
      </div>
    </div>
  );
}

export default DecryptSection;