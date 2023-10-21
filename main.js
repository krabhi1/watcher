import { watch } from 'chokidar';
import { exec } from 'child_process';
import process from 'process';
import c from './color.js';

const currentDirectory = process.cwd();
console.log(`Current working directory: ${currentDirectory}`);

// Get the list of file paths as command line arguments
const filesToWatch = "./";

// Define the bash script to execute
const bashScript = './run.sh';

// Define arrays for ignored directories and files
const ignoredDirs = ['node_modules', 'hell']; //load from cli args or .watcher.json
const ignoredFiles = ['log.txt', 'temp.txt'];
console.log({ ignoredDirs, ignoredFiles })
// Create a watcher for the specified files with ignore options
const watcher = watch(filesToWatch, {
    ignored: [...ignoredDirs, ...ignoredFiles],
});

//console.log(`Watching files: ${filesToWatch.join(', ')}`);
function clear() {
    process.stdout.write('\x1Bc');
}
function runScript() {
    exec(` bash ${bashScript}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing the bash script: ${error}`);
        }
        console.log(stdout);
    });
}
runScript()
// Set up the event listener for file changes
watcher.on('change', (filePath) => {
    clear()
    console.log(`${c.green}reload due to : ${c.yellow}${filePath}  ${c.green}change${c.reset}`);
    console.log(`${c.blue}` + '-'.repeat(25) + 'output' + '-'.repeat(25) + `${c.reset}`)
    runScript()
});

// Handle errors and other events if needed 
watcher.on('error', (error) => {
    console.error(`Watcher error: ${error}`);
});
