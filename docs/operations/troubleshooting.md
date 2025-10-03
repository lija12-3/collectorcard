# Troubleshooting Guide

This guide helps you diagnose and resolve common issues in the Cardinal platform.

## Quick Diagnostics

### 1. Health Check Commands

```bash
# Check all services
curl http://localhost:3000/api/v1/health  # BFF Service
curl http://localhost:3001/health         # User Service
curl http://localhost:3002/health         # Payment Service
curl http://localhost:3003/health         # Notification Service

# Check database connection
psql -h localhost -U postgres -d cardinal -c "SELECT 1;"

# Check Redis connection
redis-cli ping
```

### 2. Service Status

```bash
# Check running processes
ps aux | grep node

# Check port usage
netstat -tulpn | grep :300

# Check Docker containers
docker ps
```

## Common Issues

### 1. Service Won't Start

#### Port Already in Use

**Symptoms:**
- Error: `EADDRINUSE: address already in use :::3000`
- Service fails to start

**Solutions:**
```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

#### Missing Dependencies

**Symptoms:**
- Error: `Cannot find module`
- Service crashes on startup

**Solutions:**
```bash
# Install dependencies
npm install

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for missing peer dependencies
npm install --save-dev @types/node
```

#### Environment Variables Missing

**Symptoms:**
- Error: `Environment variable not found`
- Service fails to initialize

**Solutions:**
```bash
# Check .env file exists
ls -la .env

# Verify environment variables
node -e "console.log(process.env.JWT_SECRET)"

# Load environment variables
source .env
```

### 2. Database Issues

#### Connection Refused

**Symptoms:**
- Error: `ECONNREFUSED`
- Database queries fail

**Solutions:**
```bash
# Check if PostgreSQL is running
pg_isready -h localhost -p 5432

# Start PostgreSQL
sudo systemctl start postgresql

# Check connection
psql -h localhost -U postgres -d cardinal -c "SELECT 1;"
```

#### Authentication Failed

**Symptoms:**
- Error: `password authentication failed`
- Database connection fails

**Solutions:**
```bash
# Check credentials
psql -h localhost -U postgres -d cardinal

# Reset password
sudo -u postgres psql
ALTER USER postgres PASSWORD 'new_password';

# Update .env file
DB_PASSWORD=new_password
```

#### Database Not Found

**Symptoms:**
- Error: `database "cardinal" does not exist`
- Migration fails

**Solutions:**
```bash
# Create database
createdb -h localhost -U postgres cardinal

# Or using psql
psql -h localhost -U postgres
CREATE DATABASE cardinal;
```

### 3. Authentication Issues

#### JWT Token Invalid

**Symptoms:**
- Error: `Unauthorized`
- API calls fail with 401

**Solutions:**
```bash
# Check JWT secret
echo $JWT_SECRET

# Verify token format
node -e "console.log(JSON.parse(Buffer.from('token.split(\'.\')[1], \'base64\').toString()))"

# Generate new token
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

#### Token Expired

**Symptoms:**
- Error: `Token expired`
- User logged out unexpectedly

**Solutions:**
```bash
# Check token expiration
node -e "const token='your-token'; const payload=JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()); console.log(new Date(payload.exp * 1000));"

# Refresh token
curl -X POST http://localhost:3001/auth/refresh \
  -H "Authorization: Bearer your-refresh-token"
```

### 4. BFF Service Issues

#### Service Unavailable

**Symptoms:**
- Error: `Service temporarily unavailable`
- Circuit breaker open

**Solutions:**
```bash
# Check downstream services
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health

# Check BFF logs
tail -f logs/bff-service.log

# Reset circuit breaker
curl -X POST http://localhost:3000/api/v1/health/reset-circuit-breaker
```

#### Aggregation Timeout

**Symptoms:**
- Error: `Request timeout`
- Slow response times

**Solutions:**
```bash
# Check service response times
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3001/health

# Increase timeout in BFF configuration
# Update microservice timeout settings
```

### 5. AWS Service Issues

#### SQS Connection Failed

**Symptoms:**
- Error: `AWS SQS connection failed`
- Messages not being sent

**Solutions:**
```bash
# Check AWS credentials
aws sts get-caller-identity

# Test SQS connection
aws sqs list-queues

# Check queue exists
aws sqs get-queue-url --queue-name cardinal-payments-dev
```

#### SES Email Failed

**Symptoms:**
- Error: `SES email sending failed`
- Emails not being delivered

**Solutions:**
```bash
# Check SES configuration
aws ses get-send-quota

# Verify email addresses
aws ses list-verified-email-addresses

# Check sending limits
aws ses get-send-statistics
```

## Debugging Techniques

### 1. Enable Debug Logging

```bash
# Set debug environment
DEBUG=cardinal:* npm run dev

# Specific debug namespaces
DEBUG=cardinal:auth npm run dev
DEBUG=cardinal:database npm run dev
DEBUG=cardinal:bff npm run dev
```

### 2. Log Analysis

```bash
# View recent logs
tail -f logs/user-service.log
tail -f logs/payment-service.log
tail -f logs/notification-service.log
tail -f logs/bff-service.log

# Search for errors
grep -i error logs/*.log
grep -i exception logs/*.log
grep -i failed logs/*.log

# Search for specific patterns
grep "User not found" logs/*.log
grep "Payment failed" logs/*.log
```

### 3. Database Debugging

```bash
# Enable query logging
# In your service configuration
logging: true

# Check slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

# Check active connections
SELECT * FROM pg_stat_activity;
```

### 4. Network Debugging

```bash
# Check network connectivity
ping localhost
telnet localhost 5432
telnet localhost 6379

# Check DNS resolution
nslookup localhost
dig localhost

# Monitor network traffic
netstat -tulpn | grep :300
ss -tulpn | grep :300
```

## Performance Issues

### 1. Slow Response Times

**Diagnosis:**
```bash
# Check response times
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3000/api/v1/dashboard

# Monitor CPU usage
top -p $(pgrep node)

# Check memory usage
free -h
ps aux --sort=-%mem | head
```

**Solutions:**
```typescript
// Enable caching
@Cache('dashboard', 300)
async getDashboardData(userId: string) {
  // Implementation
}

// Optimize database queries
const users = await this.userRepository.find({
  select: ['id', 'email', 'firstName', 'lastName']
});

// Use connection pooling
const connection = await createConnection({
  // ... other config
  extra: {
    max: 20,
    min: 5,
    idleTimeoutMillis: 30000,
  }
});
```

### 2. High Memory Usage

**Diagnosis:**
```bash
# Check memory usage
ps aux --sort=-%mem | head

# Check for memory leaks
node --inspect server.js
# Open chrome://inspect in Chrome
```

**Solutions:**
```typescript
// Clear caches periodically
setInterval(() => {
  this.cache.clear();
}, 300000); // 5 minutes

// Use streaming for large datasets
const stream = this.userRepository
  .createQueryBuilder('user')
  .stream();
```

### 3. Database Performance

**Diagnosis:**
```sql
-- Check slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Check index usage
SELECT schemaname, tablename, attname, n_distinct, correlation 
FROM pg_stats 
WHERE tablename = 'users';
```

**Solutions:**
```sql
-- Add indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);

-- Optimize queries
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';
```

## Monitoring and Alerting

### 1. Health Monitoring

```bash
# Create health check script
#!/bin/bash
# health-check.sh

SERVICES=(
  "http://localhost:3000/api/v1/health"
  "http://localhost:3001/health"
  "http://localhost:3002/health"
  "http://localhost:3003/health"
)

for service in "${SERVICES[@]}"; do
  if curl -f -s "$service" > /dev/null; then
    echo "✅ $service is healthy"
  else
    echo "❌ $service is down"
    # Send alert
  fi
done
```

### 2. Log Monitoring

```bash
# Monitor logs for errors
tail -f logs/*.log | grep -i error

# Count errors by service
grep -c "ERROR" logs/user-service.log
grep -c "ERROR" logs/payment-service.log
grep -c "ERROR" logs/notification-service.log
grep -c "ERROR" logs/bff-service.log
```

### 3. Performance Monitoring

```bash
# Monitor response times
while true; do
  curl -w "Time: %{time_total}s\n" -o /dev/null -s http://localhost:3000/api/v1/health
  sleep 5
done

# Monitor memory usage
while true; do
  ps aux --sort=-%mem | head -5
  sleep 10
done
```

## Recovery Procedures

### 1. Service Recovery

```bash
# Restart all services
npm run stop
npm run start

# Restart specific service
cd services/user-service
npm run stop
npm run start

# Restart with clean state
npm run clean
npm run build
npm run start
```

### 2. Database Recovery

```bash
# Restore from backup
pg_restore -h localhost -U postgres -d cardinal backup.sql

# Reset database
dropdb -h localhost -U postgres cardinal
createdb -h localhost -U postgres cardinal
npm run migrate
```

### 3. Cache Recovery

```bash
# Clear Redis cache
redis-cli FLUSHALL

# Restart Redis
sudo systemctl restart redis

# Check Redis status
redis-cli ping
```

## Prevention Strategies

### 1. Proactive Monitoring

```bash
# Set up monitoring alerts
# Monitor disk space
df -h

# Monitor memory usage
free -h

# Monitor CPU usage
top -n 1

# Monitor network connectivity
ping -c 1 google.com
```

### 2. Regular Maintenance

```bash
# Daily health checks
./scripts/health-check.sh

# Weekly log rotation
logrotate /etc/logrotate.d/cardinal

# Monthly database maintenance
psql -h localhost -U postgres -d cardinal -c "VACUUM ANALYZE;"
```

### 3. Backup Procedures

```bash
# Daily database backup
pg_dump -h localhost -U postgres cardinal > backup-$(date +%Y%m%d).sql

# Weekly full backup
tar -czf cardinal-backup-$(date +%Y%m%d).tar.gz logs/ data/ config/
```

## Getting Help

### 1. Log Collection

When reporting issues, collect the following:

```bash
# System information
uname -a
node --version
npm --version

# Service logs
tail -100 logs/*.log

# Database status
psql -h localhost -U postgres -d cardinal -c "SELECT version();"

# Network status
netstat -tulpn | grep :300
```

### 2. Issue Reporting

Include the following information:

- **Error messages**: Complete error messages and stack traces
- **Steps to reproduce**: Detailed steps to reproduce the issue
- **Environment**: OS, Node.js version, database version
- **Logs**: Relevant log entries
- **Configuration**: Any custom configuration changes

### 3. Community Support

- Check the [GitHub Issues](https://github.com/your-org/cardinal/issues)
- Review the [Documentation](README.md)
- Join the community chat
- Contact the development team
