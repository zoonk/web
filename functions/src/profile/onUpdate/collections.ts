import * as functions from 'firebase-functions';
import { updateProfile } from '../../helpers';

export const onUpdateProfileUpdateCollections = functions.firestore
  .document('profile/{uid}')
  .onUpdate(async (change, context) => {
    const { uid } = context.params;
    const collections = [
      'chapters',
      'comments',
      'paths',
      'posts',
      'replies',
      'topics',
    ];
    const promises: any[] = [];

    collections.forEach((item) => {
      promises.push(updateProfile(change, item, 'created', uid));
      promises.push(updateProfile(change, item, 'updated', uid));
    });

    return Promise.all(promises);
  });
