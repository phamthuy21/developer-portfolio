# Security Audit Report

- **Helmet**: Configured successfully for backend API.
- **CORS**: Restricted to specific frontend origin.
- **JWT**: Tokens expire promptly; refresh tokens handled securely.
- **Cookies**: Need to ensure `Secure` and `HttpOnly` are enabled in production.
- **Rate Limiting**: Configured for auth endpoints.
