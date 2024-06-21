import * as crypto from 'crypto';

export function encryptPassword(password: string): string {
    const sha256 = crypto.createHash('sha256');
    sha256.update(password, 'utf8');
    return sha256.digest('hex');
}