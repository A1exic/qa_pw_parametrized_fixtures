import { test, expect } from '../../_fixtures/fixtures';
import { signUpUser } from '../../../src/ui/actions/auth/signUpUser';
import { generateNewArticleData } from '../../../src/common/testData/generateNewArticleData';

const users = [
  { username: 'user1', email: 'user1@example.com', password: 'Password1!' },
  { username: 'user2', email: 'user2@example.com', password: 'Password1!' },
  { username: 'user3', email: 'user3@example.com', password: 'Password1!' },
];

test.describe('Лента статей с несколькими пользователями', () => {
  let articles;

  test.beforeEach(async ({ browser }) => {
    articles = [];
    for (const user of users) {
      const context = await browser.newContext();
      const page = await context.newPage();

      const article = generateNewArticleData();
      articles.push(article);

      await signUpUser(page, user);

      await page.goto('/');
      await page.click('text=New Article');
      await page.fill('input[placeholder="Article Title"]', article.title);
      await page.fill(
        'input[placeholder="What\'s this article about?"]',
        article.description,
      );
      await page.fill(
        'textarea[placeholder="Write your article (in markdown)"]',
        article.text,
      );
      await page.click('text=Publish Article');

      await context.close();
    }
  });

  test('Пользователь видит статьи двух других пользователей в ленте', async ({
    browser,
  }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await signUpUser(page, users[0]);
    await page.goto('/');

    await expect(page.locator(`text=${articles[1].title}`)).toBeVisible();
    await expect(page.locator(`text=${articles[2].title}`)).toBeVisible();

    await context.close();
  });
});
