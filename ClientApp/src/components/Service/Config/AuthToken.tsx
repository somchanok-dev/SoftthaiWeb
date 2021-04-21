
export class AuthToken {
    static get() {
        return (
            localStorage.getItem(`${process.env.REACT_APP_JWT_KEY}`) || null
        );
    }

    static set(token: any) {
        localStorage.setItem(`${process.env.REACT_APP_JWT_KEY}`, token || '');
    }

    static applyFromLocationUrlIfExists() {
        const urlParams = new URLSearchParams(
            window.location.search,
        );
        const authToken = urlParams.get('authToken');

        if (!authToken) {
            return;
        }

        this.set(authToken);
        window.history.replaceState(
            {},
            document.title,
            window.location.origin,
        );
    }
}
