# End-to-End Deployment Guide

1. Provision infrastructure (e.g., Vercel for Frontend, Render/Railway for Backend).
2. Set Environment Variables across both platforms.
3. Deploy Backend first. Wait for health check `/api/v1/health/liveness`.
4. Deploy Frontend.
5. Verify public accessibility.
