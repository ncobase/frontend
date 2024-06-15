import { JSEncrypt } from 'jsencrypt';

class Rsa {
  private static readonly defaultPublicKey: string =
    '-----BEGIN PUBLIC KEY-----\n' +
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5OJzT1zT+ZYvYsFdBvY2\n' +
    'p0aE6MZ+aIV7RMwyjX7XuUmlmmDwCIOI+tCUwqc9YT1SaajMp4s7ao0T3R62T6Nf\n' +
    '1vYvGMnVmmyLQRuijLK4R0xRlla6vSFjYY3v518idjdruWv2wIt+o9JDMjx5rXLj\n' +
    'mN6M/LfzEkvLTmHTogS69is2p8wZhcw93xg2t28/ZIDM12DNsvq29L5Df1aGAbcL\n' +
    'ZlvzATKW2HIBRsGHqwUgKxh5GgfhPsIz5xMUDMf+cWfEYcY+YFheWATZ+SddOZVb\n' +
    'uDmGPi+4qu1tVumZsO83RzuitpeL/CsmoHJVxY2UERnOi6Vf8OqnB15RP34E3FHo\n' +
    'GQIDAQAB\n' +
    '-----END PUBLIC KEY-----';
  private static readonly defaultPrivateKey: string = '';

  private static publicKey: string = Rsa.defaultPublicKey;
  private static privateKey: string = Rsa.defaultPrivateKey;

  static setPublicKey(publicKey: string): void {
    Rsa.publicKey = publicKey;
  }

  static setPrivateKey(privateKey: string): void {
    Rsa.privateKey = privateKey;
  }

  static encrypt(v: object | string): string | false {
    const Encrypt = new JSEncrypt();
    Encrypt.setPublicKey(Rsa.publicKey);
    return Encrypt.encrypt(typeof v === 'string' ? v : JSON.stringify(v));
  }

  static decrypt(v: object | string): string | false {
    const Decrypt = new JSEncrypt();
    Decrypt.setPrivateKey(Rsa.privateKey);
    return Decrypt.decrypt(typeof v === 'string' ? v : JSON.stringify(v));
  }
}

export const rsa = Rsa;
