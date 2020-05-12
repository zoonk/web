import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Group, GroupMember } from '@zoonk/models';
import { xpActions } from '../../settings';

const db = admin.firestore();

/**
 * When a group is created, this functions adds its author
 * to the followers list.
 */
export const onCreateGroupSetupAuthor = functions.firestore
  .document('groups/{id}')
  .onCreate((snap) => {
    const { createdAt, createdBy, createdById } = snap.data() as Group.Response;
    const member: GroupMember.Request = {
      ...createdBy,
      joined: createdAt,
      xp: xpActions.created_groups,
    };

    return db.doc(`groups/${snap.id}/followers/${createdById}`).set(member);
  });
