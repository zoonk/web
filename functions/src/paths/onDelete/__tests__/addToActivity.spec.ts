import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onDeletePathAddToActivity } from '../addToActivity';

test('send a request to add a new delete to activities', async (done) => {
  const profile = { name: 'Leo', photo: 'leo.jpg' };
  const beforeData = {
    createdById: 'authorId',
    description: 'old description',
    language: 'en',
    title: 'old title',
    topics: ['topicId'],
    updatedAt: 'today',
    updatedById: 'editorId',
    url: 'old link',
  };
  const snap = { data: () => ({ ...beforeData }) };
  const context = { params: { id: 'itemId' } };
  const expected = {
    action: 'deleted',
    after: null,
    before: beforeData,
    category: 'paths',
    categoryId: 'itemId',
    createdById: 'editorId',
    itemPath: 'paths/itemId',
    language: 'en',
    title: 'old title',
    topics: ['topicId'],
    updatedAt: 'today',
    user: profile,
    userNotification: ['authorId'],
  };

  spyOn(db.collection(''), 'add').and.returnValue(true);
  spyOn(db, 'doc').and.returnValue({
    get: jest.fn().mockReturnValue({
      data: () => profile,
    }),
  });

  const wrapped = testEnv.wrap(onDeletePathAddToActivity);
  const req = await wrapped(snap, context);

  expect(req).toBe(true);
  expect(db.doc).toHaveBeenCalledWith('profile/editorId');
  expect(db.doc).toHaveBeenCalledTimes(1);
  expect(db.collection).toHaveBeenCalledWith('activity');
  expect(db.collection('').add).toHaveBeenCalledWith(expected);
  done();
});
