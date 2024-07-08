import { UserNotFoundError } from "../exceptions/userNotFoundError";
import { User } from "../model/users";
import getApiEndpoint from "./apiEndpoint";

export async function login(username: string, password: string) {
  const apiEndPoint = getApiEndpoint();
  let response;
  try {
    response = await fetch(apiEndPoint + "/login", {
      method: "POST",
      credentials: "include",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, password: password }),
    });
    switch (response.status) {
      case 200:
        return await response.text();
      case 404:
        throw new UserNotFoundError();
      default:
        throw new Error("Error in login");
    }
  } catch (error) {
    throw error;
  }
}

export async function logout() {
  const apiEndPoint = getApiEndpoint();
  let response;
  try {
    response = await fetch(apiEndPoint + "/logout", {
      credentials: "include",
      mode: "cors",
    });
    if (response.status === 200) {
      return await response.text();
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
}

export async function getUser(id: string) {
  const apiEndPoint = getApiEndpoint();
  let response;
  try {
    response = await fetch(apiEndPoint + "/user/" + id, {
      credentials: "include",
      mode: "cors",
    });

    if (response.status === 200) {
      let data = await response.json();
      let user = new User(data.username, data.email, data.role);
      user.setId(data.id);
      return user;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
}
