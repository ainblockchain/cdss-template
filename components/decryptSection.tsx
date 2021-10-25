import React, { useState } from 'react';

import { useAgeData } from '../swr/useAgeData';
import { useHeightData } from '../swr/useHeightData';
import { useResultData } from '../swr/useResultData';
import styles from '../styles/Home.module.css'

export const DecryptSection = ({
  connectManager,
}: any): React.ReactElement => {
  const { data: resultData } = useResultData();
  const { data: ageData } = useAgeData();
  const { data: heightData } = useHeightData();
  const [ resultDecrypt, setResultDecrypt ] = useState<number>(0);

  const onClickDecryptButton = async () => {
    if (!connectManager) {
      return;
    }
    try {
      const res = await connectManager.decrypt(resultData);
      setResultDecrypt(res.decrypted[0]);
    } catch (e) {
      console.log(e);
      console.error('Failed to encrypt data');
    }
  }

  return (
    <div className={styles.sectionContainer}>
      <div className={styles.paramContainer}>
        {resultData &&
          <div>
            Result:
            {`${resultData.substring(0, 15)}`}
          </div>}
      </div>
      <button disabled={resultData === ''}
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
            `Diff: ${Number(ageData) + Number(heightData) - resultDecrypt}`
            : ''
          }
        </div>
      </div>
    </div>
  );
}

export default DecryptSection;