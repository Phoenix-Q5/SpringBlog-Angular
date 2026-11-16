# angular-reddit-clone
Reddit lke application using Angular, this serves as frontend for the backend API built using Springboot - You can find the source code for backend API here - https://github.com/SaiUpadhyayula/spring-reddit-clone

## Development

Use Node.js 20.19.x, 22.12.x or newer within Node 22, or Node 24+. Install dependencies with `npm ci` and start the application with `npm start`.

Configure `apiBaseUrl` as an absolute URL without a trailing slash, and set the external image, avatar, and social URLs in `src/environments/environment.ts`. Production builds replace it with `src/environments/environment.prod.ts`, which must be configured separately. These values are bundled into the application and are public; do not put secrets in them. Rebuild after changing them.

Run `npm run build`, `npm test -- --watch=false`, and `npm run lint` for the application checks. End-to-end tests use Playwright: run `npx playwright install chromium` once, then `npm run e2e`. The end-to-end tests mock the backend. Set `E2E_PORT` to use a port other than 4200.

The post editor uses CKEditor 5 with its GPL license option. Deployments must comply with the GPL terms or configure a valid commercial license instead.

## Docker deployment

Build and start the production container from the repository root:

```sh
docker compose up -d --build
```

Docker restarts the container after a reboot when the Docker service starts. Enable Docker at boot (for example, `sudo systemctl enable --now docker` on a systemd server). The `unless-stopped` policy preserves a manual stop across restarts. Use `docker compose logs -f` to view logs and `docker compose down` to remove the container.

The container joins the existing external `proxy` Docker network without publishing a host port. Traefik routes `blog.corevanta.app` to its internal port 8080. In Cloudflare Tunnel, route `blog.corevanta.app` to `http://traefik:80`, and serve the public hostname over HTTPS. The production API is `https://api-blog.corevanta.app/api`; the browser calls it directly, not through the container. Configure the backend and Cloudflare to allow `https://blog.corevanta.app` and CORS preflight requests, including the `Authorization` header and the methods your API uses. Cloudflare must have a valid route and TLS configuration for the backend hostname.

The URL is baked into the image at build time; edit `src/environments/environment.prod.ts` and run `docker compose up -d --build` to change it. Ensure `package-lock.json` is included in your deployment source because the image uses `npm ci`.
