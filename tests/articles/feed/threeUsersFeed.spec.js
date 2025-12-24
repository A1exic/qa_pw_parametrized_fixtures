import { test } from '../../_fixtures/fixtures';
import { signUpUser } from '../../../src/ui/actions/auth/signUpUser';
import { generateNewArticleData } from '../../../src/common/testData/generateNewArticleData';

const users = ['user1', 'user2', 'user3'];

test.describe('Лента статей показывает статьи других пользователей', () => {
  let articles = [];

  test.beforeEach(async ({ page, logger }) => {
    articles = [];

    for (const username of users) {
      const article = generateNewArticleData(logger);
      articles.push(article);

      await signUpUser(page, {
        username,
        email: `${username}@example.com`,
        password: 'Password1!',
      });
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
    }
  });
  test('Пользователь видит статьи двух других пользователей в ленте', async ({
    page,
  }) => {
    await signUpUser(page, {
      username: 'user1',
      email: 'user1@example.com',
      password: 'Password1!',
    });
    await page.goto('/');

    await page.locator(`text=${articles[1].title}`).shouldBeVisible();
    await page.locator(`text=${articles[2].title}`).shouldBeVisible();
  });
});
