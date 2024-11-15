import CryptoJS from "crypto-js";

/**
 * @name AES-解密
 * @param raw 待解密数据
 * @param AESKey 解密 key
 * @returns {string} 返回解密字符串
 */
export const aesDecrypt = (raw: string, AESKey: string) => {
  const cypherKey = CryptoJS.enc.Utf8.parse(AESKey);
  CryptoJS.pad.ZeroPadding.pad(cypherKey, 4);

  const decrypt = CryptoJS.AES.decrypt(raw, cypherKey, {
    mode: CryptoJS.mode.ECB,
    keySize: 128,
  });

  return JSON.parse(CryptoJS.enc.Utf8.stringify(decrypt).toString());
};
