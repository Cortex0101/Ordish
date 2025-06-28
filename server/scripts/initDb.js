import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the init.sql file
const initSqlPath = path.join(__dirname, '..', 'database', 'init.sql');

// Check if init.sql exists
if (!fs.existsSync(initSqlPath)) {
    console.error('Error: init.sql file not found at:', initSqlPath);
    process.exit(1);
}

console.log('Initializing database with init.sql...');

// Read the SQL file
const sqlContent = fs.readFileSync(initSqlPath, 'utf8');

// Execute the SQL content via docker exec
const dockerProcess = spawn('docker', [
    'exec', '-i', 'ordish-mariadb-1',
    'mariadb', '-u', 'root', '-pdevpassword', 'ordish_db_dev'
], {
    stdio: ['pipe', 'inherit', 'inherit']
});

// Handle errors
dockerProcess.on('error', (error) => {
    console.error('Error executing docker command:', error.message);
    process.exit(1);
});

dockerProcess.on('close', (code) => {
    if (code === 0) {
        console.log('Database initialization completed successfully!');
    } else {
        console.error(`Database initialization failed with exit code: ${code}`);
        process.exit(code);
    }
});

// Send SQL content to the docker process
dockerProcess.stdin.write(sqlContent);
dockerProcess.stdin.end();
