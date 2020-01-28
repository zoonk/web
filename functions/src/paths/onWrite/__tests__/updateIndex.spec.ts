import functions from 'firebase-functions-test';

const testEnv = functions();
testEnv.mockConfig({ algolia: { app_id: 'app id', api_id: 'api id' } });

import { algoliaClient } from '../../../algolia';
import { onWritePathUpdateIndex } from '../updateIndex';

test('return if there are no changes', async (done) => {
  const context = { params: { id: 'itemId' } };
  const data = {
    description: 'description',
    photo: 'photo',
    title: 'topic name',
  };
  const after = {
    ...data,
    language: 'en',
    updatedById: 'editorId',
  };
  const change = {
    before: { data: () => data },
    after: { data: () => after },
  };
  const wrapped = testEnv.wrap(onWritePathUpdateIndex);
  const req = await wrapped(change, context);

  expect(req).toBe(false);
  expect(algoliaClient.initIndex('').deleteObject).not.toHaveBeenCalled();
  expect(
    algoliaClient.initIndex('').partialUpdateObject,
  ).not.toHaveBeenCalled();
  done();
});

test('delete the index when an item is removed', async (done) => {
  spyOn(algoliaClient.initIndex(''), 'deleteObject').and.returnValue('deleted');

  const context = { params: { id: 'itemId' } };
  const before = {
    description: 'description',
    language: 'en',
    photo: 'photo',
    title: 'name',
  };
  const change = {
    before: { data: () => before },
    after: { data: () => undefined },
  };
  const wrapped = testEnv.wrap(onWritePathUpdateIndex);
  const req = await wrapped(change, context);

  expect(req).toBe('deleted');
  expect(algoliaClient.initIndex).toHaveBeenCalledWith('paths_en');
  expect(algoliaClient.initIndex('').deleteObject).toHaveBeenCalledWith(
    'itemId',
  );
  expect(
    algoliaClient.initIndex('').partialUpdateObject,
  ).not.toHaveBeenCalled();
  done();
});

test('update the index when an item changes', async (done) => {
  spyOn(algoliaClient.initIndex(''), 'partialUpdateObject').and.returnValue(
    'updated',
  );

  const context = { params: { id: 'itemId' } };
  const before = {
    description: 'description',
    photo: 'photo',
    title: 'name',
  };
  const after = {
    description: 'new description',
    language: 'en',
    updatedById: 'editorId',
    likes: 10,
    photo: 'new photo',
    topics: ['item 1', 'item 2'],
    title: 'new name',
  };
  const expected = {
    description: 'new description',
    itemPath: 'paths/itemId',
    objectID: 'itemId',
    photo: 'new photo',
    title: 'new name',
  };
  const change = {
    before: { data: () => before },
    after: { data: () => after },
  };
  const wrapped = testEnv.wrap(onWritePathUpdateIndex);
  const req = await wrapped(change, context);

  expect(req).toBe('updated');
  expect(algoliaClient.initIndex).toHaveBeenCalledWith('paths_en');
  expect(algoliaClient.initIndex('').deleteObject).not.toHaveBeenCalledWith(
    'itemId',
  );
  expect(algoliaClient.initIndex('').partialUpdateObject).toHaveBeenCalledWith(
    expected,
    true,
  );
  done();
});
