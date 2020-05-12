import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Group, GroupMember, UserGroup } from '@zoonk/models';

const db = admin.firestore();

export const onCreateFollowerAddToUser = functions.firestore
  .document('groups/{groupId}/followers/{userId}')
  .onCreate(async (snap, context) => {
    const { groupId, userId } = context.params;
    const { joined } = snap.data() as GroupMember.Response;
    const doc = await db.doc(`groups/${groupId}`).get();
    const {
      description,
      photo,
      title,
      updatedAt,
    } = doc.data() as Group.Response;
    const group: UserGroup.Request = {
      description,
      id: groupId,
      joined,
      photo,
      title,
      updatedAt,
    };

    return db.doc(`users/${userId}/groups/${groupId}`).set(group);
  });
