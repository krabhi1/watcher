import { fileURLToPath } from 'url';
const __dirname = fileURLToPath(import.meta.url);

export function print(message, color = "\x1b[37m") {
    console.log(color, message, "\x1b[0m")
}
