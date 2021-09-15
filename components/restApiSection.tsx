import React from 'react';
import AinJs from '@ainblockchain/ain-js';
import axios from 'axios';

import { useEncAgeData } from '../swr/useEncAgeData';
import { useEncHeightData } from '../swr/useEncHeightData';
import { useResultData } from '../swr/useResultData';
import styles from '../styles/Home.module.css'
import { BLOCKCHAIN_NODE } from '../pages/constants';

export const RestApiSection = ({
}: any): React.ReactElement => {
  const ainJs = new AinJs(BLOCKCHAIN_NODE);
  const { data: encAgeData } = useEncAgeData();
  const { data: encHeightData } = useEncHeightData();
  const { data: resultData, mutate: mutateResultData } = useResultData();

  const onClickRestApiButton = async () => {
    try {
      await ainJs.he.init();
      const res = await axios.post('/api/predict',
        { age: encAgeData, height: encHeightData });
      // const result = Array.from(ainJs.he.decrypt(res.data.result))[0];
      mutateResultData(res.data.result);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className={styles.sectionContainer}>
      <div className={styles.paramContainer}>
        <div>
          { encAgeData ? 
            `Encrypted Age: ${encAgeData.substring(0, 15)}...`
            : ''
          }
        </div>
        <div>
          { encHeightData ? 
            `Encrypted Height: ${encHeightData.substring(0, 15)}...`
            : ''
          }
        </div>
      </div>
      <button disabled={encAgeData === '' || encHeightData === ''}
        onClick={onClickRestApiButton}>REST API</button>
      <div className={styles.paramContainer}>
        <div>
          { resultData ? 
            `Result: ${resultData.substring(0, 15)}...`
            : ''
          }
        </div>
      </div>
    </div>
  );
}

export default RestApiSection;