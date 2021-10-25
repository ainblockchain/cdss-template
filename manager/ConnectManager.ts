declare global {
  interface Window {
    CloudConnect: any;
  }

  interface SendTransactionPayload {
    ref: string,
    value: any,
    nonce: number,
  }
}

export default class ConnectManager {
  public CloudConnect: any;

  public initialize(callback?: any) {
    window.addEventListener("scriptLoaded", async (event) => {
      this.CloudConnect = window.CloudConnect;
      if (callback && typeof(callback) === 'function') {
        callback();
      }
    });
  }

  public async getPublicKey() {
    return new Promise(async (resolve, reject) => {
      if (this.CloudConnect) {
        try {
          const res = await this.CloudConnect.getPublicKey();
          resolve(res.publicKey);
        } catch (e) {
          console.log(e);
          reject(e);
        }
      } else {
        reject('You have to install AIN Connect plugin');
      }
    })
  }

  public async sendTransaction(payload: SendTransactionPayload) {
    return new Promise(async (resolve, reject) => {
      if (this.CloudConnect) {
        try {
          const res = await this.CloudConnect.sendTransaction(payload);
          resolve(res);
        } catch (e) {
          reject(e);
        }
      } else {
        reject('You have to install AIN Connect plugin');
      }
    })
  }

  public async encrypt(data: Array<number>) {
    return new Promise(async (resolve, reject) => {
      if (this.CloudConnect) {
        try {
          const res = await this.CloudConnect.encryptData(data);
          resolve(res);
        } catch (e) {
          reject(e);
        }
      } else {
        reject('You have to install AIN Connect plugin');
      }
    });
  }

  public decrypt(data: string) {
    return new Promise(async (resolve, reject) => {
      if (this.CloudConnect) {
        try {
          const res = await this.CloudConnect.decryptData(data);
          resolve(res);
        } catch (e) {
          console.log(e);
          reject(e);
        }
      } else {
        reject('You have to install AIN Connect plugin');
      }
    });
  }
}