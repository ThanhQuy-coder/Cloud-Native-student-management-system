# Microservices dockerization

## Scope

Root `docker-compose.yml` has been updated to run the backend as microservices instead of the old monolithic `backend` container.

## Containers

| Container | Service | Host port | Internal Docker host |
| --- | --- | --- | --- |
| `cn_student_db` | MySQL 8.1 | `3306` | `db_mysql` |
| `cn_student_rabbitmq` | RabbitMQ + Management UI | `5672`, `15672` | `rabbitmq` |
| `cn_auth_service` | AuthService | `5283` | `auth_service` |
| `cn_student_service` | StudentService | `5190` | `student_service` |
| `cn_academic_service` | AcademicService | `5160` | `academic_service` |
| `cn_enrollment_service` | EnrollmentService | `5117` | `enrollment_service` |
| `cn_api_gateway` | ApiGateway | `7000` | `api_gateway` |
| `cn_student_frontend` | Frontend | `5173` | `frontend` |

## Files added or updated

- `docker-compose.yml`
- `.env`
- `.env.example`
- `database/init-microservices.sql`
- `backend-microservices/ApiGateway/Dockerfile`
- `backend-microservices/Services/AuthService/Dockerfile`
- `backend-microservices/Services/StudentService/Dockerfile`
- `backend-microservices/Services/AcademicService/Dockerfile`
- `backend-microservices/Services/EnrollmentService/Dockerfile`
- `backend-microservices/ApiGateway/ocelot.json`

## Environment values checked

MySQL password has been updated consistently:

```text
MYSQL_ROOT_PASSWORD=Htq@12a2mysql
Database__Password=Htq@12a2mysql
```

RabbitMQ local values:

```text
RABBITMQ_DEFAULT_USER=student_management
RABBITMQ_DEFAULT_PASS=123456
RabbitMQ__Username=student_management
RabbitMQ__Password=123456
```

Gateway routes now use Docker DNS names instead of `localhost`:

```text
auth_service
student_service
academic_service
enrollment_service
```

## Database initialization

`database/init-microservices.sql` creates the microservice databases:

```text
student_management_auth
student_management_student
student_management_academic
student_management_enrollment
```

MySQL only runs `/docker-entrypoint-initdb.d` scripts when the `db_data` volume is first created. If the volume already exists, recreate it intentionally:

```powershell
docker compose down -v
docker compose up -d --build
```

## Run

From the project root:

```powershell
docker compose up -d --build
```

Gateway:

```text
http://localhost:7000
```

RabbitMQ Management:

```text
http://localhost:15672
```

## Validation

Completed:

```powershell
docker compose config
docker compose config --variables
```

The Docker Compose configuration renders correctly and all variables used by Compose are present in `.env.example`.

Not completed in this environment:

```powershell
docker compose build api_gateway auth_service student_service academic_service enrollment_service
```

Docker Desktop Linux engine was not running:

```text
failed to connect to the docker API at npipe:////./pipe/dockerDesktopLinuxEngine
```
