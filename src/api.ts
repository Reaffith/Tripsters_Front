import { User } from "./types/User";

const BASE_URL = "https://tripsters.up.railway.app";

async function fetchData(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("authToken");

  const headers = new Headers(options.headers || {});
  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
    mode: "cors",
  };

  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, config);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export async function getData(endpoint: string) {
  return await fetchData(endpoint);
}

export async function postData<T>(endpoint: string, data: T) {
  return await fetchData(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function putData<T>(endpoint: string, data: T) {
  return await fetchData(endpoint, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function deleteData(endpoint: string) {
  return await fetchData(endpoint, { method: "DELETE" });
}

type LoginData = {
  email: string;
  password: string;
};

export async function logIn(data: LoginData) {
  await fetchData("auth/login", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((response) => {
    localStorage.removeItem("authToken");

    if (response) {
      localStorage.setItem("authToken", response.token);
      window.location.reload();
    }

    console.log("localstorage", localStorage.getItem("authToken"));
  });
}

type RegUser = {
  email: string;
  password: string;
  repeatPassword: string;
  firstName: string;
  lastName: string;
};

export async function registerUser(data: RegUser): Promise<User | number | void> {
  try {
    const response = await fetch("https://tripsters.up.railway.app/auth/registration", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log(response.json());

    if (!response.ok) {
      return response.status;
    } else {
      logIn({
        email: data.email,
        password: data.password,
      });
    }

    return response.json();
  } catch (error) {
    console.error(error);
  }
}

type CreateTripType = {
  destination: string;
  startDate: string;
  endDate: string;
  startPoint: string;
  endPoint: string;
  additionalPoints: string[];
};

export async function createTrip(data: CreateTripType) {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch("https://tripsters.up.railway.app/trip", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error(`Error: ${response.status}`);
      throw new Error(`Failed to create trip: ${response.status}`);
    }

    const responseBody = await response.json();

    return responseBody;
  } catch (error) {
    console.error("Error while creating trip:", error);
    throw error;
  }
}

export const getTrips = async () => {
  const token = localStorage.getItem("authToken");

  try {
    const response = await fetch("https://tripsters.up.railway.app/trip", {
      method: "GET",
      mode: "cors",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.log(response.status);
      return [];
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllusersInTrip = async (id: string) => {
  const token = localStorage.getItem("authToken");

  try {
    const response = await fetch(`https://tripsters.up.railway.app/trip/users/all/${id}`, {
      method: "GET",
      mode: "cors",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.log(response.status);
      return response.status;
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  const token = localStorage.getItem("authToken");

  try {
    const response = await fetch(`https://tripsters.up.railway.app/users/all`, {
      method: "GET",
      mode: "cors",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.log(response.status);
      return [];
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }

  return [];
};

export const getUsersFriends = async (): Promise<
  | number
  | {
      id: number;
      userId: number;
      friendId: number;
      status: string;
      createdAt: Date;
    }[]
  | undefined
> => {
  const token = localStorage.getItem("authToken");

  try {
    const response = await fetch(`https://tripsters.up.railway.app/friends/user`, {
      method: "GET",
      mode: "cors",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.log(response.status);
      return response.status;
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const updateTrip = async (updatedTrip: {
  id: number;
  destination: string;
  startDate: string;
  endDate: string;
  startPoint: string;
  endPoint: string;
  additionalPoints: string[];
}) => {
  const token = localStorage.getItem("authToken");

  try {
    const response = await fetch("https://tripsters.up.railway.app/trip", {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedTrip),
    });

    if (!response.ok) {
      console.error(`Error: ${response.status}`);
      throw new Error(`Failed to create trip: ${response.status}`);
    }

    console.log(response.status)

    const responseBody = await response.json();

    return responseBody;
  } catch (error) {
    console.error("Error while updating trip:", error);
    throw error;
  }
};

export const getPhoto = async (fileUrl: string) => {
  const token = localStorage.getItem('authToken');
  try {
    const response = await fetch(
      `https://tripsters.up.railway.app/uploads/images/${fileUrl}`, {
        method: "GET",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch photo: ${response.statusText}`);
    }

    return await response.blob();
  } catch (error) {
    console.error("Error fetching photo:", error);
    throw error;
  }
};