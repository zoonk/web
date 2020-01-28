import { pickBy } from 'lodash';
import { Post, Profile } from '@zoonk/models';
import {
  analytics,
  appLanguage,
  db,
  generateSlug,
  timestamp,
} from '@zoonk/utils';
import { serializePost } from '../serializers';

const postConverter: firebase.firestore.FirestoreDataConverter<Post.Get> = {
  toFirestore(data: Post.Get) {
    return data;
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<Post.Response>,
  ): Post.Get {
    return serializePost(snapshot);
  },
};

/**
 * Add a new post to the database.
 */
export const createPost = async (data: Post.Create): Promise<string> => {
  const slug = generateSlug(data.title);
  analytics().logEvent('post_add', { language: data.language });
  await db.doc(`posts/${slug}`).set(data);
  return slug;
};

/**
 * Update an existing post.
 */
export const updatePost = (data: Post.Update, id: string): Promise<void> => {
  const changes = pickBy(data, (value) => value !== undefined);
  return db.doc(`posts/${id}`).update(changes);
};

/**
 * Get a single post from the database.
 */
export const getPost = async (id: string): Promise<Post.Get> => {
  const snap = await db
    .doc(`posts/${id}`)
    .withConverter(postConverter)
    .get();
  const post = snap.data();

  if (!post) throw new Error('post_not_found');

  return post;
};

/**
 * Delete a post from the database.
 */
export const deletePost = async (
  id: string,
  profile: Profile.Response,
  editorId: string,
): Promise<void> => {
  // We need to update the editor ID to know who deleted this item.
  await updatePost(
    {
      updatedAt: timestamp,
      updatedBy: profile,
      updatedById: editorId,
    },
    id,
  );
  return db.doc(`posts/${id}`).delete();
};

interface PostArgs {
  category?: Post.Category;
  chapterId?: string;
  format?: Post.Format[];
  lastVisible?: firebase.firestore.DocumentSnapshot;
  limit?: number;
  topicId?: string;
  userId?: string;
}

/**
 * Get a list of posts from the database.
 */
export const listPosts = async ({
  category,
  chapterId,
  format,
  lastVisible,
  limit = 10,
  topicId,
  userId,
}: PostArgs): Promise<Post.Snapshot[]> => {
  let ref = db
    .collection('posts')
    .withConverter(postConverter)
    .orderBy('likes', 'desc')
    .orderBy('updatedAt', 'desc')
    .limit(limit);

  // Filter by category
  if (category) {
    ref = ref.where('category', '==', category);
  }

  // Filter by format
  if (format) {
    ref = ref.where('format', 'in', format);
  }

  // Filter by topic
  if (topicId) {
    ref = ref.where('topics', 'array-contains', topicId);
  }

  // Filter by chapter
  if (chapterId) {
    ref = ref.where('chapters', 'array-contains', chapterId);
  }

  // Filter by user
  if (userId) {
    ref = ref.where('createdById', '==', userId);
  }

  // Filter by language when there are no content specific-filters.
  if (!topicId && !chapterId) {
    ref = ref.where('language', '==', appLanguage);
  }

  if (lastVisible) {
    ref = ref.startAfter(lastVisible);
  }

  const snap = await ref.get();
  let serialized = snap.docs.map((doc) => ({ ...doc.data(), snap: doc }));

  // Sort by order when there's a chapterId (i.e. a lesson).
  if (chapterId) {
    serialized = serialized.sort(
      (a, b) => a.order[chapterId] - b.order[chapterId],
    );
  }

  return serialized;
};

/**
 * Update order.
 */
export const updateOrder = (
  posts: Post.Get[],
  chapterId: string,
  profile: Profile.Response,
  editorId: string,
): Promise<void> => {
  const batch = db.batch();
  posts.forEach((post) => {
    const ref = db.doc(`posts/${post.id}`);
    batch.update(ref, {
      [`order.${chapterId}`]: post.order[chapterId],
      updatedAt: timestamp,
      updatedBy: profile,
      updatedById: editorId,
    });
  });

  return batch.commit();
};
