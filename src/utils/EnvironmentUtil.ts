export class EnvironmentUtil {
    public static isDev(): boolean {
        return process.env.NODE_ENV === 'development';
    }

    public static isProd(): boolean {
        return process.env.NODE_ENV === 'production';
    }
}