#!/usr/bin/env node
import { watch } from 'chokidar';
import { spawn } from 'child_process';
import process from 'process';
import c from './color.js';
import yargs from 'yargs';
import { hideBin } from "yargs/helpers";
import fs, { readFile } from 'fs/promises'
import { fileURLToPath } from 'url';
import path from 'path'
import { print } from './utils.js';
clear()
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(await fs.readFile(path.join(__dirname, 'package.json'), 'utf-8'))
const argv = yargs(hideBin(process.argv))
    .option('ignoreDirs', {
        alias: 'd',
        describe: 'Comma-separated list of directories to ignore',
        type: 'string',
    })
    .option('ignoreFiles', {
        alias: 'f',
        describe: 'Comma-separated list of files to ignore',
        type: 'string',
    })
    .option('run', {
        alias: 'r',
        describe: 'Bash script to execute',
        type: 'string',
    })
    .help('help')
    .alias('help', 'h')
    .example("node yourScript.js --ignoreDirs=dir1,dir2 --ignoreFiles=file1.txt,file2.txt --run=myscript.sh")
    .version(packageJson.version) // Add the version option
    .alias('version', 'v') // Optional alias for the version option
    .parse()


const currentDirectory = process.cwd();
console.log(`${c.dim}watching  directory: ${currentDirectory}${c.reset}`);
const filesToWatch = "./";
const bashScript = argv.run || 'run.sh';
const ignoredDirs = argv.ignoreDirs ? argv.ignoreDirs.split(',') : []
ignoredDirs.push('.git')
const ignoredFiles = argv.ignoreFiles ? argv.ignoreFiles.split(',') : []
print({ ignoredDirs, ignoredFiles, bashScript }, c.dim)


const watcher = watch(filesToWatch, {
    ignored: [...ignoredDirs, ...ignoredFiles],
});

async function runScript() {
    if (!bashScript) {
        console.log(`${c.red} run script missing!`)
        return
    }
    const commands = await readFile(bashScript, 'utf-8')
    shell.stdin.write(commands + "\n");
}
console.log(`${c.blue}` + '-'.repeat(25) + 'output' + '-'.repeat(25) + `${c.reset}`)
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

const shell = spawn('bash', { shell: true });
//shell.stdout.pipe(process.stdin)
shell.stdout.on('data', (data) => {
    const text = data.toString()
    process.stdout.write(text)

});
shell.stderr.on('data', (data) => {
    const text = data.toString()
    process.stdout.write(`${c.red} ${text} ${c.reset}`)
});

function clear() {
    process.stdout.write('\x1Bc');
}
shell.on('close', (code) => {
    console.log(`Shell closed with code ${code}`);
});


runScript()