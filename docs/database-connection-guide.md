
This guide explains how to connect to the Collectors Card database from your local machine.

## Prerequisites

- AWS CLI installed and configured
- kubectl installed
- pgAdmin (or any PostgreSQL client)
- Access to AWS credentials with appropriate permissions

## Step-by-Step Connection Process

### 1. Set Up AWS Credentials

#### Option A: Using AWS SSO (Recommended)
```bash
aws configure sso --profile cc_dev
```

#### Option B: Manual Credentials
1. Go to [AWS Console](https://console.aws.amazon.com)
2. Navigate to IAM → Users → Your User → Security credentials
3. Get fresh access keys or session tokens
4. Update `~/.aws/credentials` file:

```ini
[cc_dev]
aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
aws_session_token = YOUR_SESSION_TOKEN
```

### 2. Configure kubectl for EKS

```bash
aws eks update-kubeconfig --region us-east-1 --name dev-eks-fargate-cluster --profile cc_dev
```

Verify connection:
```bash
kubectl get pods
```

### 3. Set Up Port Forwarding

Find the aurora proxy pod:
```bash
kubectl get pods | grep aurora-tcp-proxy
```

Start port forwarding (run this in a separate terminal and keep it running):
```bash
kubectl port-forward aurora-tcp-proxy-6c556c8d74-v4twm 3306:3306
```

**Important**: Keep this terminal window open while using the database connection.

### 4. Connect with pgAdmin

#### Connection Settings:
- **Name**: `Collectors Card Dev Database`
- **Host**: `localhost` (or `127.0.0.1`)
- **Port**: `3306` (or try `5432` if `3306` doesn't work)
- **Database**: `appdb`
- **Username**: `dbadmin`
- **Password**: `3*+(0m-C1sj+a^^bGLX6=#>ua|GqvQj-`

#### Steps in pgAdmin:
1. Open pgAdmin
2. Right-click on "Servers" → "Create" → "Server..."
3. Fill in the connection details above
4. Click "Save"

### 5. Alternative: Using MikroORM CLI

Navigate to the backend directory and set environment variables:

```bash
cd backend
```

Set environment variables (PowerShell):
```powershell
$env:DB_HOST="localhost"
$env:DB_PORT="3306"
$env:DB_USERNAME="dbadmin"
$env:DB_PASSWORD="3*+(0m-C1sj+a^^bGLX6=#>ua|GqvQj-"
$env:DB_DATABASE="appdb"
$env:DB_TYPE="postgresql"
$env:DB_SSL="false"
```

Run MikroORM commands:
```bash
# List migrations
npx mikro-orm migration:list

# Run migrations
npx mikro-orm migration:up

# Check pending migrations
npx mikro-orm migration:pending
```

## Troubleshooting

### Common Issues

#### 1. AWS Credentials Expired
**Error**: `ExpiredTokenException` or `ExpiredToken`
**Solution**: Get fresh credentials from AWS Console or refresh SSO session

#### 2. kubectl Connection Failed
**Error**: `Unable to connect to the server`
**Solution**: 
- Verify AWS credentials are valid
- Check if EKS cluster name is correct
- Ensure you have proper IAM permissions

#### 3. Port Forwarding Not Working
**Error**: `Connection refused` in pgAdmin
**Solution**:
- Verify port forwarding is running: `netstat -an | findstr :3306`
- Check if the aurora proxy pod is running: `kubectl get pods`
- Try different port (3306 vs 5432)

#### 4. Database Connection Failed
**Error**: `Connection refused` or `Authentication failed`
**Solution**:
- Verify port forwarding is active
- Check username/password are correct
- Try both ports 3306 and 5432
- Ensure the database is actually PostgreSQL (not MySQL)

### Verification Commands

Check if everything is working:

```bash
# 1. Verify AWS credentials
aws sts get-caller-identity --profile cc_dev

# 2. Verify kubectl connection
kubectl get pods

# 3. Verify port forwarding
netstat -an | findstr :3306

# 4. Test database connection (if you have psql)
psql -h localhost -p 3306 -U dbadmin -d appdb
```

## Security Notes

- **Never commit credentials** to version control
- **Use environment variables** for sensitive data
- **Rotate credentials regularly**
- **Use least privilege principle** for IAM permissions

## Quick Reference

| Component | Value |
|-----------|-------|
| AWS Profile | `cc_dev` |
| EKS Cluster | `dev-eks-fargate-cluster` |
| Region | `us-east-1` |
| Database Host | `localhost` |
| Database Port | `3306` (or `5432`) |
| Database Name | `appdb` |
| Username | `dbadmin` |
| Password | `3*+(0m-C1sj+a^^bGLX6=#>ua|GqvQj-` |

## Next Steps

Once connected, you can:
- Run database migrations
- Inspect database schema
- Query data using SQL
- Manage database users and permissions
- Monitor database performance

---

**Last Updated**: January 2025  
**Maintained by**: Collectors Card Team
