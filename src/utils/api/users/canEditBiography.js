import { isSuperuser } from '../auth/role';

export const canEditBiography = (callerUserId, callerRole, targetUserId) => {
  return callerUserId === targetUserId || isSuperuser(callerRole);
};
