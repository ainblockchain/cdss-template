import React from 'react';

import { ParamInput } from './paramInput';
import { useAgeData } from '../swr/useAgeData';
import { useEncAgeData } from '../swr/useEncAgeData';
import { useHeightData } from '../swr/useHeightData';
import { useEncHeightData } from '../swr/useEncHeightData';
import styles from '../styles/Home.module.css'

type ParamInputProp = {
  [key: string]: {
    title?: string;
    type: 'number' | 'string';
    value?: any;
    setter?: any;
  }
}

const params: ParamInputProp = {
  'age': { title: 'Age', type: 'number' },
  'height': { title: 'Height', type: 'number' },
};

export const EncryptSection = ({
  connectManager,
}: any): React.ReactElement => {
  const { data: ageData, mutate: mutateAgeData } = useAgeData();
  const { data: encAgeData, mutate: mutateEncAgeData } = useEncAgeData();
  const { data: heightData, mutate: mutateHeightData } = useHeightData();
  const { data: encHeightData, mutate: mutateEncHeightData } = useEncHeightData();

  params['age'] = { ...params['age'],
    value: ageData, setter: mutateAgeData};
  params['height'] = { ...params['height'],
    value: heightData, setter: mutateHeightData};

  const onClickEncryptButton = async () => {
    if (!connectManager) {
      return;
    }
    const ageArray = [ageData];
    const dataHeight = [heightData];
    try {
      const resAge = await connectManager.encrypt(ageArray);
      mutateEncAgeData(resAge.encrypted);
      const resHeight = await connectManager.encrypt(dataHeight);
      mutateEncHeightData(resHeight.encrypted)
    } catch (e) {
      console.log(e);
      console.error('Failed to encrypt data');
    }
  }

  return (
    <div className={styles.sectionContainer}>
      <div className={styles.paramContainer}>
        { Object.keys(params).map((key) =>
          <ParamInput 
            key={key}
            title={params[key].title ? params[key].title : key}
            type={params[key].type}
            value={params[key].value}
            setter={params[key].setter}
          />
        )}
      </div>
      <button onClick={onClickEncryptButton}>Encrypt</button>
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
    </div>
  );
}

export default EncryptSection;