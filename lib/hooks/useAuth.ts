import { logout, selectCurrentUser, selectIsLoggedIn, selectIsInitialized } from '@/lib/store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { authAPI, type LoginRequest, type RegisterRequest, type TwoFactorLoginRequest, type BackupCodeLoginRequest } from '@/lib/actions/authAPi';

export const useAuth = () => {
  const dispatch = useAppDispatch();

  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const user = useAppSelector(selectCurrentUser);
  const isInitialized = useAppSelector(selectIsInitialized);

  const handleLogout = async () => {
    try {
      await authAPI.logout(dispatch);
    } catch (error) {
      console.error('Logout error:', error);
      // Still dispatch logout even if API call fails
      dispatch(logout());
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      const result = await authAPI.register(data, dispatch);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      const result = await authAPI.login(credentials, dispatch);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const loginWithTwoFactor = async (data: TwoFactorLoginRequest) => {
    try {
      const result = await authAPI.loginWithTwoFactor(data, dispatch);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const loginWithBackupCode = async (data: BackupCodeLoginRequest) => {
    try {
      const result = await authAPI.loginWithBackupCode(data, dispatch);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      const result = await authAPI.verifyEmail(token, dispatch);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const changePassword = async (passwordData: { currentPassword: string; newPassword: string }) => {
    try {
      const result = await authAPI.changePassword(passwordData, dispatch);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const result = await authAPI.forgotPassword({ email }, dispatch);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      const result = await authAPI.resetPassword({ token, password }, dispatch);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const resendVerificationEmail = async (email: string) => {
    try {
      const result = await authAPI.resendVerificationEmail(email, dispatch);
      return result;
    } catch (error) {
      throw error;
    }
  };

  return {
    // State
    isLoggedIn,
    user,
    isInitialized,
    
    // Actions
    logout: handleLogout,
    register,
    login,
    loginWithTwoFactor,
    loginWithBackupCode,
    verifyEmail,
    changePassword,
    forgotPassword,
    resetPassword,
    resendVerificationEmail,
  };
};

export default useAuth;
