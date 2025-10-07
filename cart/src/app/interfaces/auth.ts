export interface LoginCredentials {
    userName: string;
    password: string;
}

export interface AuthResponse {
    message: string;
    token: string;
    user: {
        _id: string;
        name: string;
        username: string;
    };
}

export interface User {
    _id: string;
    name: string;
    username: string;
}
