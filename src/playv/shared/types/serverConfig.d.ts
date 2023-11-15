declare module 'alt-server' {
  export interface IServerConfig {
    database: {
      host: string;
      port: number;
      username: string;
      password: string;
      database: string;
      refreshScheme: boolean;
    };
    ports: {
      discordauthport: number;
      discordbotsocket: number;
      adminpanelsocket: number;
    };
    discordlogin: {
      redirectURI: string;
      clientsecret: string;
      listenerPath: string;
    };
  }
}
