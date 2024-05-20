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
import { isFileExists, print } from './utils.js';
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
        required: true,

    })
    .option('args', {
        alias: 'a',
        describe: 'script arguments',
        type: 'string',
    })
    .help('help')
    .alias('help', 'h')
    .example("node yourScript.js --ignoreDirs=dir1,dir2 --ignoreFiles=file1.txt,file2.txt --run=myscript.sh")
    .example("node yourScript.js --ignoreDirs=dir1,dir2 --ignoreFiles=file1.txt,file2.txt --run='node -v'")
    .version(packageJson.version) // Add the version option
    .alias('version', 'v') // Optional alias for the version option
    .parse()

console.log(argv)
const currentDirectory = process.cwd();
console.log(`${c.dim}watching  directory: ${currentDirectory}${c.reset}`);
const filesToWatch = "./";
const runArg = argv.run || ""
//check run.sh exists or not
const isScriptMode = isFileExists(runArg)

const ignoredDirs = argv.ignoreDirs ? argv.ignoreDirs.split(',') : []
ignoredDirs.push('.git')
const ignoredFiles = argv.ignoreFiles ? argv.ignoreFiles.split(',') : []
const args = argv.args ? argv.args.split(" ") : []
print({ ignoredDirs, ignoredFiles, runArg: runArg, args, isScriptMode }, c.dim)
let currentShell = null

const watcher = watch(filesToWatch, {
    ignored: [...ignoredDirs, ...ignoredFiles],
});

async function run(msg, justShell = false) {
    if (justShell) {
        reCreateShell()
        return
    }
    clear()
    if (msg)
        console.log(`${c.green} ${msg} ${c.reset}`);
    drawLineWithText('output')
    reCreateShell()
}
process.stdout.on('resize', () => {
    run("reload due to terminal resize")
})
watcher.on('change', (filePath) => {
    run(`reload due to : ${filePath} change`)
});

// Handle errors and other events if needed 
watcher.on('error', (error) => {
    console.error(`Watcher error: ${error}`);
});
function drawLineWithText(text) {
    const { columns } = process.stdout;
    const times = (columns - text.length) / 2
    console.log(`${c.blue}` + '-'.repeat(times) + text + '-'.repeat(times) + `${c.reset}`)

}
function reCreateShell() {
    if (currentShell) {
        //kill all its child process
        currentShell.kill();

    }
    let _shell
    if (isScriptMode) {
        _shell = spawn('bash ', [runArg, ...args], { shell: "/usr/bin/bash" });
    } else {
        if (runArg == "") {
            console.log("run argument is empty")
            process.exit(1)
        }

        const runArgsList = runArg.trim().split(' ').filter(Boolean)
        const command = runArgsList.shift()

        // console.log({ command, runArgsList })
        _shell = spawn(command, runArgsList, { shell: "/usr/bin/bash", }); 
    }
    _shell.stdout.on('data', (data) => {
        const text = data.toString()
        process.stdout.write(text)

    });
    _shell.stderr.on('data', (data) => {
        const text = data.toString()
        process.stdout.write(`${c.red} ${text} ${c.reset}`) 
    });

 
    _shell.on('close', (code) => {
        // console.log(`Shell closed with code ${code}`);
    });
    currentShell = _shell
}
function clear() {
    process.stdout.write('\x1Bc');
}

run(undefined, true)