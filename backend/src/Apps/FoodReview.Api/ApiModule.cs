using System.Reflection;
using FluentValidation;
using FoodReview.Core.Contracts.Common;
using FoodReview.Core.Services;
using FoodReview.Core.Services.CQRS.Validation;
using MediatR;
using Microsoft.AspNetCore.Cors.Infrastructure;

namespace FoodReview.Api;

internal class ApiModule : IAppModule
{
    internal const string ApiCorsPolicy = "Api";

    private readonly IConfiguration config;
    private readonly IWebHostEnvironment hostEnv;

    public ApiModule(IConfiguration config, IWebHostEnvironment hostEnv)
    {
        this.config = config;
        this.hostEnv = hostEnv;
    }

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddMediatR(AppDomain.CurrentDomain.GetAssemblies());
        services.AddValidatorsFromAssembly(GetServicesAssembly());
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBahavior<,>));
        services.AddCors(ConfigureCORS);
        services.AddControllers();
        services.AddMvcCore(options =>
            {
                options.Conventions.Add(new CustomRouteToken(
                    "namespace",
                    c => c.ControllerType.Namespace));
            })
            .AddApplicationPart(GetContractsAssembly())
            .AddControllersAsServices();

#pragma warning disable ASP0000
        var sp = services.BuildServiceProvider();
        MediatorHelper.Instance = sp.GetService<IMediator>()!;
#pragma warning restore ASP0000
    }

    private void ConfigureCORS(CorsOptions opts)
    {
        opts.AddPolicy(ApiCorsPolicy, cfg =>
        {
            cfg
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader();
        });
    }

    private Assembly GetContractsAssembly()
    {
        return Assembly.Load(new AssemblyName("FoodReview.Core.Contracts"));
    }

    private Assembly GetServicesAssembly()
    {
        return Assembly.Load(new AssemblyName("FoodReview.Core.Services"));
    }
}
