import exp from 'constants';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs'
const __dirname = fileURLToPath(import.meta.url);

export function print(message, color = "\x1b[37m") {
    console.log(color, message, "\x1b[0m")
}

export const isFileExists =  (path) => {
    return existsSync(path)
}