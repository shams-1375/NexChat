import api from "./axios.js";

export const signup = async (signupData) => {
  const response = await api.post("/auth/signup", signupData);
  return response.data;
};

export const login = async (loginData) => {
  const response = await api.post("/auth/login", loginData);
  return response.data;
};
export const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const getAuthUser = async () => {
  try {
    const res = await api.get("/auth/me");
    return res.data;
  } catch (error) {
    console.log("Error in getAuthUser:", error);
    return null;
  }
};

export const completeOnboarding = async (userData) => {
  const response = await api.post("/auth/onboarding", userData);
  return response.data;
};

export async function getUserFriends() {
  const response = await api.get("/users/friends");
  return response.data;
}

export async function getRecommendedUsers() {
  const response = await api.get("/users");
  return response.data;
}

export async function getOutgoingFriendReqs() {
  const response = await api.get("/users/outgoing-friend-requests");
  return response.data;
}

export async function sendFriendRequest(userId) {
  const response = await api.post(`/users/friend-request/${userId}`);
  return response.data;
}

export async function getFriendRequests() {
  const response = await api.get("/users/friend-requests");
  return response.data;
}

export async function acceptFriendRequest(requestId) {
  const response = await api.put(`/users/friend-request/${requestId}/accept`);
  return response.data;
}

export async function getStreamToken() {
  const response = await api.get("/chat/token");
  return response.data;
}