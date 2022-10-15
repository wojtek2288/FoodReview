namespace FoodReview.Api;

public static class Config
{
    public static class App
    {
        public static string ApiDomain(IConfiguration cfg) =>
            cfg.GetString("Domains:Api");

        public static string ApiBase(IConfiguration cfg) =>
            $"http://{ApiDomain(cfg)}";
    }

    public static class SqlServer
    {
        public static string ConnectionString(IConfiguration cfg) => cfg.GetString("SqlServer:ConnectionString");
    }

    public static class Services
    {
        public static string[] AllowedOrigins(IConfiguration cfg) =>
            ExternalApps(cfg)
                .Concat(Array.Empty<string>())
                .ToArray();

        public static class Auth
        {
            public static string Address(IConfiguration cfg) => $"{App.ApiBase}/auth";
        }
    }

    public static string[] ExternalApps(IConfiguration cfg) =>
        cfg?.GetSection("CORS:External").Get<string[]>() ?? Array.Empty<string>();

    private static string GetString(this IConfiguration configuration, string key)
    {
        return configuration.GetValue<string>(key);
    }
}

