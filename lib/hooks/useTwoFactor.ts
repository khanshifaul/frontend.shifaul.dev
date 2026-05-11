import { authAPI } from '@/lib/actions/authAPi';
import { useAppDispatch } from '../store/hooks';

export const useTwoFactor = () => {
  const dispatch = useAppDispatch();

  const generateSecret = async () => {
    try {
      const result = await authAPI.generateTwoFactorSecret(dispatch);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const verifyCode = async (totpCode: string) => {
    try {
      const result = await authAPI.verifyTwoFactor({ totpCode }, dispatch);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const enableTwoFactor = async (totpCode: string, secret?: string) => {
    try {
      const result = await authAPI.enableTwoFactor({ totpCode, secret }, dispatch);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const disableTwoFactor = async (totpCode: string) => {
    try {
      const result = await authAPI.disableTwoFactor({ totpCode }, dispatch);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const getStatus = async () => {
    try {
      const result = await authAPI.getTwoFactorStatus(dispatch);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const generateBackupCodes = async (totpCode: string) => {
    try {
      const result = await authAPI.generateBackupCodes({ totpCode }, dispatch);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const regenerateBackupCodes = async (totpCode: string) => {
    try {
      const result = await authAPI.regenerateBackupCodes({ totpCode }, dispatch);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const getBackupCodesStatus = async () => {
    try {
      const result = await authAPI.getBackupCodesStatus(dispatch);
      return result;
    } catch (error) {
      throw error;
    }
  };

  return {
    generateSecret,
    verifyCode,
    enableTwoFactor,
    disableTwoFactor,
    getStatus,
    generateBackupCodes,
    regenerateBackupCodes,
    getBackupCodesStatus,
  };
};

export default useTwoFactor;