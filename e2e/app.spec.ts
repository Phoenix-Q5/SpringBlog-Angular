import { expect, test } from '@playwright/test';
import { environment } from '../src/environments/environment';
import { environment as productionEnvironment } from '../src/environments/environment.prod';

const config = process.env['E2E_PRODUCTION'] === '1' ? productionEnvironment : environment;

test.beforeEach(async ({ page }) => {
  await page.route(`${config.apiBaseUrl}/**`, async route => {
    const url = new URL(route.request().url());
    if (url.pathname === `${new URL(config.apiBaseUrl).pathname}/category`) {
      await route.fulfill({ json: [{ id: 1, name: 'Testing' }] });
    } else {
      await route.fulfill({ json: route.request().method() === 'POST' ? {} : [] });
    }
  });
});

test('displays the home page and navigates to login', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Create Post' })).toBeVisible();
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', config.urls.favicon);
  await expect(page.locator('app-header .logo img')).toHaveAttribute('src', config.urls.logo);
  await expect(page.locator('app-side-bar img')).toHaveAttribute('src', config.urls.sidebarImage);
  await expect(page.locator('app-home a[href="' + config.urls.github + '"]')).toBeVisible();
  await expect(page.locator('app-home > div').first()).toHaveCSS('background-image', `url("${config.urls.homeBackground}")`);
  await page.getByRole('link', { name: 'Login' }).click();
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
});

test('shows a loading spinner during login', async ({ page }) => {
  await page.route(`${config.apiBaseUrl}/auth/login`, async route => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    await route.fulfill({
      json: { authenticationToken: 'test-token', username: 'test-user', refreshToken: 'refresh', expiresAt: 'tomorrow' }
    });
  });
  await page.goto('/login');
  await page.getByLabel('Username').fill('test-user');
  await page.getByLabel('Password').fill('password');
  const loginRequest = page.waitForRequest(request =>
    request.url() === `${config.apiBaseUrl}/auth/login` && request.method() === 'POST'
  );
  await page.getByRole('button', { name: 'Login' }).click();
  await loginRequest;
  await expect(page.locator('.la-ball-spin-clockwise').first()).toBeVisible();
  await expect(page).toHaveURL('/');
});

test('submits rich text for a signed-in user', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('ngx-webstorage|authenticationtoken', JSON.stringify('test-token'));
    localStorage.setItem('ngx-webstorage|username', JSON.stringify('test-user'));
  });
  await page.goto('/create-post');
  await expect(page.locator('.ck-editor__editable')).toBeVisible();
  await page.getByPlaceholder('Title').fill('Test post');
  await page.getByPlaceholder('URL').fill('https://example.com');
  await page.locator('select').selectOption({ label: 'Testing' });
  await page.locator('.ck-editor__editable').fill('Post description');
  await expect(page.locator('.ck-editor__editable')).toContainText('Post description');
  const postRequest = page.waitForRequest(request =>
    request.url() === `${config.apiBaseUrl}/posts/` && request.method() === 'POST'
  );
  await page.getByRole('button', { name: 'Post', exact: true }).click();
  const request = await postRequest;
  expect(request.postDataJSON()).toEqual({
    postName: 'Test post',
    url: 'https://example.com',
    subredditName: 'Testing',
    description: '<p>Post description</p>'
  });
  await expect(page).toHaveURL('/');
});
