type AuthData = {
  user: {
    id: string;
    employeeId: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    department: {
      _id: string;
      name: string;
    };
    designation: string;
    isActive: boolean;
  };
  token: string;
};

// getAuthData retrieves and parses the auth data from localStorage
export const getAuthData = (): AuthData | null => {
  if (typeof window === "undefined") return null;
  const authDataString = localStorage.getItem("authData");
  const parsed = authDataString ? JSON.parse(authDataString) : null;
  return parsed;
};

export const getToken = (): string | null => {
  const authData = getAuthData();
  const token = authData?.token || null;
  return token;
};

export const getUser = () => {
  const authData = getAuthData();
  return authData?.user || null;
};

export const getUserId = (): string | null => {
  const user = getUser();
  return user?.id || null;
};

export const getUserRole = (): string | null => {
  const user = getUser();
  return user?.role || null;
};

// Todo
export const isAuthenticated = (): boolean => {
  return !!getToken();
};
