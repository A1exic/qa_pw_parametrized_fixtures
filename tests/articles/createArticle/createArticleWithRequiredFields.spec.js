import { test } from '../../_fixtures/fixtures';
import { generateNewArticleData } from '../../../src/common/testData/generateNewArticleData';
import { signUpUser } from '../../../src/ui/actions/auth/signUpUser';

const tagSets = [
  ['tag1'],
  ['tag1', 'tag2'],
  ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'],
];

tagSets.forEach(tags => {
  test.describe(`Create and edit article with ${tags.length} tag(s)`, () => {
    let article;

    test.beforeEach(async ({ page, user, logger }) => {
      article = generateNewArticleData(logger);
      await signUpUser(page, user);
    });

    test(`User can create an article with ${tags.length} tag(s)`, async ({
      homePage,
      createArticlePage,
      viewArticlePage,
    }) => {
      await homePage.clickNewArticleLink();

      await createArticlePage.fillTitleField(article.title);
      await createArticlePage.fillDescriptionField(article.description);
      await createArticlePage.fillTextField(article.text);

      for (const tag of tags) {
        await createArticlePage.fillTagsField(tag);
        await createArticlePage.pressEnterToAddTag();
      }

      await createArticlePage.clickPublishArticleButton();

      await viewArticlePage.assertArticleTitleIsVisible(article.title);
      await viewArticlePage.assertArticleTextIsVisible(article.text);
      await viewArticlePage.assertTagsAreVisible(tags);
    });

    test(`User can remove all tags from an article with
       ${tags.length} tag(s)`, async ({
      homePage,
      createArticlePage,
      viewArticlePage,
      editArticlePage,
    }) => {
      await homePage.clickNewArticleLink();
      await createArticlePage.fillTitleField(article.title);
      await createArticlePage.fillDescriptionField(article.description);
      await createArticlePage.fillTextField(article.text);

      for (const tag of tags) {
        await createArticlePage.fillTagsField(tag);
        await createArticlePage.pressEnterToAddTag();
      }

      await createArticlePage.clickPublishArticleButton();

      await viewArticlePage.clickEditArticleButton();
      await editArticlePage.removeAllTags();
      await editArticlePage.clickPublishArticleButton();

      await viewArticlePage.assertTagsAreNotVisible();
    });
  });
});
