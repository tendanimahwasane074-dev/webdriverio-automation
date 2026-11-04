/**
 * Generates throwaway credentials for scenarios that need a fresh,
 * non-colliding email on every run rather than a fixed Examples value.
 * The demo app only validates format (regex email, password length >= 8) -
 * there's no real backend - so any syntactically valid pair works for both
 * sign up and the subsequent login with the same credentials.
 */
export function randomEmail(domain = 'gmail.com'): string {
    const digits = Math.floor(1000 + Math.random() * 9000)
    return `test${digits}@${domain}`
}

export function randomPassword(length = 10): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    const digits = '0123456789'
    const all = letters + digits
    const pick = (set: string) => set[Math.floor(Math.random() * set.length)]

    // Guarantee at least one letter and one digit, then fill the rest randomly.
    let password = pick(letters) + pick(digits)
    while (password.length < length) {
        password += pick(all)
    }
    return password
}
