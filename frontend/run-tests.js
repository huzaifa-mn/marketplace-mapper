const { execSync } = require('child_process');

try {
    const output = execSync('npm test -- --verbose --no-coverage', {
        encoding: 'utf-8',
        stdio: 'pipe',
        cwd: __dirname,
    });
    console.log(output);
} catch (error) {
    console.log(error.stdout);
    console.error(error.stderr);
    process.exit(1);
}
