FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy solution file vào thư mục gốc /src
COPY StudentManagement.slnx ./

# ĐÃ SỬA: Tạo thư mục con nào thì copy file .csproj vào đúng thư mục con đó để Solution tìm thấy
COPY StudentManagement.Api/StudentManagement.Api.csproj StudentManagement.Api/
COPY StudentManagement.Application/StudentManagement.Application.csproj StudentManagement.Application/
COPY StudentManagement.Infrastructure/StudentManagement.Infrastructure.csproj StudentManagement.Infrastructure/
COPY StudentManagement.Domain/StudentManagement.Domain.csproj StudentManagement.Domain/

# Bây giờ các file .csproj đã nằm đúng vị trí cấu trúc, lệnh restore sẽ chạy thành công
RUN dotnet restore StudentManagement.slnx

# Copy toàn bộ mã nguồn còn lại và publish
COPY . .
RUN dotnet publish StudentManagement.Api/StudentManagement.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:80
EXPOSE 80
ENTRYPOINT ["dotnet", "StudentManagement.Api.dll"]