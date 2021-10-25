import AinJs from '@ainblockchain/ain-js';
import React, { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css'
import ConnectManager from '../manager/ConnectManager';

import { BLOCKCHAIN_NODE } from '../common/constants';
import { EncryptSection } from '../components/encryptSection';
// import { RestApiSection } from '../components/restApiSection';
import { BlockchainSection } from '../components/blockchainSection';
import { DecryptSection } from '../components/decryptSection';
import { useAgeData } from '../swr/useAgeData';

export default function Home() {
  const ainJs = new AinJs(BLOCKCHAIN_NODE);
  const [ resultState, setResultState ] = useState<any>({});
  const [ publicKey, setPublicKey ] = useState<string>('');
  const [ connectManager, setConnectManager ] = useState<any>(null);
  const [ encryptedState, setEncryptedState ] = useState<string>('');

  useEffect(() => {
    const connectManager = new ConnectManager();
    connectManager.initialize();
    setConnectManager(connectManager);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.containerSection}>
        <div className={styles.containerSectionTitle}>
          나이와 키를 받아 Extension을 통해 각각 암호화한다.
        </div>
        <EncryptSection
          connectManager={connectManager}
        />
      </div>
      {/*<div className={styles.containerSection}>
        <div className={styles.containerSectionTitle}>
          API를 호출해 암호화된 두 값을 더한다.
        </div>
        <RestApiSection connectManager={connectManager} />
      </div>*/}
      <div className={styles.containerSection}>
        <div className={styles.containerSectionTitle}>
          Blockchain에 암호화된 값과 동형암호 연산 요청을 제출한다. 
        </div>
        <BlockchainSection connectManager={connectManager} />
      </div>
      <div className={styles.containerSection}>
        <div className={styles.containerSectionTitle}>
          Extension을 통해 계산된 값을 복호화한다.
        </div>
        <DecryptSection
          connectManager={connectManager}
        />
      </div>
      {/*<button onClick={onClickBlockchainButton}>Blockchain</button>
      <div className={styles.resultContainer}>
        <div className={styles.resultTitle}>Public Key</div>
        <div>{publicKey}</div>
      </div>*/}
    </div>
  )
}
