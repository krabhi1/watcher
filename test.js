import { spawn } from 'child_process';
import c from './color.js';
// const shell = spawn('bash', ['-c', 'echo $HOME'])
//node /home/abhishek/temp/postman-clone-back/dist/main.js
///usr/bin/bash
function test1() {
    {
        const shell = spawn('node ', ['/home/abhishek/temp/postman-clone-back/dist/main.js'], { shell: "/usr/bin/bash", });

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
        shell.kill()
    }
    {
        const shell = spawn('node ', ['/home/abhishek/temp/postman-clone-back/dist/main.js'], { shell: "/usr/bin/bash", });

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
    }

}
test1()