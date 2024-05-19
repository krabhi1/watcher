import { spawn } from 'child_process';
import c from './color.js';
// const shell = spawn('bash', ['-c', 'echo $HOME'])
const shell = spawn('node ', ['-v'], { shell: true, });

shell.stdout.on('data', (data) => {
    const text = data.toString()
    process.stdout.write(text)
})
shell.stderr.on('data', (data) => {
    const text = data.toString()
    process.stdout.write(`${c.red} ${text} ${c.reset}`)
})
shell.on('close', (code) => {
    console.log(`Shell closed with code ${code}`); 
})

