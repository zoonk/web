import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import { when } from 'jest-when';

const testEnv = functions();
const db = admin.firestore();
const batch = db.batch();
const merge = true;

import { onWriteCategoryLikeUpdateXP } from '../earnXp';
import { xpActions } from '../../../settings';

const postData = {
  createdById: 'userId',
  groupId: 'groupId',
  topics: ['1', '2'],
};

beforeEach(() => {
  jest.clearAllMocks();
  spyOn(batch, 'commit').and.returnValue(true);
  when(db.doc as any)
    .calledWith('posts/postId')
    .mockReturnValue({ get: () => ({ data: () => postData }) });
  when(db.doc as any)
    .calledWith('leaderboard/userId')
    .mockReturnValue('userRef');
  when(db.doc as any)
    .calledWith('topics/1/leaderboard/userId')
    .mockReturnValue('topic1Ref');
  when(db.doc as any)
    .calledWith('topics/2/leaderboard/userId')
    .mockReturnValue('topic2Ref');
  when(db.doc as any)
    .calledWith('groups/groupId/followers/userId')
    .mockReturnValue('groupRef');
});

test('return if the data did not change', async (done) => {
  const change = {
    before: { data: () => ({ like: false }) },
    after: { data: () => undefined },
  };
  const wrapped = testEnv.wrap(onWriteCategoryLikeUpdateXP);
  const req = await wrapped(change);

  expect(req).toBe(false);
  expect(db.doc).not.toHaveBeenCalled();
  done();
});

test('return when users like their own content', async (done) => {
  const change = {
    before: { data: () => undefined },
    after: { data: () => ({ like: true }) },
  };
  const params = {
    category: 'posts',
    categoryId: 'postId',
    createdById: 'userId',
  };
  const wrapped = testEnv.wrap(onWriteCategoryLikeUpdateXP);
  const req = await wrapped(change, { params });

  expect(req).toBe(false);
  expect(db.doc).not.toHaveBeenCalledWith('leaderboard/userId');
  expect(db.doc).not.toHaveBeenCalledWith('topics/1/leaderboard/userId');
  expect(db.doc).not.toHaveBeenCalledWith('topics/2/leaderboard/userId');
  expect(db.doc).not.toHaveBeenCalledWith('groups/groupId/followers/userId');
  done();
});

test('increase XP when a user likes an item', async (done) => {
  const change = {
    before: { data: () => undefined },
    after: { data: () => ({ like: true }) },
  };
  const params = {
    category: 'posts',
    categoryId: 'postId',
    createdById: 'userWhoLiked',
  };
  const wrapped = testEnv.wrap(onWriteCategoryLikeUpdateXP);
  const req = await wrapped(change, { params });
  const xp = xpActions.likes;
  const payload = { createdById: 'userId', xp };

  expect(req).toBe(true);
  expect(db.doc).toHaveBeenCalledWith('leaderboard/userId');
  expect(db.doc).toHaveBeenCalledWith('topics/1/leaderboard/userId');
  expect(db.doc).toHaveBeenCalledWith('topics/2/leaderboard/userId');
  expect(db.doc).toHaveBeenCalledWith('groups/groupId/followers/userId');
  expect(db.doc).toHaveBeenCalledTimes(5);
  expect(batch.set).toHaveBeenCalledWith('userRef', payload, { merge });
  expect(batch.set).toHaveBeenCalledWith('topic1Ref', payload, { merge });
  expect(batch.set).toHaveBeenCalledWith('topic2Ref', payload, { merge });
  expect(batch.set).toHaveBeenCalledWith('groupRef', { xp }, { merge });
  done();
});

test('decrease XP when a user unlike an item', async (done) => {
  const change = {
    before: { data: () => ({ like: true }) },
    after: { data: () => undefined },
  };
  const params = {
    category: 'posts',
    categoryId: 'postId',
    createdById: 'userWhoLiked',
  };
  const wrapped = testEnv.wrap(onWriteCategoryLikeUpdateXP);
  const req = await wrapped(change, { params });
  const xp = -xpActions.likes;
  const payload = { createdById: 'userId', xp };

  expect(req).toBe(true);
  expect(db.doc).toHaveBeenCalledWith('leaderboard/userId');
  expect(db.doc).toHaveBeenCalledWith('topics/1/leaderboard/userId');
  expect(db.doc).toHaveBeenCalledWith('topics/2/leaderboard/userId');
  expect(db.doc).toHaveBeenCalledWith('groups/groupId/followers/userId');
  expect(db.doc).toHaveBeenCalledTimes(5);
  expect(batch.set).toHaveBeenCalledWith('userRef', payload, { merge });
  expect(batch.set).toHaveBeenCalledWith('topic1Ref', payload, { merge });
  expect(batch.set).toHaveBeenCalledWith('topic2Ref', payload, { merge });
  expect(batch.set).toHaveBeenCalledWith('groupRef', { xp }, { merge });
  done();
});
