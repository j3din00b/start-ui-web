import { expect, test } from '@playwright/test';
import { pageUtils } from 'e2e/utils/pageUtils';
import { ADMIN_EMAIL } from 'e2e/utils/users';

import { env } from '@/env.mjs';
import { ROUTES_ADMIN } from '@/features/admin/routes';

test.describe('Admin access', () => {
  test(`Redirect to Admin (${ROUTES_ADMIN.root()})`, async ({ page }) => {
    const utils = pageUtils(page);

    await utils.loginAdmin({ email: ADMIN_EMAIL });
    await page.waitForURL(
      `${env.NEXT_PUBLIC_BASE_URL}${ROUTES_ADMIN.root()}**`
    );

    await expect(page.getByTestId('admin-layout')).toBeVisible();
  });
});
